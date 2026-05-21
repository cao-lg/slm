package com.erp.controller.production;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.ProductionRecord;
import com.erp.service.ProductionRecordService;
import com.erp.utils.IdGenerator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/production/records")
public class ProductionRecordController {

    @Autowired
    private ProductionRecordService productionRecordService;

    @GetMapping
    public Result<PageResult<ProductionRecord>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        Page<ProductionRecord> pageResult = productionRecordService.getRecordPage(
            page, pageSize, productName, status, startDate, endDate);
        PageResult<ProductionRecord> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<ProductionRecord> getById(@PathVariable Integer id) {
        ProductionRecord record = productionRecordService.getById(id);
        if (record == null) {
            return Result.error("生产记录不存在");
        }
        return Result.success(record);
    }

    @PostMapping
    public Result<Void> add(@RequestBody ProductionRecord record) {
        record.setRecordNo(IdGenerator.generateProductionRecordNo());
        record.setCreateDate(LocalDateTime.now());
        record.setStatus("completed");
        productionRecordService.save(record);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody ProductionRecord record) {
        record.setRecordId(id);
        record.setUpdateDate(LocalDateTime.now());
        productionRecordService.updateById(record);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        productionRecordService.removeById(id);
        return Result.success();
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
