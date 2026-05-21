package com.erp.controller.warehouse;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.ReturnNote;
import com.erp.entity.ReturnNoteDetail;
import com.erp.service.ReturnNoteService;
import com.erp.service.ReturnNoteDetailService;
import com.erp.service.InventoryService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/warehouse/returns")
public class ReturnNoteController {

    @Autowired
    private ReturnNoteService returnNoteService;

    @Autowired
    private ReturnNoteDetailService returnNoteDetailService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public Result<PageResult<ReturnNote>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String returnNo,
            @RequestParam(required = false) String sourceNo,
            @RequestParam(required = false) String status) {
        
        Page<ReturnNote> pageResult = returnNoteService.getReturnNotePage(page, pageSize, returnNo, sourceNo, status);
        PageResult<ReturnNote> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<ReturnNote> getById(@PathVariable Integer id) {
        ReturnNote note = returnNoteService.getById(id);
        if (note == null) {
            return Result.error("退货单不存在");
        }
        return Result.success(note);
    }

    @GetMapping("/{id}/details")
    public Result<List<ReturnNoteDetail>> getDetails(@PathVariable Integer id) {
        List<ReturnNoteDetail> details = returnNoteDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ReturnNoteDetail>()
                .eq(ReturnNoteDetail::getReturnID, id)
        );
        return Result.success(details);
    }

    @PostMapping
    public Result<Void> add(@RequestBody ReturnNoteRequest request) {
        ReturnNote note = request.getNote();
        note.setReturnNo("TH" + System.currentTimeMillis());
        note.setStatus("pending");
        
        returnNoteService.save(note);
        
        for (ReturnNoteDetail detail : request.getDetails()) {
            detail.setReturnID(note.getReturnID());
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
        }
        returnNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody ReturnNoteRequest request) {
        ReturnNote note = request.getNote();
        note.setReturnID(id);
        
        returnNoteService.updateById(note);
        
        returnNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ReturnNoteDetail>()
                .eq(ReturnNoteDetail::getReturnID, id)
        );
        
        for (ReturnNoteDetail detail : request.getDetails()) {
            detail.setReturnID(id);
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
        }
        returnNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        returnNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ReturnNoteDetail>()
                .eq(ReturnNoteDetail::getReturnID, id)
        );
        returnNoteService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Integer id) {
        ReturnNote note = returnNoteService.getById(id);
        if (note == null) {
            return Result.error("退货单不存在");
        }
        
        if (!"pending".equals(note.getStatus())) {
            return Result.error("只有待审核的退货单才能审核");
        }
        
        List<ReturnNoteDetail> details = returnNoteDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ReturnNoteDetail>()
                .eq(ReturnNoteDetail::getReturnID, id)
        );
        
        for (ReturnNoteDetail detail : details) {
            com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Inventory> wrapper = 
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
            wrapper.eq(Inventory::getWarehouseID, note.getWarehouseID())
                   .eq(Inventory::getProductID, detail.getProductID());
            Inventory inventory = inventoryService.getOne(wrapper);
            
            if (inventory != null) {
                inventory.setQuantity(inventory.getQuantity().add(detail.getQuantity()));
                inventoryService.updateById(inventory);
            } else {
                Inventory newInventory = new Inventory();
                newInventory.setWarehouseID(note.getWarehouseID());
                newInventory.setProductID(detail.getProductID());
                newInventory.setQuantity(detail.getQuantity());
                newInventory.setUnitCost(detail.getPrice());
                inventoryService.save(newInventory);
            }
        }
        
        note.setStatus("completed");
        returnNoteService.updateById(note);
        
        return Result.success();
    }

    @Data
    public static class ReturnNoteRequest {
        private ReturnNote note;
        private List<ReturnNoteDetail> details;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
