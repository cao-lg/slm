package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.SalesOrder;
import com.baomidou.mybatisplus.extension.service.IService;

public interface SalesOrderService extends IService<SalesOrder> {
    Page<SalesOrder> getSalesOrderPage(Integer page, Integer pageSize, String orderNo, String customerName, String status);
}
