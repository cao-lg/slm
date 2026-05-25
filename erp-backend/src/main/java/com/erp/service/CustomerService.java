package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Customer;
import com.baomidou.mybatisplus.extension.service.IService;
import java.math.BigDecimal;

public interface CustomerService extends IService<Customer> {
    Page<Customer> getCustomerPage(Integer page, Integer pageSize, String customerName);
    boolean checkCreditLimit(Integer customerID, BigDecimal amount);
    boolean updateUsedCredit(Integer customerID, BigDecimal amount, boolean isAdd);
}
