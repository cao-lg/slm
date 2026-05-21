package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("receivable")
public class Receivable implements Serializable {

    @TableId(value = "receivableID", type = IdType.AUTO)
    private Integer receivableID;

    private String receivableNo;

    private Integer customerID;

    private Integer salesOrderID;

    private BigDecimal totalAmount;

    private BigDecimal receivedAmount;

    private BigDecimal pendingAmount;

    private LocalDateTime dueDate;

    private String status;

    private String remark;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
