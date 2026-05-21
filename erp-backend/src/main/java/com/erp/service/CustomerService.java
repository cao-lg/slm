package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Customer;
import com.baomidou.mybatisplus.extension.service.IService;

public interface CustomerService extends IService<Customer> {
    Page<Customer> getCustomerPage(Integer page, Integer pageSize, String customerName);
}
