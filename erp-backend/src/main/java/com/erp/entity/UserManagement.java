package com.erp.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("user_management")
public class UserManagement implements Serializable {
    
    @TableId(value = "ID", type = IdType.AUTO)
    private Integer id;
    
    private String userName;
    
    private String realName;
    
    private String password;
    
    private String role;
    
    private String department;
    
    private String email;
    
    private String phone;
    
    private Integer status;
    
    private String avatar;
    
    private String position;
    
    private LocalDateTime lastLoginDate;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createDate;
    
    private LocalDateTime updateDate;
    
    private String createBy;
    
    private String updateBy;
}
