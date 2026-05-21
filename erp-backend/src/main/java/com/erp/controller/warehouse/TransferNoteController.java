package com.erp.controller.warehouse;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.TransferNote;
import com.erp.entity.TransferNoteDetail;
import com.erp.service.TransferNoteService;
import com.erp.service.TransferNoteDetailService;
import com.erp.service.InventoryService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/warehouse/transfers")
public class TransferNoteController {

    @Autowired
    private TransferNoteService transferNoteService;

    @Autowired
    private TransferNoteDetailService transferNoteDetailService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public Result<PageResult<TransferNote>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String transferNo,
            @RequestParam(required = false) String status) {
        
        Page<TransferNote> pageResult = transferNoteService.getTransferNotePage(page, pageSize, transferNo, status);
        PageResult<TransferNote> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<TransferNote> getById(@PathVariable Integer id) {
        TransferNote note = transferNoteService.getById(id);
        if (note == null) {
            return Result.error("调拨单不存在");
        }
        return Result.success(note);
    }

    @GetMapping("/{id}/details")
    public Result<List<TransferNoteDetail>> getDetails(@PathVariable Integer id) {
        List<TransferNoteDetail> details = transferNoteDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<TransferNoteDetail>()
                .eq(TransferNoteDetail::getTransferID, id)
        );
        return Result.success(details);
    }

    @PostMapping
    public Result<Void> add(@RequestBody TransferNoteRequest request) {
        TransferNote note = request.getNote();
        note.setTransferNo("DB" + System.currentTimeMillis());
        note.setStatus("pending");
        
        transferNoteService.save(note);
        
        for (TransferNoteDetail detail : request.getDetails()) {
            detail.setTransferID(note.getTransferID());
        }
        transferNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody TransferNoteRequest request) {
        TransferNote note = request.getNote();
        note.setTransferID(id);
        
        transferNoteService.updateById(note);
        
        transferNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<TransferNoteDetail>()
                .eq(TransferNoteDetail::getTransferID, id)
        );
        
        for (TransferNoteDetail detail : request.getDetails()) {
            detail.setTransferID(id);
        }
        transferNoteDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        transferNoteDetailService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<TransferNoteDetail>()
                .eq(TransferNoteDetail::getTransferID, id)
        );
        transferNoteService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Integer id) {
        TransferNote note = transferNoteService.getById(id);
        if (note == null) {
            return Result.error("调拨单不存在");
        }
        
        if (!"pending".equals(note.getStatus())) {
            return Result.error("只有待审核的调拨单才能审核");
        }
        
        List<TransferNoteDetail> details = transferNoteDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<TransferNoteDetail>()
                .eq(TransferNoteDetail::getTransferID, id)
        );
        
        for (TransferNoteDetail detail : details) {
            com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Inventory> wrapper = 
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
            wrapper.eq(Inventory::getWarehouseID, note.getFromWarehouseID())
                   .eq(Inventory::getProductID, detail.getProductID());
            Inventory fromInventory = inventoryService.getOne(wrapper);
            
            if (fromInventory == null || fromInventory.getQuantity().compareTo(detail.getQuantity()) < 0) {
                return Result.error("库存不足，无法调拨");
            }
            
            fromInventory.setQuantity(fromInventory.getQuantity().subtract(detail.getQuantity()));
            inventoryService.updateById(fromInventory);
            
            wrapper = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
            wrapper.eq(Inventory::getWarehouseID, note.getToWarehouseID())
                   .eq(Inventory::getProductID, detail.getProductID());
            Inventory toInventory = inventoryService.getOne(wrapper);
            
            if (toInventory != null) {
                toInventory.setQuantity(toInventory.getQuantity().add(detail.getQuantity()));
                inventoryService.updateById(toInventory);
            } else {
                Inventory newInventory = new Inventory();
                newInventory.setWarehouseID(note.getToWarehouseID());
                newInventory.setProductID(detail.getProductID());
                newInventory.setQuantity(detail.getQuantity());
                newInventory.setUnitCost(fromInventory.getUnitCost());
                inventoryService.save(newInventory);
            }
        }
        
        note.setStatus("completed");
        transferNoteService.updateById(note);
        
        return Result.success();
    }

    @Data
    public static class TransferNoteRequest {
        private TransferNote note;
        private List<TransferNoteDetail> details;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
