package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Supplier;
import com.erp.mapper.SupplierMapper;
import com.erp.service.SupplierService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class SupplierServiceImpl extends ServiceImpl<SupplierMapper, Supplier> implements SupplierService {

    @Override
    public Page<Supplier> getSupplierPage(Integer page, Integer pageSize, String supplierName) {
        Page<Supplier> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(supplierName)) {
            wrapper.like(Supplier::getSupplierName, supplierName);
        }
        
        wrapper.orderByDesc(Supplier::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
