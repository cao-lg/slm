package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User implements Serializable {
    
    @TableId(value = "UserID", type = IdType.AUTO)
    private Integer userID;
    
    private String userName;
    
    private String password;
    
    private String realName;
    
    private String role;
    
    private String department;
    
    private String email;
    
    private String phone;
    
    private Integer status;
    
    private LocalDateTime lastLoginDate;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;
    
    private LocalDateTime updateDate;
}
