package com.erp.controller.sales;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Customer;
import com.erp.entity.Product;
import com.erp.entity.Receivable;
import com.erp.entity.SalesOrder;
import com.erp.entity.SalesOrderDetail;
import com.erp.service.CustomerService;
import com.erp.service.ProductService;
import com.erp.service.ReceivableService;
import com.erp.service.SalesOrderService;
import com.erp.service.SalesOrderDetailService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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

    @Autowired
    private ProductService productService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ReceivableService receivableService;

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
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> add(@RequestBody SalesOrderRequest request) {
        SalesOrder order = request.getOrder();
        
        if (order == null) {
            return Result.error("订单信息不能为空");
        }
        if (order.getCustomerID() == null) {
            return Result.error("客户不能为空");
        }
        if (request.getDetails() == null || request.getDetails().isEmpty()) {
            return Result.error("订单明细至少包含一个产品");
        }
        
        order.setOrderNo("XS" + System.currentTimeMillis());
        order.setCreateDate(LocalDateTime.now());
        order.setStatus("pending");
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        BigDecimal totalQuantity = BigDecimal.ZERO;
        
        for (SalesOrderDetail detail : request.getDetails()) {
            if (detail.getProductID() == null) {
                return Result.error("产品不能为空");
            }
            if (detail.getQuantity() == null || detail.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                return Result.error("数量必须大于0");
            }
            if (detail.getUnitPrice() == null || detail.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                return Result.error("单价不能为负数");
            }
            
            BigDecimal amount = detail.getQuantity().multiply(detail.getUnitPrice());
            detail.setAmount(amount);
            totalAmount = totalAmount.add(amount);
            totalQuantity = totalQuantity.add(detail.getQuantity());
            
            Product product = productService.getById(detail.getProductID());
            if (product != null && product.getCost() != null) {
                detail.setCostPrice(product.getCost());
                BigDecimal profit = detail.getUnitPrice().subtract(product.getCost()).multiply(detail.getQuantity());
                detail.setProfit(profit);
                totalCost = totalCost.add(product.getCost().multiply(detail.getQuantity()));
                totalProfit = totalProfit.add(profit);
            } else {
                return Result.error("产品成本信息不完整");
            }
        }
        
        order.setTotalAmount(totalAmount);
        order.setTotalQuantity(totalQuantity);
        order.setTotalCost(totalCost);
        order.setTotalProfit(totalProfit);
        
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
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        BigDecimal totalQuantity = BigDecimal.ZERO;
        
        for (SalesOrderDetail detail : request.getDetails()) {
            BigDecimal amount = detail.getQuantity().multiply(detail.getUnitPrice());
            detail.setAmount(amount);
            totalAmount = totalAmount.add(amount);
            totalQuantity = totalQuantity.add(detail.getQuantity());
            
            // 从产品表获取成本并计算利润
            Product product = productService.getById(detail.getProductID());
            if (product != null) {
                detail.setCostPrice(product.getCost());
                BigDecimal profit = detail.getUnitPrice().subtract(product.getCost()).multiply(detail.getQuantity());
                detail.setProfit(profit);
                totalCost = totalCost.add(product.getCost().multiply(detail.getQuantity()));
                totalProfit = totalProfit.add(profit);
            }
        }
        
        order.setTotalAmount(totalAmount);
        order.setTotalQuantity(totalQuantity);
        order.setTotalCost(totalCost);
        order.setTotalProfit(totalProfit);
        
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
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        SalesOrder order = salesOrderService.getById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        String oldStatus = order.getStatus();
        
        if ("producing".equals(status) && !"approved".equals(order.getStatus())) {
            return Result.error("只有已审核的订单才能开始生产");
        }
        if ("shipped".equals(status) && !"producing".equals(order.getStatus())) {
            return Result.error("只有生产中的订单才能发货");
        }
        if ("completed".equals(status) && !"shipped".equals(order.getStatus())) {
            return Result.error("只有已发货的订单才能完成");
        }
        
        // 信用额度管理：审核时占用，完成或取消时释放
        if ("approved".equals(status) && !"approved".equals(oldStatus)) {
            boolean creditOk = customerService.checkCreditLimit(order.getCustomerID(), order.getTotalAmount());
            if (!creditOk) {
                return Result.error("客户信用额度不足");
            }
            customerService.updateUsedCredit(order.getCustomerID(), order.getTotalAmount(), true);
            
            // 自动生成应收款单
            Customer customer = customerService.getById(order.getCustomerID());
            Receivable receivable = new Receivable();
            receivable.setReceivableNo("AR" + System.currentTimeMillis());
            receivable.setCustomerID(order.getCustomerID());
            receivable.setSalesOrderID(order.getSoID());
            receivable.setTotalAmount(order.getTotalAmount());
            receivable.setReceivedAmount(java.math.BigDecimal.ZERO);
            receivable.setPendingAmount(order.getTotalAmount());
            receivable.setStatus("unpaid");
            receivable.setCreateDate(LocalDateTime.now());
            if (customer != null && customer.getPaymentDays() != null) {
                receivable.setDueDate(LocalDateTime.now().plusDays(customer.getPaymentDays()));
            }
            receivableService.save(receivable);
        }
        if (("completed".equals(status) || "cancelled".equals(status)) && "approved".equals(oldStatus)) {
            customerService.updateUsedCredit(order.getCustomerID(), order.getTotalAmount(), false);
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
