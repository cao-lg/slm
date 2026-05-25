package com.erp.controller.purchase;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Material;
import com.erp.entity.MaterialSupplier;
import com.erp.service.MaterialService;
import com.erp.service.MaterialSupplierService;
import com.erp.utils.IdGenerator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/purchase")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @Autowired
    private MaterialSupplierService materialSupplierService;

    // 原材料管理接口
    @GetMapping("/materials")
    public Result<PageResult<Material>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String materialName) {
        
        Page<Material> pageResult = materialService.getMaterialPage(page, pageSize, materialName);
        PageResult<Material> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/materials/{id}")
    public Result<Material> getById(@PathVariable Integer id) {
        Material material = materialService.getById(id);
        if (material == null) {
            return Result.error("原材料不存在");
        }
        return Result.success(material);
    }

    @PostMapping("/materials")
    public Result<Void> add(@RequestBody Material material) {
        material.setMaterialCode(IdGenerator.generateProductCode());
        material.setCreateDate(LocalDateTime.now());
        if (material.getStatus() == null) {
            material.setStatus(1);
        }
        materialService.save(material);
        return Result.success();
    }

    @PutMapping("/materials/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Material material) {
        material.setMaterialID(id);
        material.setUpdateDate(LocalDateTime.now());
        materialService.updateById(material);
        return Result.success();
    }

    @DeleteMapping("/materials/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        materialSupplierService.remove(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<MaterialSupplier>()
                .eq(MaterialSupplier::getMaterialID, id)
        );
        materialService.removeById(id);
        return Result.success();
    }

    // 原材料供应商关联接口
    @GetMapping("/materials/{id}/suppliers")
    public Result<List<MaterialSupplier>> getSuppliers(@PathVariable Integer id) {
        List<MaterialSupplier> suppliers = materialSupplierService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<MaterialSupplier>()
                .eq(MaterialSupplier::getMaterialID, id)
        );
        return Result.success(suppliers);
    }

    @PostMapping("/material-suppliers")
    public Result<Void> addSupplier(@RequestBody MaterialSupplier supplier) {
        supplier.setCreateDate(LocalDateTime.now());
        if (supplier.getStatus() == null) {
            supplier.setStatus(1);
        }
        materialSupplierService.save(supplier);
        return Result.success();
    }

    @PutMapping("/material-suppliers/{id}")
    public Result<Void> updateSupplier(@PathVariable Integer id, @RequestBody MaterialSupplier supplier) {
        supplier.setId(id);
        supplier.setUpdateDate(LocalDateTime.now());
        materialSupplierService.updateById(supplier);
        return Result.success();
    }

    @DeleteMapping("/material-suppliers/{id}")
    public Result<Void> deleteSupplier(@PathVariable Integer id) {
        materialSupplierService.removeById(id);
        return Result.success();
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
