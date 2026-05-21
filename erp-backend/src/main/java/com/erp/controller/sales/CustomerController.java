package com.erp.controller.sales;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Customer;
import com.erp.service.CustomerService;
import com.erp.utils.IdGenerator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/sales/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public Result<PageResult<Customer>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String customerName) {
        
        Page<Customer> pageResult = customerService.getCustomerPage(page, pageSize, customerName);
        PageResult<Customer> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Customer> getById(@PathVariable Integer id) {
        Customer customer = customerService.getById(id);
        if (customer == null) {
            return Result.error("客户不存在");
        }
        return Result.success(customer);
    }

    @PostMapping
    public Result<Void> add(@RequestBody Customer customer) {
        customer.setCustomerCode(IdGenerator.generateCustomerCode());
        customer.setCreateDate(LocalDateTime.now());
        if (customer.getStatus() == null) {
            customer.setStatus(1);
        }
        customerService.save(customer);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Customer customer) {
        customer.setCustomerID(id);
        customer.setUpdateDate(LocalDateTime.now());
        customerService.updateById(customer);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        customerService.removeById(id);
        return Result.success();
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
