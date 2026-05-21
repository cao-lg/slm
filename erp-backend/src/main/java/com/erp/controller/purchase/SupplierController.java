package com.erp.controller.purchase;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Supplier;
import com.erp.service.SupplierService;
import com.erp.utils.IdGenerator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/purchase/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public Result<PageResult<Supplier>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String supplierName) {
        
        Page<Supplier> pageResult = supplierService.getSupplierPage(page, pageSize, supplierName);
        PageResult<Supplier> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Supplier> getById(@PathVariable Integer id) {
        Supplier supplier = supplierService.getById(id);
        if (supplier == null) {
            return Result.error("供应商不存在");
        }
        return Result.success(supplier);
    }

    @PostMapping
    public Result<Void> add(@RequestBody Supplier supplier) {
        supplier.setSupplierCode(IdGenerator.generateSupplierCode());
        supplier.setCreateDate(LocalDateTime.now());
        if (supplier.getStatus() == null) {
            supplier.setStatus(1);
        }
        supplierService.save(supplier);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Supplier supplier) {
        supplier.setSupplierID(id);
        supplier.setUpdateDate(LocalDateTime.now());
        supplierService.updateById(supplier);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        supplierService.removeById(id);
        return Result.success();
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
