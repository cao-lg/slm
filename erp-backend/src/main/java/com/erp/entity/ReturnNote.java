package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("return_note")
public class ReturnNote implements Serializable {

    @TableId(value = "ReturnID", type = IdType.AUTO)
    private Integer returnID;

    private String returnNo;

    private Integer sourceType;

    private Integer sourceID;

    private String sourceNo;

    private Integer customerID;

    private String customerName;

    private Integer warehouseID;

    private String warehouseName;

    private String returnDate;

    private String status;

    private BigDecimal totalAmount;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;

    private String remark;
}
