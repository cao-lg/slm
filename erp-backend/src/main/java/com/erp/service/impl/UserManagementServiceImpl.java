package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.UserManagement;
import com.erp.mapper.UserManagementMapper;
import com.erp.service.UserManagementService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
public class UserManagementServiceImpl extends ServiceImpl<UserManagementMapper, UserManagement> implements UserManagementService {
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public Page<UserManagement> getUserPage(Integer page, Integer pageSize, String keyword, String role, Integer status) {
        Page<UserManagement> pageParam = new Page<>(page, pageSize);
        QueryWrapper<UserManagement> wrapper = new QueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("userName", keyword)
                    .or().like("realName", keyword)
                    .or().like("phone", keyword));
        }
        if (StringUtils.hasText(role)) {
            wrapper.eq("role", role);
        }
        if (status != null) {
            wrapper.eq("status", status);
        }
        
        wrapper.orderByDesc("createDate");
        return this.page(pageParam, wrapper);
    }
    
    @Override
    public boolean addUser(UserManagement user) {
        if (!StringUtils.hasText(user.getPassword())) {
            user.setPassword("123456");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreateDate(LocalDateTime.now());
        return this.save(user);
    }
    
    @Override
    public boolean updateUser(UserManagement user) {
        user.setUpdateDate(LocalDateTime.now());
        return this.updateById(user);
    }
    
    @Override
    public boolean deleteUser(Integer id) {
        return this.removeById(id);
    }
    
    @Override
    public boolean updateStatus(Integer id, Integer status) {
        UserManagement user = new UserManagement();
        user.setId(id);
        user.setStatus(status);
        user.setUpdateDate(LocalDateTime.now());
        return this.updateById(user);
    }
    
    @Override
    public boolean changePassword(Integer id, String oldPassword, String newPassword) {
        UserManagement user = this.getById(id);
        if (user != null && passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setUpdateDate(LocalDateTime.now());
            return this.updateById(user);
        }
        return false;
    }
    
    @Override
    public boolean resetPassword(Integer id, String newPassword) {
        UserManagement user = this.getById(id);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setUpdateDate(LocalDateTime.now());
            return this.updateById(user);
        }
        return false;
    }
}
