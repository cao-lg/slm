package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("message")
public class Message implements Serializable {
    
    @TableId(value = "MessageID", type = IdType.AUTO)
    private Integer messageID;
    
    private String title;
    
    private String content;
    
    private Integer messageType;
    
    private Integer senderID;
    
    private String senderName;
    
    private String receiverIDs;
    
    private String receiverNames;
    
    private Integer isAll;
    
    private Integer isRead;
    
    private LocalDateTime readDate;
    
    private LocalDateTime publishDate;
    
    private Integer priority;
    
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;
    
    private LocalDateTime updateDate;
}
