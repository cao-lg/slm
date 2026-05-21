package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("supplier")
public class Supplier implements Serializable {

    @TableId(value = "supplierID", type = IdType.AUTO)
    private Integer supplierID;

    private String supplierCode;

    private String supplierName;

    private String contact;

    private String phone;

    private String fax;

    private String email;

    private String address;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;
}
