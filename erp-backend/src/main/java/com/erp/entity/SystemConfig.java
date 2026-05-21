package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("system_config")
public class SystemConfig implements Serializable {
    
    @TableId(value = "ConfigID", type = IdType.AUTO)
    private Integer configID;
    
    private String configKey;
    
    private String configName;
    
    private String configValue;
    
    private String configType;
    
    private String description;
    
    private Integer sortOrder;
    
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;
    
    private LocalDateTime updateDate;
}
