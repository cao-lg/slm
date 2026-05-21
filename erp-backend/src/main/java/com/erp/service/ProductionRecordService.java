package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.ProductionRecord;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ProductionRecordService extends IService<ProductionRecord> {
    Page<ProductionRecord> getRecordPage(Integer page, Integer pageSize, String productName, String status, String startDate, String endDate);
}
