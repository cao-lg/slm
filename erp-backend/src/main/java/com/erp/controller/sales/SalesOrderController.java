package com.erp.controller.sales;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.SalesOrder;
import com.erp.entity.SalesOrderDetail;
import com.erp.service.SalesOrderService;
import com.erp.service.SalesOrderDetailService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/sales/orders")
public class SalesOrderController {

    @Autowired
    private SalesOrderService salesOrderService;

    @Autowired
    private SalesOrderDetailService salesOrderDetailService;

    @GetMapping
    public Result<PageResult<SalesOrder>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String status) {
        
        Page<SalesOrder> pageResult = salesOrderService.getSalesOrderPage(page, pageSize, orderNo, customerName, status);
        PageResult<SalesOrder> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<SalesOrder> getById(@PathVariable Integer id) {
        SalesOrder order = salesOrderService.getById(id);
        if (order == null) {
            return Result.error("销售订单不存在");
        }
        return Result.success(order);
    }

    @GetMapping("/{id}/details")
    public Result<List<SalesOrderDetail>> getDetails(@PathVariable Integer id) {
        List<SalesOrderDetail> details = salesOrderDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SalesOrderDetail>()
                .eq(SalesOrderDetail::getSoID, id)
        );
        return Result.success(details);
    }

    @PostMapping
    public Result<Void> add(@RequestBody SalesOrderRequest request) {
        SalesOrder order = request.getOrder();
        order.setOrderNo("XS" + System.currentTimeMillis());
        order.setCreateDate(LocalDateTime.now());
        order.setStatus("pending");
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SalesOrderDetail detail : request.getDetails()) {
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
            totalAmount = totalAmount.add(amount);
        }
        order.setTotalAmount(totalAmount);
        
        salesOrderService.save(order);
        
        for (SalesOrderDetail detail : request.getDetails()) {
            detail.setSoID(order.getSoID());
        }
        salesOrderDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody SalesOrderRequest request) {
        SalesOrder order = request.getOrder();
        order.setSoID(id);
        order.setUpdateDate(LocalDateTime.now());
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SalesOrderDetail detail : request.getDetails()) {
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
            totalAmount = totalAmount.add(amount);
        }
        order.setTotalAmount(totalAmount);
        
        salesOrderService.updateById(order);
        
        salesOrderDetailService.remove(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SalesOrderDetail>()
            .eq(SalesOrderDetail::getSoID, id));
        
        for (SalesOrderDetail detail : request.getDetails()) {
            detail.setSoID(id);
        }
        salesOrderDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        salesOrderDetailService.remove(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SalesOrderDetail>()
            .eq(SalesOrderDetail::getSoID, id));
        salesOrderService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        SalesOrder order = salesOrderService.getById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if ("producing".equals(status) && !"approved".equals(order.getStatus())) {
            return Result.error("只有已审核的订单才能开始生产");
        }
        if ("shipped".equals(status) && !"producing".equals(order.getStatus())) {
            return Result.error("只有生产中的订单才能发货");
        }
        if ("completed".equals(status) && !"shipped".equals(order.getStatus())) {
            return Result.error("只有已发货的订单才能完成");
        }
        
        order.setStatus(status);
        order.setUpdateDate(LocalDateTime.now());
        salesOrderService.updateById(order);
        return Result.success();
    }

    @Data
    public static class SalesOrderRequest {
        private SalesOrder order;
        private List<SalesOrderDetail> details;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
