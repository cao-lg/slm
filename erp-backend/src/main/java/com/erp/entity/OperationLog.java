package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("operation_log")
public class OperationLog implements Serializable {
    
    @TableId(value = "LogID", type = IdType.AUTO)
    private Integer logID;
    
    private String module;
    
    private String operationType;
    
    private String operationDesc;
    
    private Integer operatorID;
    
    private String operatorName;
    
    private String requestMethod;
    
    private String requestUrl;
    
    private String requestParams;
    
    private String requestBody;
    
    private String responseResult;
    
    private Integer statusCode;
    
    private String ipAddress;
    
    private String userAgent;
    
    private Long executionTime;
    
    private Integer isSuccess;
    
    private String errorMessage;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime operateDate;
}
