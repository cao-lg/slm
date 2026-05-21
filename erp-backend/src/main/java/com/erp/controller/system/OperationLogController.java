package com.erp.controller;

import com.erp.common.Result;
import com.erp.entity.OperationLog;
import com.erp.service.OperationLogService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/system/log")
public class OperationLogController {
    
    @Autowired
    private OperationLogService operationLogService;
    
    @GetMapping("/list")
    public Result<Page<OperationLog>> getLogList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Page<OperationLog> result = operationLogService.getLogPage(page, pageSize, keyword, module, startDate, endDate);
        return Result.success(result);
    }
    
    @GetMapping("/detail")
    public Result<OperationLog> getLogDetail(@RequestParam Integer logID) {
        OperationLog log = operationLogService.getById(logID);
        return Result.success(log);
    }
    
    @GetMapping("/stats")
    public Result<Map<String, Long>> getLogStats() {
        Map<String, Long> stats = Map.of(
                "total", operationLogService.getTotalCount(),
                "today", operationLogService.getTodayCount()
        );
        return Result.success(stats);
    }
    
    @DeleteMapping("/delete")
    public Result<Void> deleteLog(@RequestParam Integer logID) {
        boolean success = operationLogService.deleteLog(logID);
        return success ? Result.success("删除成功") : Result.error("删除失败");
    }
    
    @DeleteMapping("/clear")
    public Result<Void> clearLogs() {
        boolean success = operationLogService.clearLogs();
        return success ? Result.success("清空成功") : Result.error("清空失败");
    }
}
