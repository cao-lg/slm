package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Customer;
import com.erp.mapper.CustomerMapper;
import com.erp.service.CustomerService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl extends ServiceImpl<CustomerMapper, Customer> implements CustomerService {

    @Override
    public Page<Customer> getCustomerPage(Integer page, Integer pageSize, String customerName) {
        Page<Customer> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Customer> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(customerName)) {
            wrapper.like(Customer::getCustomerName, customerName);
        }
        
        wrapper.orderByDesc(Customer::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
