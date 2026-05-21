package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("production_record")
public class ProductionRecord implements Serializable {

    @TableId(value = "record_id", type = IdType.AUTO)
    private Integer recordId;

    private String recordNo;

    private Integer planId;

    private String planNo;

    private Integer productId;

    private String productName;

    private Integer quantity;

    private Integer qualifiedQuantity;

    private Integer wasteQuantity;

    private LocalDate productionDate;

    private String operator;

    private String status;

    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
