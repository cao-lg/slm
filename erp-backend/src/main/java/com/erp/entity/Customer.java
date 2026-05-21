package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("customer")
public class Customer implements Serializable {
    
    @TableId(value = "CustomerID", type = IdType.AUTO)
    private Integer customerID;
    
    private String customerCode;
    
    private String customerName;
    
    private String customerShortName;
    
    private String province;
    
    private String city;
    
    private Integer deliveryDays;
    
    private Integer paymentDays;
    
    private BigDecimal creditLimit;
    
    private BigDecimal usedCredit;
    
    private String contact;
    
    private String phone;
    
    private String fax;
    
    private String email;
    
    private String address;
    
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;
    
    private LocalDateTime updateDate;
}
