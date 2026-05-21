package com.erp.service;

import com.erp.entity.OperationLog;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface OperationLogService extends IService<OperationLog> {
    
    Page<OperationLog> getLogPage(Integer page, Integer pageSize, String keyword, String module, String startDate, String endDate);
    
    boolean addLog(OperationLog log);
    
    boolean deleteLog(Integer logID);
    
    boolean clearLogs();
    
    long getTotalCount();
    
    long getTodayCount();
}
