package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("material")
public class Material implements Serializable {

    @TableId(value = "MaterialID", type = IdType.AUTO)
    private Integer materialID;

    private String materialCode;

    private String materialName;

    private String category;

    private String unit;

    private String spec;

    private BigDecimal cost;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    private LocalDateTime updateDate;
}
