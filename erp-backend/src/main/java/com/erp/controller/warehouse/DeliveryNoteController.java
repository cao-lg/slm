package com.erp.controller.warehouse;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.DeliveryNote;
import com.erp.entity.DeliveryNoteDetail;
import com.erp.entity.SalesOrder;
import com.erp.entity.SalesOrderDetail;
import com.erp.service.DeliveryNoteService;
import com.erp.service.DeliveryNoteDetailService;
import com.erp.service.SalesOrderService;
import com.erp.service.SalesOrderDetailService;
import com.erp.service.InventoryService;
import com.erp.entity.Inventory;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/warehouse/deliveries")
public class DeliveryNoteController {

    @Autowired
    private DeliveryNoteService deliveryNoteService;

    @Autowired
    private DeliveryNoteDetailService deliveryNoteDetailService;

    @Autowired
    private SalesOrderService salesOrderService;

    @Autowired
    private SalesOrderDetailService salesOrderDetailService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public Result<PageResult<DeliveryNote>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String deliveryNo,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String status) {
        
        Page<DeliveryNote> pageResult = deliveryNoteService.getDeliveryNotePage(page, pageSize, deliveryNo, orderNo, status);
        PageResult<DeliveryNote> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<DeliveryNote> getById(@PathVariable Integer id) {
        DeliveryNote note = deliveryNoteService.getById(id);
        if (note == null) {
            return Result.error("发货单不存在");
        }
        return Result.success(note);
    }

    @GetMapping("/{id}/details")
    public Result<List<DeliveryNoteDetail>> getDetails(@PathVariable Integer id) {
        List<DeliveryNoteDetail> details = deliveryNoteDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<DeliveryNoteDetail>()
                .eq(DeliveryNoteDetail::getDeliveryID, id)
        );
        return Result.success(details);
    }

    @PostMapping
    public Result<Void> add(@RequestBody DeliveryNoteRequest request) {
        DeliveryNote note = request.getNote();
        note.setDeliveryNo("FH" + System.currentTimeMillis());
        note.setStatus("pending");
        
        SalesOrder salesOrder = salesOrderService.getById(note.getSoID());
        if (salesOrder != null) {
            note.setOrderNo(salesOrder.getOrderNo());
            note.setCustomerName(salesOrder.getCustomerName());
            note.setTotalAmount(salesOrder.getTotalAmount());
        }
        
        deliveryNoteService.save(note);
        
        for (DeliveryNoteDetail detail : request.getDetails()) {
            detail.setDeliveryID(note.getDeliveryID());
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
        }
        deliveryNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody DeliveryNoteRequest request) {
        DeliveryNote note = request.getNote();
        note.setDeliveryID(id);
        
        deliveryNoteService.updateById(note);
        
        deliveryNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<DeliveryNoteDetail>()
                .eq(DeliveryNoteDetail::getDeliveryID, id)
        );
        
        for (DeliveryNoteDetail detail : request.getDetails()) {
            detail.setDeliveryID(id);
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
        }
        deliveryNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        deliveryNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<DeliveryNoteDetail>()
                .eq(DeliveryNoteDetail::getDeliveryID, id)
        );
        deliveryNoteService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/ship")
    public Result<Void> ship(@PathVariable Integer id) {
        DeliveryNote note = deliveryNoteService.getById(id);
        if (note == null) {
            return Result.error("发货单不存在");
        }
        
        if (!"pending".equals(note.getStatus())) {
            return Result.error("只有待发货的发货单才能发货");
        }
        
        SalesOrder salesOrder = salesOrderService.getById(note.getSoID());
        if (salesOrder != null) {
            salesOrder.setStatus("shipped");
            salesOrderService.updateById(salesOrder);
        }
        
        note.setStatus("shipped");
        deliveryNoteService.updateById(note);
        
        return Result.success();
    }

    @GetMapping("/sales-orders")
    public Result<List<SalesOrder>> getSalesOrders() {
        List<SalesOrder> orders = salesOrderService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SalesOrder>()
                .eq(SalesOrder::getStatus, "approved")
                .or()
                .eq(SalesOrder::getStatus, "producing")
        );
        return Result.success(orders);
    }

    @GetMapping("/sales-orders/{id}/details")
    public Result<List<SalesOrderDetail>> getSalesOrderDetails(@PathVariable Integer id) {
        List<SalesOrderDetail> details = salesOrderDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SalesOrderDetail>()
                .eq(SalesOrderDetail::getSoID, id)
        );
        return Result.success(details);
    }

    @Data
    public static class DeliveryNoteRequest {
        private DeliveryNote note;
        private List<DeliveryNoteDetail> details;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
