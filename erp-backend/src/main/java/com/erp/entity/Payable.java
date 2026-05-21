package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("payable")
public class Payable implements Serializable {

    @TableId(value = "payableID", type = IdType.AUTO)
    private Integer payableID;

    private String payableNo;

    private Integer supplierID;

    private Integer purchaseOrderID;

    private BigDecimal totalAmount;

    private BigDecimal paidAmount;

    private BigDecimal pendingAmount;

    private LocalDateTime dueDate;

    private String status;

    private String remark;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
