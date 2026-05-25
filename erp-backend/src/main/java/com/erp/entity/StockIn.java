package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("stock_in")
public class StockIn implements Serializable {

    @TableId(value = "StockInID", type = IdType.AUTO)
    private Integer stockInID;

    private String stockInNo;

    private Integer purchaseOrderID;

    private String purchaseOrderNo;

    private Integer supplierID;

    private String supplierName;

    private Integer warehouseID;

    private String warehouseName;

    private LocalDateTime stockInDate;

    private BigDecimal totalQuantity;

    private BigDecimal totalAmount;

    private String status;

    private String remark;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
