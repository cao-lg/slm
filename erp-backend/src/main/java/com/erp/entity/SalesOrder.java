package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("sales_order")
public class SalesOrder implements Serializable {

    @TableId(value = "OrderID", type = IdType.AUTO)
    private Integer orderID;

    private String orderNo;

    private Integer customerID;

    private LocalDateTime orderDate;

    private LocalDateTime deliveryDate;

    private BigDecimal totalAmount;

    private String status;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
