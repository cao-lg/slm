package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@TableName("purchase_order_detail")
public class PurchaseOrderDetail implements Serializable {

    @TableId(value = "DetailID", type = IdType.AUTO)
    private Integer detailID;

    private Integer poID;
    
    private Integer materialID;
    
    private String supplierProductCode;
    
    private String supplierProductName;
    
    private String ourMaterialCode;
    
    private String ourMaterialName;

    private BigDecimal quantity;
    
    private BigDecimal receivedQuantity;
    
    private BigDecimal remainingQuantity;

    private BigDecimal unitPrice;

    private BigDecimal amount;
    
    private String remark;
}
