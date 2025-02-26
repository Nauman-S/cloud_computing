package com.cs5224.ipos.domain;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class DistinctStatusCount {
    @Field("_id")
    private String _id;
    private int count;
}
