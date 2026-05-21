package com.erp.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal implements Serializable {
    
    private Integer userId;
    
    private String username;
    
    private String role;
}
