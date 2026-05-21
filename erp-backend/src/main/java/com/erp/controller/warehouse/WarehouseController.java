package com.erp.controller.warehouse;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Inventory;
import com.erp.entity.Product;
import com.erp.entity.Warehouse;
import com.erp.service.InventoryService;
import com.erp.service.ProductService;
import com.erp.service.WarehouseService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/warehouse")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    public Result<List<Warehouse>> getWarehouseList() {
        List<Warehouse> list = warehouseService.list();
        return Result.success(list);
    }

    @GetMapping("/{warehouseId}/inventory")
    public Result<PageResult<InventoryVO>> getWarehouseInventory(
            @PathVariable Integer warehouseId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String productName) {
        
        Page<Inventory> pageParam = new Page<>(page, pageSize);
        com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Inventory> wrapper = 
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
        
        wrapper.eq(Inventory::getWarehouseID, warehouseId);
        
        if (productName != null && !productName.isEmpty()) {
            List<Product> products = productService.list(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Product>()
                    .like(Product::getProductName, productName)
            );
            if (!products.isEmpty()) {
                List<Integer> productIds = products.stream().map(Product::getProductID).collect(java.util.stream.Collectors.toList());
                wrapper.in(Inventory::getProductID, productIds);
            }
        }
        
        wrapper.orderByDesc(Inventory::getUpdateDate);
        Page<Inventory> pageResult = inventoryService.page(pageParam, wrapper);
        
        List<InventoryVO> voList = pageResult.getRecords().stream().map(inv -> {
            InventoryVO vo = new InventoryVO();
            vo.setInventoryID(inv.getInventoryID());
            vo.setWarehouseID(inv.getWarehouseID());
            vo.setProductID(inv.getProductID());
            vo.setQuantity(inv.getQuantity());
            vo.setUnitCost(inv.getUnitCost());
            vo.setLocation(inv.getLocation());
            vo.setUpdateDate(inv.getUpdateDate());
            
            Product product = productService.getById(inv.getProductID());
            if (product != null) {
                vo.setProductName(product.getProductName());
                vo.setProductCode(product.getProductCode());
                vo.setUnit(product.getUnit());
                vo.setSpec(product.getSpec());
            }
            return vo;
        }).collect(java.util.stream.Collectors.toList());
        
        PageResult<InventoryVO> result = new PageResult<>();
        result.setList(voList);
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @PostMapping("/inventory/in")
    public Result<Void> inventoryIn(@RequestBody InventoryInRequest request) {
        Inventory inventory = new Inventory();
        inventory.setWarehouseID(request.getWarehouseID());
        inventory.setProductID(request.getProductID());
        inventory.setQuantity(request.getQuantity());
        inventory.setUnitCost(request.getUnitCost());
        inventory.setLocation(request.getLocation());
        
        com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Inventory> wrapper = 
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getWarehouseID, request.getWarehouseID())
               .eq(Inventory::getProductID, request.getProductID());
        
        Inventory existing = inventoryService.getOne(wrapper);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity().add(request.getQuantity()));
            existing.setUnitCost(request.getUnitCost());
            inventoryService.updateById(existing);
        } else {
            inventoryService.save(inventory);
        }
        
        return Result.success();
    }

    @PostMapping("/inventory/out")
    public Result<Void> inventoryOut(@RequestBody InventoryOutRequest request) {
        com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Inventory> wrapper = 
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getWarehouseID, request.getWarehouseID())
               .eq(Inventory::getProductID, request.getProductID());
        
        Inventory existing = inventoryService.getOne(wrapper);
        if (existing == null) {
            return Result.error("库存不足");
        }
        
        if (existing.getQuantity().compareTo(request.getQuantity()) < 0) {
            return Result.error("库存不足");
        }
        
        existing.setQuantity(existing.getQuantity().subtract(request.getQuantity()));
        inventoryService.updateById(existing);
        
        return Result.success();
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }

    @Data
    public static class InventoryVO {
        private Integer inventoryID;
        private Integer warehouseID;
        private Integer productID;
        private String productName;
        private String productCode;
        private String unit;
        private String spec;
        private BigDecimal quantity;
        private BigDecimal unitCost;
        private String location;
        private String updateDate;
    }

    @Data
    public static class InventoryInRequest {
        private Integer warehouseID;
        private Integer productID;
        private BigDecimal quantity;
        private BigDecimal unitCost;
        private String location;
    }

    @Data
    public static class InventoryOutRequest {
        private Integer warehouseID;
        private Integer productID;
        private BigDecimal quantity;
    }
}
