package com.erp.service;

import com.erp.dto.LoginDTO;
import com.erp.vo.LoginVO;
import com.erp.vo.UserVO;

public interface AuthService {
    
    LoginVO login(LoginDTO loginDTO);
    
    UserVO getUserInfo();
    
    void logout();
}
