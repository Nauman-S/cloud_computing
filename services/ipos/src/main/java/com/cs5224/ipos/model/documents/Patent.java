package com.cs5224.ipos.model.documents;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document
public class Patent {
    @Id
    String _id;

    @Field("lodgementDate")
    String lodgementDate;

    @Field("applicationNum")
    String applicationNum;
}
