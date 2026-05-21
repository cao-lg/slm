package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("material_supplier")
public class MaterialSupplier implements Serializable {

    @TableId(value = "ID", type = IdType.AUTO)
    private Integer id;

    private Integer materialID;

    private Integer supplierID;

    private String supplierProductCode;

    private String supplierProductName;

    private BigDecimal purchasePrice;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    private LocalDateTime updateDate;
}
