package com.erp.controller;

import com.erp.common.Result;
import com.erp.entity.UserManagement;
import com.erp.service.UserManagementService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/system/user")
public class UserManagementController {
    
    @Autowired
    private UserManagementService userManagementService;
    
    @GetMapping("/list")
    public Result<Page<UserManagement>> getUserList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer status) {
        Page<UserManagement> result = userManagementService.getUserPage(page, pageSize, keyword, role, status);
        return Result.success(result);
    }
    
    @GetMapping("/detail")
    public Result<UserManagement> getUserDetail(@RequestParam Integer id) {
        UserManagement user = userManagementService.getById(id);
        return Result.success(user);
    }
    
    @PostMapping("/add")
    public Result<Void> addUser(@RequestBody UserManagement user) {
        boolean success = userManagementService.addUser(user);
        return success ? Result.success("添加成功") : Result.error("添加失败");
    }
    
    @PutMapping("/update")
    public Result<Void> updateUser(@RequestBody UserManagement user) {
        boolean success = userManagementService.updateUser(user);
        return success ? Result.success("更新成功") : Result.error("更新失败");
    }
    
    @DeleteMapping("/delete")
    public Result<Void> deleteUser(@RequestParam Integer id) {
        boolean success = userManagementService.deleteUser(id);
        return success ? Result.success("删除成功") : Result.error("删除失败");
    }
    
    @PutMapping("/status")
    public Result<Void> updateStatus(@RequestParam Integer id, @RequestParam Integer status) {
        boolean success = userManagementService.updateStatus(id, status);
        return success ? Result.success("状态更新成功") : Result.error("状态更新失败");
    }
    
    @PostMapping("/change-password")
    public Result<Void> changePassword(@RequestBody Map<String, String> params) {
        Integer id = Integer.parseInt(params.get("id"));
        String oldPassword = params.get("oldPassword");
        String newPassword = params.get("newPassword");
        
        boolean success = userManagementService.changePassword(id, oldPassword, newPassword);
        return success ? Result.success("密码修改成功") : Result.error("密码修改失败");
    }
    
    @PostMapping("/reset-password")
    public Result<Void> resetPassword(@RequestParam Integer id) {
        boolean success = userManagementService.resetPassword(id, "123456");
        return success ? Result.success("密码重置成功") : Result.error("密码重置失败");
    }
}
