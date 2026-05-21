package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.erp.dto.LoginDTO;
import com.erp.entity.User;
import com.erp.mapper.UserMapper;
import com.erp.service.AuthService;
import com.erp.utils.JwtUtils;
import com.erp.vo.LoginVO;
import com.erp.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName, loginDTO.getUsername());
        User user = userMapper.selectOne(wrapper);
        
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (user.getStatus() == 0) {
            throw new RuntimeException("用户已被禁用");
        }
        
        // 暂时使用简单密码验证
        if (!"258258258".equals(loginDTO.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        user.setLastLoginDate(LocalDateTime.now());
        userMapper.updateById(user);
        
        String token = jwtUtils.generateToken(user.getUserName(), user.getUserID(), user.getRole());
        
        UserVO userVO = new UserVO();
        userVO.setUserId(user.getUserID());
        userVO.setUsername(user.getUserName());
        userVO.setRealName(user.getRealName());
        userVO.setRole(user.getRole());
        userVO.setDepartment(user.getDepartment());
        userVO.setEmail(user.getEmail());
        userVO.setPhone(user.getPhone());
        
        return new LoginVO(token, userVO);
    }

    @Override
    public UserVO getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("用户未登录");
        }
        
        String username = authentication.getName();
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName, username);
        User user = userMapper.selectOne(wrapper);
        
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        UserVO userVO = new UserVO();
        userVO.setUserId(user.getUserID());
        userVO.setUsername(user.getUserName());
        userVO.setRealName(user.getRealName());
        userVO.setRole(user.getRole());
        userVO.setDepartment(user.getDepartment());
        userVO.setEmail(user.getEmail());
        userVO.setPhone(user.getPhone());
        
        return userVO;
    }

    @Override
    public void logout() {
        // 清除SecurityContext
        SecurityContextHolder.clearContext();
    }
}
