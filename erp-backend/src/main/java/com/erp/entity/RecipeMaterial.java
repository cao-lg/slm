package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("recipe_material")
public class RecipeMaterial implements Serializable {

    @TableId(value = "material_id", type = IdType.AUTO)
    private Integer materialId;

    private Integer recipeId;

    private Integer materialIdRef;

    private String materialName;

    private String unit;

    private BigDecimal quantity;

    private BigDecimal wasteRate;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
