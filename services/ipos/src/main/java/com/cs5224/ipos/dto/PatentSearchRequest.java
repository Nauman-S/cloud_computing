package com.cs5224.ipos.dto;

import lombok.Data;

@Data
public class PatentSearchRequest {
    private String applicationNum;      //application number - exact match
    // private String applicationType;     //application type - exact match
    private String applicationStatus;   //application status - dropdown selection
    private String titleOfInvention;    //title of invention - partial match
    private String filingDateStart;     //filing date start range (inclusive)
    private String filingDateEnd;       //filing date end range (inclusive)
    private String lodgementDateStart;  //lodgement date start range (inclusive)
    private String lodgementDateEnd;    //lodgement date end range (inclusive)
    private String titleEmbedding;      //title embedding (similarity/vector search)
    private String documentEmbedding;   //document embedding (topic search with vector search)
}
