package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("return_note_detail")
public class ReturnNoteDetail implements Serializable {

    @TableId(value = "DetailID", type = IdType.AUTO)
    private Integer detailID;

    private Integer returnID;

    private Integer productID;

    private String productName;

    private String unit;

    private BigDecimal quantity;

    private BigDecimal price;

    private BigDecimal amount;

    private String remark;
}
