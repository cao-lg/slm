package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.PurchaseOrder;
import com.erp.entity.Supplier;
import com.erp.mapper.PurchaseOrderMapper;
import com.erp.service.PurchaseOrderService;
import com.erp.service.SupplierService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PurchaseOrderServiceImpl extends ServiceImpl<PurchaseOrderMapper, PurchaseOrder> implements PurchaseOrderService {

    @Autowired
    private SupplierService supplierService;

    @Override
    public Page<PurchaseOrder> getPurchaseOrderPage(Integer page, Integer pageSize, String supplierName, String status) {
        Page<PurchaseOrder> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<PurchaseOrder> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(supplierName)) {
            wrapper.like(PurchaseOrder::getPoNo, supplierName);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(PurchaseOrder::getStatus, status);
        }
        
        wrapper.orderByDesc(PurchaseOrder::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
