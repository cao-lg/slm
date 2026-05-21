package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.ProductionRecord;
import com.erp.mapper.ProductionRecordMapper;
import com.erp.service.ProductionRecordService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ProductionRecordServiceImpl extends ServiceImpl<ProductionRecordMapper, ProductionRecord> implements ProductionRecordService {

    @Override
    public Page<ProductionRecord> getRecordPage(Integer page, Integer pageSize, String productName, String status, String startDate, String endDate) {
        Page<ProductionRecord> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<ProductionRecord> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(productName)) {
            wrapper.like(ProductionRecord::getProductName, productName);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(ProductionRecord::getStatus, status);
        }
        
        if (StringUtils.isNotBlank(startDate)) {
            wrapper.ge(ProductionRecord::getProductionDate, startDate);
        }
        
        if (StringUtils.isNotBlank(endDate)) {
            wrapper.le(ProductionRecord::getProductionDate, endDate);
        }
        
        wrapper.orderByDesc(ProductionRecord::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
