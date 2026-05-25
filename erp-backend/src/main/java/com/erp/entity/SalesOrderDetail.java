package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@TableName("sales_order_detail")
public class SalesOrderDetail implements Serializable {

    @TableId(value = "DetailID", type = IdType.AUTO)
    private Integer detailID;

    private Integer soID;

    private Integer productID;
    
    private String customerProductCode;
    
    private String customerProductName;
    
    private String ourProductCode;
    
    private String ourProductName;

    private BigDecimal quantity;
    
    private BigDecimal originalPrice;

    private BigDecimal unitPrice;
    
    private BigDecimal costPrice;
    
    private BigDecimal profit;

    private BigDecimal amount;
    
    private String remark;
}
