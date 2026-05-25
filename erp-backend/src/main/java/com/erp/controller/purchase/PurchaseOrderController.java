package com.erp.controller.purchase;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Payable;
import com.erp.entity.PurchaseOrder;
import com.erp.entity.PurchaseOrderDetail;
import com.erp.entity.Supplier;
import com.erp.service.MaterialSupplierService;
import com.erp.service.PayableService;
import com.erp.service.PurchaseOrderService;
import com.erp.service.PurchaseOrderDetailService;
import com.erp.service.SupplierService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/purchase/orders")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private PurchaseOrderDetailService purchaseOrderDetailService;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private MaterialSupplierService materialSupplierService;

    @Autowired
    private PayableService payableService;

    @GetMapping
    public Result<PageResult<PurchaseOrder>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String status) {
        
        Page<PurchaseOrder> pageResult = purchaseOrderService.getPurchaseOrderPage(page, pageSize, supplierName, status);
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

    @GetMapping("/{id}/details")
    public Result<List<PurchaseOrderDetail>> getDetails(@PathVariable Integer id) {
        List<PurchaseOrderDetail> details = purchaseOrderDetailService.getByPurchaseOrderId(id);
        return Result.success(details);
    }

    @PostMapping
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> add(@RequestBody PurchaseOrderRequest request) {
        PurchaseOrder order = request.getOrder();
        order.setPoNo("CG" + System.currentTimeMillis());
        order.setCreateDate(LocalDateTime.now());
        if (order.getStatus() == null) {
            order.setStatus("pending");
        }
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalQuantity = BigDecimal.ZERO;
        
        for (PurchaseOrderDetail detail : request.getDetails()) {
            BigDecimal amount = detail.getQuantity().multiply(detail.getUnitPrice());
            detail.setAmount(amount);
            detail.setReceivedQuantity(BigDecimal.ZERO);
            detail.setRemainingQuantity(detail.getQuantity());
            totalAmount = totalAmount.add(amount);
            totalQuantity = totalQuantity.add(detail.getQuantity());
        }
        
        order.setTotalQuantity(totalQuantity);
        order.setTotalAmount(totalAmount);
        order.setReceivedQuantity(BigDecimal.ZERO);
        order.setRemainingQuantity(totalQuantity);
        
        purchaseOrderService.save(order);
        
        for (PurchaseOrderDetail detail : request.getDetails()) {
            detail.setPoID(order.getPoID());
        }
        purchaseOrderDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @PutMapping("/{id}")
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> update(@PathVariable Integer id, @RequestBody PurchaseOrderRequest request) {
        PurchaseOrder order = request.getOrder();
        order.setPoID(id);
        order.setUpdateDate(LocalDateTime.now());
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalQuantity = BigDecimal.ZERO;
        
        for (PurchaseOrderDetail detail : request.getDetails()) {
            BigDecimal amount = detail.getQuantity().multiply(detail.getUnitPrice());
            detail.setAmount(amount);
            totalAmount = totalAmount.add(amount);
            totalQuantity = totalQuantity.add(detail.getQuantity());
        }
        
        order.setTotalQuantity(totalQuantity);
        order.setTotalAmount(totalAmount);
        
        purchaseOrderService.updateById(order);
        
        purchaseOrderDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<PurchaseOrderDetail>()
                .eq(PurchaseOrderDetail::getPoID, id)
        );
        
        for (PurchaseOrderDetail detail : request.getDetails()) {
            detail.setPoID(id);
        }
        purchaseOrderDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> delete(@PathVariable Integer id) {
        purchaseOrderDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<PurchaseOrderDetail>()
                .eq(PurchaseOrderDetail::getPoID, id)
        );
        purchaseOrderService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        PurchaseOrder order = purchaseOrderService.getById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        String oldStatus = order.getStatus();
        
        // 自动生成应付款单
        if ("approved".equals(status) && !"approved".equals(oldStatus)) {
            Supplier supplier = supplierService.getById(order.getSupplierID());
            Payable payable = new Payable();
            payable.setPayableNo("AP" + System.currentTimeMillis());
            payable.setSupplierID(order.getSupplierID());
            payable.setPurchaseOrderID(order.getPoID());
            payable.setTotalAmount(order.getTotalAmount());
            payable.setPaidAmount(java.math.BigDecimal.ZERO);
            payable.setPendingAmount(order.getTotalAmount());
            payable.setStatus("unpaid");
            payable.setCreateDate(LocalDateTime.now());
            if (supplier != null && supplier.getPaymentDays() != null) {
                payable.setDueDate(LocalDateTime.now().plusDays(supplier.getPaymentDays()));
            }
            payableService.save(payable);
        }
        
        order.setStatus(status);
        order.setUpdateDate(LocalDateTime.now());
        purchaseOrderService.updateById(order);
        return Result.success();
    }

    @PutMapping("/{id}/receive")
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> receive(@PathVariable Integer id, @RequestBody ReceiveRequest request) {
        PurchaseOrder order = purchaseOrderService.getById(id);
        if (order == null) {
            return Result.error("采购订单不存在");
        }
        
        if (!"approved".equals(order.getStatus())) {
            return Result.error("只有已审核的订单才能收货");
        }
        
        List<PurchaseOrderDetail> details = purchaseOrderDetailService.getByPurchaseOrderId(id);
        
        for (ReceiveDetailRequest receiveDetail : request.getDetails()) {
            PurchaseOrderDetail detail = details.stream()
                .filter(d -> d.getDetailID().equals(receiveDetail.getDetailID()))
                .findFirst()
                .orElse(null);
            
            if (detail != null) {
                BigDecimal currentReceived = detail.getReceivedQuantity() != null ? 
                    detail.getReceivedQuantity() : BigDecimal.ZERO;
                BigDecimal currentRemaining = detail.getRemainingQuantity() != null ? 
                    detail.getRemainingQuantity() : detail.getQuantity();
                
                detail.setReceivedQuantity(currentReceived.add(receiveDetail.getReceiveQuantity()));
                detail.setRemainingQuantity(currentRemaining.subtract(receiveDetail.getReceiveQuantity()));
                
                purchaseOrderDetailService.updateById(detail);
            }
        }
        
        BigDecimal totalReceived = details.stream()
            .map(PurchaseOrderDetail::getReceivedQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalRemaining = details.stream()
            .map(PurchaseOrderDetail::getRemainingQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        order.setReceivedQuantity(totalReceived);
        order.setRemainingQuantity(totalRemaining);
        order.setReceivedDate(LocalDateTime.now());
        
        if (order.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            order.setStatus("stocked");
        }
        
        purchaseOrderService.updateById(order);
        
        return Result.success();
    }

    @Data
    public static class PurchaseOrderRequest {
        private PurchaseOrder order;
        private List<PurchaseOrderDetail> details;
    }

    @Data
    public static class ReceiveRequest {
        private List<ReceiveDetailRequest> details;
    }

    @Data
    public static class ReceiveDetailRequest {
        private Integer detailID;
        private BigDecimal receiveQuantity;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
