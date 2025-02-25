package com.cs5224.ipos.controller;

import com.cs5224.ipos.command.PatentCommand;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/patent")
@RestController
@Slf4j
public class PatentController {

    @Autowired
    PatentCommand patentCommand;

    @GetMapping("/{applicationNumber}")
    public ResponseEntity<?> patent(
            @PathVariable String applicationNumber,
            @RequestParam(required=false) String groupBy,
            @RequestParam(required = false) String aggregate,
            Authentication authObject) {

        return patentCommand.execute(applicationNumber, groupBy, aggregate);
    }
}
