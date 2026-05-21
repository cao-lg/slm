package com.erp.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVO implements Serializable {
    
    private Integer userId;
    
    private String username;
    
    private String realName;
    
    private String role;
    
    private String department;
    
    private String email;
    
    private String phone;
}
