package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("warehouse")
public class Warehouse implements Serializable {

    @TableId(value = "WarehouseID", type = IdType.AUTO)
    private Integer warehouseID;

    private String warehouseCode;

    private String warehouseName;

    private String type;

    private String location;

    private String manager;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;
}
