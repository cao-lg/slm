package com.erp.service;

import com.erp.entity.UserManagement;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface UserManagementService extends IService<UserManagement> {
    
    Page<UserManagement> getUserPage(Integer page, Integer pageSize, String keyword, String role, Integer status);
    
    boolean addUser(UserManagement user);
    
    boolean updateUser(UserManagement user);
    
    boolean deleteUser(Integer id);
    
    boolean updateStatus(Integer id, Integer status);
    
    boolean changePassword(Integer id, String oldPassword, String newPassword);
    
    boolean resetPassword(Integer id, String newPassword);
}
