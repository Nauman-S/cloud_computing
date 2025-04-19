package com.cs5224.ipos.service.search;

import com.cs5224.ipos.dto.EmbeddingSearchRequest;
import com.cs5224.ipos.service.embedding.EmbeddingService;
import com.mongodb.client.MongoCollection;

import lombok.extern.slf4j.Slf4j;
import com.cs5224.ipos.dto.PatentSearchRequest;
import com.cs5224.ipos.model.documents.Patent;
import org.springframework.boot.autoconfigure.jms.activemq.ActiveMQProperties.Embedded;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.bson.Document;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.util.CloseableIterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import java.util.function.Consumer; 
import java.util.stream.Stream;

import java.util.ArrayList;
import java.util.List;

import static com.cs5224.ipos.constants.MongoConstants.PATENT_COLLECTION;

@Service
@Slf4j
public class PatentSearchService {

    private final MongoTemplate mongoTemplate;
    private final EmbeddingService embeddingService; 

    public PatentSearchService(@Qualifier("mongoIposDB") MongoTemplate mongoTemplate,
    EmbeddingService embeddingService) {
        this.mongoTemplate = mongoTemplate;
        this.embeddingService = embeddingService;
    }
    

    public List<Patent> searchPatents(PatentSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (request.getApplicationNum() != null && !request.getApplicationNum().isEmpty()) {
            criteriaList.add(Criteria.where("summary.applicationNum").is(request.getApplicationNum()));
        }

        // if (request.getApplicationType() != null && !request.getApplicationType().isEmpty()) {
        //     criteriaList.add(Criteria.where("summary.applicationType").is(request.getApplicationType()));
        // }

        if (request.getApplicationStatus() != null && !request.getApplicationStatus().isEmpty()) {
            criteriaList.add(Criteria.where("summary.applicationStatus").is(request.getApplicationStatus()));
        }

        if (request.getTitleOfInvention() != null && !request.getTitleOfInvention().isEmpty()) {
            criteriaList.add(Criteria.where("summary.TitleOfInvention")
                    .regex(request.getTitleOfInvention(), "i")); // Case-insensitive partial match
        }

        if (request.getFilingDateStart() != null ||  request.getFilingDateEnd() != null) {
            var criteria = Criteria.where("summary.filingDate");
            if (request.getFilingDateStart() != null) {
                criteria.gte(request.getFilingDateStart());
            }

            if (request.getFilingDateEnd() != null) {
                criteria.lte(request.getFilingDateEnd());
            }
            criteriaList.add(criteria);
        }

        if (request.getLodgementDateStart() != null ||  request.getLodgementDateEnd() != null) {
            var criteria = Criteria.where("summary.lodgementDate");
            if (request.getLodgementDateStart() != null) {
                criteria.gte(request.getLodgementDateStart());
            }
            if (request.getLodgementDateEnd() != null){
                criteria.lte(request.getLodgementDateEnd());
            }
            criteriaList.add(criteria);
        }
        

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        // pagination 
        int page     = request.getPage()     != null ? request.getPage()     : 0;
    int pageSize = request.getPageSize() != null ? request.getPageSize() : 20;
    query.skip(page * pageSize)
         .limit(pageSize);

         // batch size for cursor
         query.cursorBatchSize(50);

        // //  Explaining mongo query plang
        // Document queryDoc = query.getQueryObject();
        // MongoCollection<Document> collection = mongoTemplate.getDb().getCollection(PATENT_COLLECTION);
        // Document explain = collection.find(queryDoc).explain();

        // System.out.println("=== EXPLAIN PLAN ===");
        // System.out.println(explain.toJson());

        return mongoTemplate.find(query, Patent.class, PATENT_COLLECTION);
    }

    
    public void streamPatents(PatentSearchRequest request,
                            Consumer<Patent> processor) {
    // build the same Query you already have
    Query query = buildCriteriaQuery(request);

    // stream(...) now returns a java.util.stream.Stream<Patent>
    try (Stream<Patent> stream = 
           mongoTemplate.stream(query, Patent.class, PATENT_COLLECTION)) {
      stream.forEach(processor);
    }
  }

   
    private Query buildCriteriaQuery(PatentSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();
        // … copy your existing criteria‐adding logic here …
        if (!criteriaList.isEmpty()) {
            return new Query(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }
        return new Query();
    }

    public List<Patent> searchByTitleKeyword(EmbeddingSearchRequest request) {
    // Convert keyword to vector:
    List<Double> queryVector = embeddingService.getEmbedding(request.getQueryText());
    log.info("📐 Generated query vector size={} first10={}", queryVector.size(), queryVector.subList(0, Math.min(10, queryVector.size())));
    // Build the aggregation pipeline
    List<AggregationOperation> pipeline = new ArrayList<>();
    
    // search using knnBeta
    Document knnSearch = new Document("$search",
        new Document("index", "title-search") 
        .append("knnBeta", new Document("vector", queryVector)
                              .append("path", "titleEmbeddings")
                              .append("k", request.getK()))
    );
    pipeline.add(context -> knnSearch);
    
    Document project = new Document("$project",
        new Document("score", new Document("$meta", "searchScore"))
            .append("lodgementDate", 1)
            .append("applicationNum", 1)
            .append("summary", 1)
            .append("documents", 1)
            .append("applicant", 1)
            .append("grantAndRenewal", 1)
    );
    pipeline.add(context -> project);
    
    // Filter by score threshold:
    pipeline.add(Aggregation.match(Criteria.where("score").gte(request.getSimilarityThreshold())));
    
    Aggregation aggregation = Aggregation.newAggregation(pipeline);
    AggregationResults<Patent> aggResults = mongoTemplate.aggregate(aggregation, "patent", Patent.class);

    return aggResults.getMappedResults();
    
}

}

