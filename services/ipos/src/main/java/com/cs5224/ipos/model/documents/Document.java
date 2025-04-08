package com.cs5224.ipos.model.documents;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class Document {

    @Field("fileName")
    String fileName;

    @Field("lodgementDate")
    String lodgementDate;

    @Field("url")
    String url; 

    @Field("docType")
    DocType docType; 

    @Data
    public static class DocType {
        @Field("description")
        private String description;

        @Field("code")
        private String code;
    }
}
