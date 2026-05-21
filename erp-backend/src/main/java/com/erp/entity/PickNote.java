package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("pick_note")
public class PickNote implements Serializable {

    @TableId(value = "PickID", type = IdType.AUTO)
    private Integer pickID;

    private String pickNo;

    private Integer productionPlanID;

    private String planNo;

    private Integer warehouseID;

    private String warehouseName;

    private String pickDate;

    private String status;

    private String picker;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;

    private String remark;
}
