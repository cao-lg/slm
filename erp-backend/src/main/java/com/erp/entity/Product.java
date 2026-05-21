package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("product")
public class Product implements Serializable {

    @TableId(value = "productID", type = IdType.AUTO)
    private Integer productID;

    private String productCode;

    private String productName;

    private String category;

    private String unit;

    private String spec;

    private BigDecimal price;

    private BigDecimal cost;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
