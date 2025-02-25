package com.cs5224.ipos.model.documents;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class ApplicationSummary {

    @Field("applicationNum")
    String applicationNum;

    @Field("applicationType")
    String applicationType;

    @Field("applicationStatus")
    String applicationStatus;

    @Field("PublicationPatentNumForOldApplication")
    String publicationPatentNumForOldApplication;

    @Field("TitleOfInvention")
    String titleOfInvention;

    @Field("filingDate")
    String filingDate;

    @Field("lodgementDate")
    String lodgementDate;

    @Field("dateOfPublication")
    String dateOfPublication;

    @Field("ipc")
    String ipc;

}
