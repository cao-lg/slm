package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Supplier;
import com.baomidou.mybatisplus.extension.service.IService;

public interface SupplierService extends IService<Supplier> {
    Page<Supplier> getSupplierPage(Integer page, Integer pageSize, String supplierName);
}
