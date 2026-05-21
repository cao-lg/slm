package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.SystemConfig;
import com.erp.mapper.SystemConfigMapper;
import com.erp.service.SystemConfigService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SystemConfigServiceImpl extends ServiceImpl<SystemConfigMapper, SystemConfig> implements SystemConfigService {
    
    @Override
    public List<SystemConfig> getConfigsByType(String configType) {
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("configType", configType);
        wrapper.orderByAsc("sortOrder");
        return this.list(wrapper);
    }
    
    @Override
    public Map<String, String> getAllConfigMap() {
        Map<String, String> configMap = new HashMap<>();
        List<SystemConfig> configs = this.list();
        for (SystemConfig config : configs) {
            configMap.put(config.getConfigKey(), config.getConfigValue());
        }
        return configMap;
    }
    
    @Override
    public boolean updateConfig(String configKey, String configValue) {
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("configKey", configKey);
        
        SystemConfig config = new SystemConfig();
        config.setConfigValue(configValue);
        
        return this.update(config, wrapper);
    }
    
    @Override
    public boolean batchUpdateConfigs(Map<String, String> configs) {
        for (Map.Entry<String, String> entry : configs.entrySet()) {
            this.updateConfig(entry.getKey(), entry.getValue());
        }
        return true;
    }
    
    @Override
    public String getConfigValue(String configKey, String defaultValue) {
        QueryWrapper<SystemConfig> wrapper = new QueryWrapper<>();
        wrapper.eq("configKey", configKey);
        SystemConfig config = this.getOne(wrapper);
        
        if (config != null && StringUtils.hasText(config.getConfigValue())) {
            return config.getConfigValue();
        }
        return defaultValue;
    }
}
