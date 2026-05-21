package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("expense")
public class Expense implements Serializable {

    @TableId(value = "expenseID", type = IdType.AUTO)
    private Integer expenseID;

    private String expenseNo;

    private Integer applicantID;

    private String applicantName;

    private String department;

    private BigDecimal amount;

    private String category;

    private String description;

    private String status;

    private Integer approverID;

    private String approverName;

    private LocalDateTime approveDate;

    private String approveRemark;

    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
