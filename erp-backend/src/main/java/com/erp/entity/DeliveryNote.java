package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("delivery_note")
public class DeliveryNote implements Serializable {

    @TableId(value = "DeliveryID", type = IdType.AUTO)
    private Integer deliveryID;

    private String deliveryNo;

    private Integer soID;

    private String orderNo;

    private Integer customerID;

    private String customerName;

    private String deliveryDate;

    private String status;

    private String carrier;

    private String trackingNo;

    private BigDecimal totalAmount;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;

    private String remark;
}
