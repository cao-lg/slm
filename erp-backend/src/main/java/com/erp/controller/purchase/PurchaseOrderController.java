package com.erp.controller.purchase;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.PurchaseOrder;
import com.erp.service.PurchaseOrderService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/purchase/orders")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public Result<PageResult<PurchaseOrder>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String supplierName) {
        
        Page<PurchaseOrder> pageResult = purchaseOrderService.getPurchaseOrderPage(page, pageSize, supplierName);
        PageResult<PurchaseOrder> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<PurchaseOrder> getById(@PathVariable Integer id) {
        PurchaseOrder order = purchaseOrderService.getById(id);
        if (order == null) {
            return Result.error("采购订单不存在");
        }
        return Result.success(order);
    }

    @PostMapping
    public Result<Void> add(@RequestBody PurchaseOrder order) {
        order.setOrderNo("CG" + System.currentTimeMillis());
        order.setCreateDate(LocalDateTime.now());
        if (order.getStatus() == null) {
            order.setStatus("pending");
        }
        purchaseOrderService.save(order);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody PurchaseOrder order) {
        order.setPoID(id);
        order.setUpdateDate(LocalDateTime.now());
        purchaseOrderService.updateById(order);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        purchaseOrderService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        PurchaseOrder order = purchaseOrderService.getById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        order.setStatus(status);
        order.setUpdateDate(LocalDateTime.now());
        purchaseOrderService.updateById(order);
        return Result.success();
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
