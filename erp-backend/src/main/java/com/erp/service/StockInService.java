package com.erp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.erp.entity.StockIn;

import java.util.List;

public interface StockInService extends IService<StockIn> {
    List<StockIn> getStockInList(Integer page, Integer pageSize, String stockInNo, String supplierName, String status);
    long getStockInCount(String stockInNo, String supplierName, String status);
}
