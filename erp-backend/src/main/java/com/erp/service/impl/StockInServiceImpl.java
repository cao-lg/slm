package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.StockIn;
import com.erp.mapper.StockInMapper;
import com.erp.service.StockInService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class StockInServiceImpl extends ServiceImpl<StockInMapper, StockIn> implements StockInService {
    
    @Override
    public List<StockIn> getStockInList(Integer page, Integer pageSize, String stockInNo, String supplierName, String status) {
        LambdaQueryWrapper<StockIn> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(stockInNo)) {
            wrapper.like(StockIn::getStockInNo, stockInNo);
        }
        if (StringUtils.hasText(supplierName)) {
            wrapper.like(StockIn::getSupplierName, supplierName);
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(StockIn::getStatus, status);
        }
        
        wrapper.orderByDesc(StockIn::getCreateDate);
        
        Page<StockIn> pageResult = page(new Page<>(page, pageSize), wrapper);
        return pageResult.getRecords();
    }
    
    @Override
    public long getStockInCount(String stockInNo, String supplierName, String status) {
        LambdaQueryWrapper<StockIn> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(stockInNo)) {
            wrapper.like(StockIn::getStockInNo, stockInNo);
        }
        if (StringUtils.hasText(supplierName)) {
            wrapper.like(StockIn::getSupplierName, supplierName);
        }
        if (StringUtils.hasText(status)) {
            wrapper.eq(StockIn::getStatus, status);
        }
        
        return count(wrapper);
    }
}
