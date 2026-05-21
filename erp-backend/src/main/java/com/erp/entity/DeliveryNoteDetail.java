package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("delivery_note_detail")
public class DeliveryNoteDetail implements Serializable {

    @TableId(value = "DetailID", type = IdType.AUTO)
    private Integer detailID;

    private Integer deliveryID;

    private Integer productID;

    private String productName;

    private String unit;

    private BigDecimal quantity;

    private BigDecimal price;

    private BigDecimal amount;

    private String remark;
}
