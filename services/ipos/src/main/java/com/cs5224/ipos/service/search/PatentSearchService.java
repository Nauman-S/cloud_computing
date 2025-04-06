package com.cs5224.ipos.service.search;

import com.cs5224.ipos.dto.PatentSearchRequest;
import com.cs5224.ipos.model.documents.Patent;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.cs5224.ipos.constants.MongoConstants.PATENT_COLLECTION;

@Service
public class PatentSearchService {

    private final MongoTemplate mongoTemplate;

    public PatentSearchService(@Qualifier("mongoIposDB") MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Patent> searchPatents(PatentSearchRequest request) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (request.getApplicationNum() != null && !request.getApplicationNum().isEmpty()) {
            criteriaList.add(Criteria.where("summary.applicationNum").is(request.getApplicationNum()));
        }

        if (request.getApplicationType() != null && !request.getApplicationType().isEmpty()) {
            criteriaList.add(Criteria.where("summary.applicationType").is(request.getApplicationType()));
        }

        if (request.getTitleOfInvention() != null && !request.getTitleOfInvention().isEmpty()) {
            criteriaList.add(Criteria.where("summary.TitleofInvention")
                    .regex(request.getTitleOfInvention(), "i")); // Case-insensitive partial match
        }

        if (request.getFilingDateStart() != null && request.getFilingDateEnd() != null) {
            criteriaList.add(Criteria.where("summary.filingDate")
                    .gte(request.getFilingDateStart())
                    .lte(request.getFilingDateEnd()));
        }

        if (request.getLodgementDateStart() != null && request.getLodgementDateEnd() != null) {
            criteriaList.add(Criteria.where("summary.lodgementDate")
                    .gte(request.getLodgementDateStart())
                    .lte(request.getLodgementDateEnd()));
        }

        // TODO: add similarity/embedding search if needed

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Patent.class, PATENT_COLLECTION);
    }
}
