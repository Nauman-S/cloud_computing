package com.cs5224.ipos.dao;

import com.cs5224.ipos.model.documents.Patent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PatentRepository extends MongoRepository<Patent,String> {

    List<Patent> findByApplicationNum(String applicationNumber);
}
