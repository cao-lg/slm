package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("pick_note_detail")
public class PickNoteDetail implements Serializable {

    @TableId(value = "DetailID", type = IdType.AUTO)
    private Integer detailID;

    private Integer pickID;

    private Integer productID;

    private String productName;

    private String unit;

    private BigDecimal quantity;

    private String remark;
}
