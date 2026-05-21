package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("purchase_order")
public class PurchaseOrder implements Serializable {

    @TableId(value = "POID", type = IdType.AUTO)
    private Integer poID;

    private String poNo;

    private Integer supplierID;

    private LocalDateTime orderDate;
    
    private LocalDateTime requestedDate;
    
    private LocalDateTime receivedDate;

    private LocalDateTime deliveryDate;
    
    private BigDecimal totalQuantity;
    
    private BigDecimal receivedQuantity;
    
    private BigDecimal remainingQuantity;

    private BigDecimal totalAmount;
    
    private String remark;

    private String status;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
