package com.cs5224.ipos.controller;

import com.cs5224.ipos.dao.patent.PatentRepository;
import com.cs5224.ipos.model.documents.Patent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/patent")
@RestController
@Slf4j
public class PatentController {

    @Autowired
    PatentRepository patentRepository;

    @GetMapping("/{applicationNumber}")
    public ResponseEntity<Patent> patent(@PathVariable String applicationNumber, Authentication authObject) {
        List<Patent> patentList = patentRepository.findByApplicationNum(applicationNumber);
        if (patentList.size() > 0 ) {
            log.error("More than 1 Application exists for application number: {}", applicationNumber);
        } else if (patentList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(patentList.get(0));
    }
}
