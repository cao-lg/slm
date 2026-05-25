package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("inventory")
public class Inventory implements Serializable {

    @TableId(value = "InventoryID", type = IdType.AUTO)
    private Integer inventoryID;

    private Integer warehouseID;

    private Integer productID;

    private Integer materialID;

    private BigDecimal quantity;

    private BigDecimal unitCost;

    private String location;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
