package com.erp.controller.production;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.ProductionPlan;
import com.erp.service.ProductionPlanService;
import com.erp.utils.IdGenerator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/production/plans")
public class ProductionPlanController {

    @Autowired
    private ProductionPlanService productionPlanService;

    @GetMapping
    public Result<PageResult<ProductionPlan>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String status) {
        
        Page<ProductionPlan> pageResult = productionPlanService.getPlanPage(page, pageSize, productName, status);
        PageResult<ProductionPlan> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<ProductionPlan> getById(@PathVariable Integer id) {
        ProductionPlan plan = productionPlanService.getById(id);
        if (plan == null) {
            return Result.error("生产计划不存在");
        }
        return Result.success(plan);
    }

    @PostMapping
    public Result<Void> add(@RequestBody ProductionPlan plan) {
        plan.setPlanNo(IdGenerator.generateProductionPlanNo());
        plan.setCreateDate(LocalDateTime.now());
        plan.setStatus("pending");
        plan.setCompletedQuantity(0);
        productionPlanService.save(plan);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody ProductionPlan plan) {
        plan.setPlanId(id);
        plan.setUpdateDate(LocalDateTime.now());
        productionPlanService.updateById(plan);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        productionPlanService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestBody StatusDTO statusDTO) {
        try {
            productionPlanService.updateStatus(id, statusDTO.getStatus());
            return Result.success();
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @Data
    public static class StatusDTO {
        private String status;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
