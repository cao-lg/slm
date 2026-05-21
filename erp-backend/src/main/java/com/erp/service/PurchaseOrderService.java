package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.PurchaseOrder;
import com.baomidou.mybatisplus.extension.service.IService;

public interface PurchaseOrderService extends IService<PurchaseOrder> {
    Page<PurchaseOrder> getPurchaseOrderPage(Integer page, Integer pageSize, String supplierName);
}
