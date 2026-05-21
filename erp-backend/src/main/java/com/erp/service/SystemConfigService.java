package com.erp.service;

import com.erp.entity.SystemConfig;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

public interface SystemConfigService extends IService<SystemConfig> {
    
    List<SystemConfig> getConfigsByType(String configType);
    
    Map<String, String> getAllConfigMap();
    
    boolean updateConfig(String configKey, String configValue);
    
    boolean batchUpdateConfigs(Map<String, String> configs);
    
    String getConfigValue(String configKey, String defaultValue);
}
