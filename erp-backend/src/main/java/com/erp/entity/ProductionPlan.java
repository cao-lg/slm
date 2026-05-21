package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("production_plan")
public class ProductionPlan implements Serializable {

    @TableId(value = "plan_id", type = IdType.AUTO)
    private Integer planId;

    private String planNo;

    private Integer productId;

    private String productName;

    private Integer plannedQuantity;

    private Integer completedQuantity;

    private LocalDate startDate;

    private LocalDate endDate;

    private String responsible;

    private String status;

    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
