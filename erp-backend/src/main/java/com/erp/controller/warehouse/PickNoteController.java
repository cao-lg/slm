package com.erp.controller.warehouse;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.PickNote;
import com.erp.entity.PickNoteDetail;
import com.erp.entity.ProductionPlan;
import com.erp.service.PickNoteService;
import com.erp.service.PickNoteDetailService;
import com.erp.service.ProductionPlanService;
import com.erp.service.InventoryService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/warehouse/picks")
public class PickNoteController {

    @Autowired
    private PickNoteService pickNoteService;

    @Autowired
    private PickNoteDetailService pickNoteDetailService;

    @Autowired
    private ProductionPlanService productionPlanService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public Result<PageResult<PickNote>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String pickNo,
            @RequestParam(required = false) String planNo,
            @RequestParam(required = false) String status) {
        
        Page<PickNote> pageResult = pickNoteService.getPickNotePage(page, pageSize, pickNo, planNo, status);
        PageResult<PickNote> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<PickNote> getById(@PathVariable Integer id) {
        PickNote note = pickNoteService.getById(id);
        if (note == null) {
            return Result.error("领料单不存在");
        }
        return Result.success(note);
    }

    @GetMapping("/{id}/details")
    public Result<List<PickNoteDetail>> getDetails(@PathVariable Integer id) {
        List<PickNoteDetail> details = pickNoteDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<PickNoteDetail>()
                .eq(PickNoteDetail::getPickID, id)
        );
        return Result.success(details);
    }

    @PostMapping
    public Result<Void> add(@RequestBody PickNoteRequest request) {
        PickNote note = request.getNote();
        note.setPickNo("LL" + System.currentTimeMillis());
        note.setStatus("pending");
        
        ProductionPlan plan = productionPlanService.getById(note.getProductionPlanID());
        if (plan != null) {
            note.setPlanNo(plan.getPlanNo());
        }
        
        pickNoteService.save(note);
        
        for (PickNoteDetail detail : request.getDetails()) {
            detail.setPickID(note.getPickID());
        }
        pickNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody PickNoteRequest request) {
        PickNote note = request.getNote();
        note.setPickID(id);
        
        pickNoteService.updateById(note);
        
        pickNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<PickNoteDetail>()
                .eq(PickNoteDetail::getPickID, id)
        );
        
        for (PickNoteDetail detail : request.getDetails()) {
            detail.setPickID(id);
        }
        pickNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        pickNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<PickNoteDetail>()
                .eq(PickNoteDetail::getPickID, id)
        );
        pickNoteService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Integer id) {
        PickNote note = pickNoteService.getById(id);
        if (note == null) {
            return Result.error("领料单不存在");
        }
        
        if (!"pending".equals(note.getStatus())) {
            return Result.error("只有待审核的领料单才能审核");
        }
        
        List<PickNoteDetail> details = pickNoteDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<PickNoteDetail>()
                .eq(PickNoteDetail::getPickID, id)
        );
        
        for (PickNoteDetail detail : details) {
            com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Inventory> wrapper = 
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
            wrapper.eq(Inventory::getWarehouseID, note.getWarehouseID())
                   .eq(Inventory::getProductID, detail.getProductID());
            Inventory inventory = inventoryService.getOne(wrapper);
            
            if (inventory == null || inventory.getQuantity().compareTo(detail.getQuantity()) < 0) {
                return Result.error("库存不足，无法领料");
            }
            
            inventory.setQuantity(inventory.getQuantity().subtract(detail.getQuantity()));
            inventoryService.updateById(inventory);
        }
        
        ProductionPlan plan = productionPlanService.getById(note.getProductionPlanID());
        if (plan != null) {
            plan.setStatus("producing");
            productionPlanService.updateById(plan);
        }
        
        note.setStatus("completed");
        pickNoteService.updateById(note);
        
        return Result.success();
    }

    @GetMapping("/production-plans")
    public Result<List<ProductionPlan>> getProductionPlans() {
        List<ProductionPlan> plans = productionPlanService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ProductionPlan>()
                .eq(ProductionPlan::getStatus, "approved")
        );
        return Result.success(plans);
    }

    @Data
    public static class PickNoteRequest {
        private PickNote note;
        private List<PickNoteDetail> details;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
