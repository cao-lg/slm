package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("transfer_note")
public class TransferNote implements Serializable {

    @TableId(value = "TransferID", type = IdType.AUTO)
    private Integer transferID;

    private String transferNo;

    private Integer fromWarehouseID;

    private String fromWarehouseName;

    private Integer toWarehouseID;

    private String toWarehouseName;

    private String transferDate;

    private String status;

    private String creator;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateDate;

    private String remark;
}
