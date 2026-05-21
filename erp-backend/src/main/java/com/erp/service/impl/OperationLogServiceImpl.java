package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.OperationLog;
import com.erp.mapper.OperationLogMapper;
import com.erp.service.OperationLogService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class OperationLogServiceImpl extends ServiceImpl<OperationLogMapper, OperationLog> implements OperationLogService {
    
    @Override
    public Page<OperationLog> getLogPage(Integer page, Integer pageSize, String keyword, String module, String startDate, String endDate) {
        Page<OperationLog> pageParam = new Page<>(page, pageSize);
        QueryWrapper<OperationLog> wrapper = new QueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("operationDesc", keyword)
                    .or().like("operatorName", keyword));
        }
        if (StringUtils.hasText(module)) {
            wrapper.eq("module", module);
        }
        if (StringUtils.hasText(startDate)) {
            wrapper.ge("operateDate", LocalDateTime.of(LocalDate.parse(startDate), LocalTime.MIN));
        }
        if (StringUtils.hasText(endDate)) {
            wrapper.le("operateDate", LocalDateTime.of(LocalDate.parse(endDate), LocalTime.MAX));
        }
        
        wrapper.orderByDesc("operateDate");
        return this.page(pageParam, wrapper);
    }
    
    @Override
    public boolean addLog(OperationLog log) {
        return this.save(log);
    }
    
    @Override
    public boolean deleteLog(Integer logID) {
        return this.removeById(logID);
    }
    
    @Override
    public boolean clearLogs() {
        return this.remove(null);
    }
    
    @Override
    public long getTotalCount() {
        return this.count();
    }
    
    @Override
    public long getTodayCount() {
        QueryWrapper<OperationLog> wrapper = new QueryWrapper<>();
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        wrapper.ge("operateDate", startOfDay);
        return this.count(wrapper);
    }
}
