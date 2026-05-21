package com.erp.controller;

import com.erp.common.Result;
import com.erp.entity.SystemConfig;
import com.erp.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/system/config")
public class SystemConfigController {
    
    @Autowired
    private SystemConfigService systemConfigService;
    
    @GetMapping("/list")
    public Result<List<SystemConfig>> getConfigList(@RequestParam(required = false) String configType) {
        List<SystemConfig> configs;
        if (configType != null && !configType.isEmpty()) {
            configs = systemConfigService.getConfigsByType(configType);
        } else {
            configs = systemConfigService.list();
        }
        return Result.success(configs);
    }
    
    @GetMapping("/map")
    public Result<Map<String, String>> getConfigMap() {
        Map<String, String> configMap = systemConfigService.getAllConfigMap();
        return Result.success(configMap);
    }
    
    @GetMapping("/value")
    public Result<String> getConfigValue(@RequestParam String configKey) {
        String value = systemConfigService.getConfigValue(configKey, "");
        return Result.success(value);
    }
    
    @PutMapping("/update")
    public Result<Void> updateConfig(@RequestBody SystemConfig config) {
        boolean success = systemConfigService.updateById(config);
        return success ? Result.success("更新成功") : Result.error("更新失败");
    }
    
    @PutMapping("/batch-update")
    public Result<Void> batchUpdateConfigs(@RequestBody Map<String, String> configs) {
        boolean success = systemConfigService.batchUpdateConfigs(configs);
        return success ? Result.success("批量更新成功") : Result.error("批量更新失败");
    }
    
    @DeleteMapping("/delete")
    public Result<Void> deleteConfig(@RequestParam Integer configID) {
        boolean success = systemConfigService.removeById(configID);
        return success ? Result.success("删除成功") : Result.error("删除失败");
    }
}
