package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("quotation")
public class Quotation implements Serializable {

    @TableId(value = "QuotationID", type = IdType.AUTO)
    private Integer quotationID;

    private String quotationNo;

    private Integer customerID;

    private LocalDateTime quotationDate;

    private LocalDateTime validUntil;

    private BigDecimal totalAmount;

    private String status;

    private String remark;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
