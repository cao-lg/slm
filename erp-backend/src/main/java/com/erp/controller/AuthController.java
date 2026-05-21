package com.erp.controller;

import com.erp.common.Result;
import com.erp.dto.LoginDTO;
import com.erp.service.AuthService;
import com.erp.vo.LoginVO;
import com.erp.vo.UserVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        LoginVO loginVO = authService.login(loginDTO);
        return Result.success("登录成功", loginVO);
    }

    @GetMapping("/userinfo")
    public Result<UserVO> getUserInfo() {
        UserVO userVO = authService.getUserInfo();
        return Result.success(userVO);
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout();
        return Result.success("登出成功");
    }
}
