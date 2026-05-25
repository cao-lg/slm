package com.erp.controller.warehouse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.*;
import com.erp.service.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/warehouse/stock-in")
public class StockInController {

    @Autowired
    private StockInService stockInService;

    @Autowired
    private StockInDetailService stockInDetailService;

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private PurchaseOrderDetailService purchaseOrderDetailService;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public Result<PageResult<StockIn>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String stockInNo,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String status) {
        
        List<StockIn> list = stockInService.getStockInList(page, pageSize, stockInNo, supplierName, status);
        long total = stockInService.getStockInCount(stockInNo, supplierName, status);
        
        PageResult<StockIn> result = new PageResult<>();
        result.setList(list);
        result.setTotal(total);
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<StockIn> getById(@PathVariable Integer id) {
        StockIn stockIn = stockInService.getById(id);
        if (stockIn == null) {
            return Result.error("入库单不存在");
        }
        return Result.success(stockIn);
    }

    @GetMapping("/{id}/details")
    public Result<List<StockInDetail>> getDetails(@PathVariable Integer id) {
        List<StockInDetail> details = stockInDetailService.getByStockInId(id);
        return Result.success(details);
    }

    @PostMapping("/from-purchase")
    @Transactional(rollbackFor = Exception.class)
    public Result<StockIn> createFromPurchase(@RequestBody StockInRequest request) {
        Integer purchaseOrderId = request.getPurchaseOrderID();
        PurchaseOrder purchaseOrder = purchaseOrderService.getById(purchaseOrderId);
        
        if (purchaseOrder == null) {
            return Result.error("采购订单不存在");
        }
        
        if (!"approved".equals(purchaseOrder.getStatus())) {
            return Result.error("只有已审核的采购订单才能入库");
        }
        
        Supplier supplier = supplierService.getById(purchaseOrder.getSupplierID());
        String supplierName = supplier != null ? supplier.getSupplierName() : "";
        
        StockIn stockIn = new StockIn();
        stockIn.setStockInNo("RK" + System.currentTimeMillis());
        stockIn.setPurchaseOrderID(purchaseOrderId);
        stockIn.setPurchaseOrderNo(purchaseOrder.getPoNo());
        stockIn.setSupplierID(purchaseOrder.getSupplierID());
        stockIn.setSupplierName(supplierName);
        stockIn.setWarehouseID(request.getWarehouseID());
        stockIn.setWarehouseName(request.getWarehouseName());
        stockIn.setStockInDate(LocalDateTime.now());
        stockIn.setStatus("completed");
        stockIn.setCreator(request.getCreator());
        stockIn.setCreateDate(LocalDateTime.now());
        
        BigDecimal totalQuantity = BigDecimal.ZERO;
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<StockInDetail> details = new ArrayList<>();
        
        for (StockInDetailRequest detailReq : request.getDetails()) {
            StockInDetail detail = new StockInDetail();
            detail.setMaterialID(detailReq.getMaterialID());
            detail.setMaterialName(detailReq.getMaterialName());
            detail.setMaterialCode(detailReq.getMaterialCode());
            detail.setSpecification(detailReq.getSpecification());
            detail.setUnit(detailReq.getUnit());
            detail.setQuantity(detailReq.getQuantity());
            detail.setUnitPrice(detailReq.getUnitPrice());
            
            BigDecimal amount = detailReq.getQuantity().multiply(detailReq.getUnitPrice());
            detail.setAmount(amount);
            
            totalQuantity = totalQuantity.add(detailReq.getQuantity());
            totalAmount = totalAmount.add(amount);
            
            detail.setRemark(detailReq.getRemark());
            
            details.add(detail);
        }
        
        stockIn.setTotalQuantity(totalQuantity);
        stockIn.setTotalAmount(totalAmount);
        
        stockInService.save(stockIn);
        
        for (StockInDetail detail : details) {
            detail.setStockInID(stockIn.getStockInID());
        }
        stockInDetailService.saveBatch(details);
        
        BigDecimal receivedQty = BigDecimal.ZERO;
        List<PurchaseOrderDetail> poDetails = purchaseOrderDetailService.list(
            new LambdaQueryWrapper<PurchaseOrderDetail>()
                .eq(PurchaseOrderDetail::getPoID, purchaseOrderId)
        );
        
        for (StockInDetail detail : details) {
            receivedQty = receivedQty.add(detail.getQuantity());
            
            for (PurchaseOrderDetail poDetail : poDetails) {
                if (poDetail.getMaterialID() != null && poDetail.getMaterialID().equals(detail.getMaterialID())) {
                    BigDecimal detReceived = poDetail.getReceivedQuantity() != null ? 
                        poDetail.getReceivedQuantity() : BigDecimal.ZERO;
                    BigDecimal detRemaining = poDetail.getRemainingQuantity() != null ? 
                        poDetail.getRemainingQuantity() : poDetail.getQuantity();
                    
                    poDetail.setReceivedQuantity(detReceived.add(detail.getQuantity()));
                    poDetail.setRemainingQuantity(detRemaining.subtract(detail.getQuantity()));
                    
                    if (poDetail.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                        poDetail.setStatus("stocked");
                    }
                    
                    purchaseOrderDetailService.updateById(poDetail);
                    break;
                }
            }
            
            LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Inventory::getWarehouseID, request.getWarehouseID())
                  .eq(Inventory::getMaterialID, detail.getMaterialID());
            Inventory existing = inventoryService.getOne(wrapper);
            
            if (existing != null) {
                existing.setQuantity(existing.getQuantity().add(detail.getQuantity()));
                existing.setUpdateDate(LocalDateTime.now());
                inventoryService.updateById(existing);
            } else {
                Inventory inventory = new Inventory();
                inventory.setWarehouseID(request.getWarehouseID());
                inventory.setMaterialID(detail.getMaterialID());
                inventory.setQuantity(detail.getQuantity());
                inventory.setUnitCost(detail.getUnitPrice());
                inventory.setUpdateDate(LocalDateTime.now());
                inventoryService.save(inventory);
            }
        }
        
        BigDecimal currentReceived = purchaseOrder.getReceivedQuantity() != null ? 
            purchaseOrder.getReceivedQuantity() : BigDecimal.ZERO;
        BigDecimal currentRemaining = purchaseOrder.getRemainingQuantity() != null ? 
            purchaseOrder.getRemainingQuantity() : purchaseOrder.getTotalQuantity();
        
        purchaseOrder.setReceivedQuantity(currentReceived.add(receivedQty));
        purchaseOrder.setRemainingQuantity(currentRemaining.subtract(receivedQty));
        purchaseOrder.setReceivedDate(LocalDateTime.now());
        
        if (purchaseOrder.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            purchaseOrder.setStatus("stocked");
        }
        
        purchaseOrderService.updateById(purchaseOrder);
        
        return Result.success(stockIn);
    }

    @DeleteMapping("/{id}")
    @Transactional(rollbackFor = Exception.class)
    public Result<Void> delete(@PathVariable Integer id) {
        StockIn stockIn = stockInService.getById(id);
        if (stockIn == null) {
            return Result.error("入库单不存在");
        }
        
        List<StockInDetail> details = stockInDetailService.getByStockInId(id);
        
        if (stockIn.getPurchaseOrderID() != null) {
            PurchaseOrder purchaseOrder = purchaseOrderService.getById(stockIn.getPurchaseOrderID());
            if (purchaseOrder != null) {
                BigDecimal returnedQty = BigDecimal.ZERO;
                List<PurchaseOrderDetail> poDetails = purchaseOrderDetailService.list(
                    new LambdaQueryWrapper<PurchaseOrderDetail>()
                        .eq(PurchaseOrderDetail::getPoID, stockIn.getPurchaseOrderID())
                );
                
                for (StockInDetail detail : details) {
                    returnedQty = returnedQty.add(detail.getQuantity());
                    
                    LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
                    wrapper.eq(Inventory::getWarehouseID, stockIn.getWarehouseID())
                          .eq(Inventory::getMaterialID, detail.getMaterialID());
                    Inventory existing = inventoryService.getOne(wrapper);
                    
                    if (existing != null) {
                        existing.setQuantity(existing.getQuantity().subtract(detail.getQuantity()));
                        if (existing.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                            inventoryService.removeById(existing.getInventoryID());
                        } else {
                            existing.setUpdateDate(LocalDateTime.now());
                            inventoryService.updateById(existing);
                        }
                    }
                    
                    for (PurchaseOrderDetail poDetail : poDetails) {
                        if (poDetail.getMaterialID() != null && poDetail.getMaterialID().equals(detail.getMaterialID())) {
                            BigDecimal detReceived = poDetail.getReceivedQuantity() != null ? 
                                poDetail.getReceivedQuantity() : BigDecimal.ZERO;
                            BigDecimal detRemaining = poDetail.getRemainingQuantity() != null ? 
                                poDetail.getRemainingQuantity() : BigDecimal.ZERO;
                            
                            poDetail.setReceivedQuantity(detReceived.subtract(detail.getQuantity()));
                            poDetail.setRemainingQuantity(detRemaining.add(detail.getQuantity()));
                            poDetail.setStatus("partial");
                            
                            purchaseOrderDetailService.updateById(poDetail);
                            break;
                        }
                    }
                }
                
                BigDecimal currentReceived = purchaseOrder.getReceivedQuantity() != null ? 
                    purchaseOrder.getReceivedQuantity() : BigDecimal.ZERO;
                BigDecimal currentRemaining = purchaseOrder.getRemainingQuantity() != null ? 
                    purchaseOrder.getRemainingQuantity() : BigDecimal.ZERO;
                
                purchaseOrder.setReceivedQuantity(currentReceived.subtract(returnedQty));
                purchaseOrder.setRemainingQuantity(currentRemaining.add(returnedQty));
                
                if (purchaseOrder.getRemainingQuantity().compareTo(BigDecimal.ZERO) > 0) {
                    purchaseOrder.setStatus("approved");
                }
                
                purchaseOrderService.updateById(purchaseOrder);
            }
        }
        
        for (StockInDetail detail : details) {
            stockInDetailService.removeById(detail.getDetailID());
        }
        
        stockInService.removeById(id);
        return Result.success();
    }

    @Data
    public static class StockInRequest {
        private Integer purchaseOrderID;
        private Integer warehouseID;
        private String warehouseName;
        private String creator;
        private List<StockInDetailRequest> details;
    }

    @Data
    public static class StockInDetailRequest {
        private Integer materialID;
        private String materialName;
        private String materialCode;
        private String specification;
        private String unit;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
        private String remark;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
