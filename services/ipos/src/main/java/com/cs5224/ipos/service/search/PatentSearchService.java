package com.cs5224.ipos.service.search;

import com.cs5224.ipos.dto.EmbeddingSearchRequest;
import com.cs5224.ipos.dto.PatentSearchRequest;
import com.cs5224.ipos.model.documents.Patent;
import com.cs5224.ipos.service.embedding.EmbeddingService;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static com.cs5224.ipos.constants.MongoConstants.PATENT_COLLECTION;

@Service
@Slf4j
public class PatentSearchService {

    private static final int DEFAULT_BATCH_SIZE = 500;
    private final MongoTemplate mongoTemplate;
    private final EmbeddingService embeddingService;

    public PatentSearchService(@Qualifier("mongoIposDB") MongoTemplate mongoTemplate,
                               EmbeddingService embeddingService) {
        this.mongoTemplate = mongoTemplate;
        this.embeddingService = embeddingService;
    }

    /**
     * Always returns all matching patents, optimized with cursor batch size and projection.
     */
    public List<Patent> searchPatents(PatentSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();
        if (request.getApplicationNum() != null && !request.getApplicationNum().isEmpty()) {
            criteriaList.add(Criteria.where("summary.applicationNum").is(request.getApplicationNum()));
        }
        if (request.getApplicationStatus() != null && !request.getApplicationStatus().isEmpty()) {
            criteriaList.add(Criteria.where("summary.applicationStatus").is(request.getApplicationStatus()));
        }
        if (request.getTitleOfInvention() != null && !request.getTitleOfInvention().isEmpty()) {
            criteriaList.add(Criteria.where("summary.TitleOfInvention").regex(request.getTitleOfInvention(), "i"));
        }
        if (request.getFilingDateStart() != null || request.getFilingDateEnd() != null) {
            Criteria c = Criteria.where("summary.filingDate");
            if (request.getFilingDateStart() != null) c.gte(request.getFilingDateStart());
            if (request.getFilingDateEnd() != null) c.lte(request.getFilingDateEnd());
            criteriaList.add(c);
        }
        if (request.getLodgementDateStart() != null || request.getLodgementDateEnd() != null) {
            Criteria c = Criteria.where("summary.lodgementDate");
            if (request.getLodgementDateStart() != null) c.gte(request.getLodgementDateStart());
            if (request.getLodgementDateEnd() != null) c.lte(request.getLodgementDateEnd());
            criteriaList.add(c);
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }
        
        // Set cursor batch size for efficient retrieval
        query.cursorBatchSize(DEFAULT_BATCH_SIZE);

        // Project only the fields we actually need to reduce network payload
        query.fields()
             .include("summary")
             .include("applicationNum")
             .include("lodgementDate")
             .include("applicant")
             .include("grantAndRenewal");

        return mongoTemplate.find(query, Patent.class, PATENT_COLLECTION);
    }

    /**
     * Stream patents matching the criteria (no pagination internally).
     */
    public void streamPatents(PatentSearchRequest request, Consumer<Patent> processor) {
        Query query = buildCriteriaQuery(request);
        query.cursorBatchSize(DEFAULT_BATCH_SIZE);
        try (Stream<Patent> stream = mongoTemplate.stream(query, Patent.class, PATENT_COLLECTION)) {
            stream.forEach(processor);
        }
    }

    private Query buildCriteriaQuery(PatentSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();
        // Replicate criteria logic here if needed
        if (!criteriaList.isEmpty()) {
            return new Query(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }
        return new Query();
    }

    /**
     * Semantic search by title embeddings.
     */
    public List<Patent> searchByTitleKeyword(EmbeddingSearchRequest request) {
        List<Double> queryVector = embeddingService.getEmbedding(request.getQueryText());
        log.info("📐 Query vector size={} first10={}", queryVector.size(), queryVector.subList(0, Math.min(10, queryVector.size())));

        List<AggregationOperation> pipeline = new ArrayList<>();
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
        pipeline.add(Aggregation.match(Criteria.where("score").gte(request.getSimilarityThreshold())));

        Aggregation aggregation = Aggregation.newAggregation(pipeline);
        AggregationResults<Patent> aggResults = mongoTemplate.aggregate(aggregation, PATENT_COLLECTION, Patent.class);

        return aggResults.getMappedResults();
    }
}
