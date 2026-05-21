package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("recipe")
public class Recipe implements Serializable {

    @TableId(value = "recipe_id", type = IdType.AUTO)
    private Integer recipeId;

    private String recipeCode;

    private String recipeName;

    private Integer productId;

    private String productName;

    private String version;

    private String status;

    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
