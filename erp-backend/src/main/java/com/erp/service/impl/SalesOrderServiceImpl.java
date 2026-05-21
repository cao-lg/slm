package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.SalesOrder;
import com.erp.mapper.SalesOrderMapper;
import com.erp.service.SalesOrderService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class SalesOrderServiceImpl extends ServiceImpl<SalesOrderMapper, SalesOrder> implements SalesOrderService {

    @Override
    public Page<SalesOrder> getSalesOrderPage(Integer page, Integer pageSize, String orderNo, String customerName, String status) {
        Page<SalesOrder> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<SalesOrder> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(orderNo)) {
            wrapper.like(SalesOrder::getOrderNo, orderNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(SalesOrder::getStatus, status);
        }
        
        wrapper.orderByDesc(SalesOrder::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
