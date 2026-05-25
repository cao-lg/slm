package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Customer;
import com.erp.mapper.CustomerMapper;
import com.erp.service.CustomerService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

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

    @Override
    public boolean checkCreditLimit(Integer customerID, BigDecimal amount) {
        Customer customer = this.getById(customerID);
        if (customer == null) {
            return false;
        }
        if (customer.getCreditLimit() == null) {
            return true;
        }
        BigDecimal usedCredit = customer.getUsedCredit() != null ? customer.getUsedCredit() : BigDecimal.ZERO;
        BigDecimal newUsedCredit = usedCredit.add(amount);
        return newUsedCredit.compareTo(customer.getCreditLimit()) <= 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateUsedCredit(Integer customerID, BigDecimal amount, boolean isAdd) {
        Customer customer = this.getById(customerID);
        if (customer == null) {
            return false;
        }
        BigDecimal usedCredit = customer.getUsedCredit() != null ? customer.getUsedCredit() : BigDecimal.ZERO;
        if (isAdd) {
            customer.setUsedCredit(usedCredit.add(amount));
        } else {
            BigDecimal newUsedCredit = usedCredit.subtract(amount);
            customer.setUsedCredit(newUsedCredit.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newUsedCredit);
        }
        return this.updateById(customer);
    }
}
