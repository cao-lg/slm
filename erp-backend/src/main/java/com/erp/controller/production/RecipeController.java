package com.erp.controller.production;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Recipe;
import com.erp.entity.RecipeMaterial;
import com.erp.service.RecipeMaterialService;
import com.erp.service.RecipeService;
import com.erp.utils.IdGenerator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/production/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;
    
    @Autowired
    private RecipeMaterialService recipeMaterialService;

    @GetMapping
    public Result<PageResult<Recipe>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String recipeName) {
        
        Page<Recipe> pageResult = recipeService.getRecipePage(page, pageSize, recipeName);
        PageResult<Recipe> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Recipe> getById(@PathVariable Integer id) {
        Recipe recipe = recipeService.getById(id);
        if (recipe == null) {
            return Result.error("配方单不存在");
        }
        return Result.success(recipe);
    }

    @GetMapping("/{id}/materials")
    public Result<List<RecipeMaterial>> getMaterials(@PathVariable Integer id) {
        List<RecipeMaterial> materials = recipeMaterialService.getMaterialsByRecipeId(id);
        return Result.success(materials);
    }

    @PostMapping
    public Result<Void> add(@RequestBody Recipe recipe) {
        recipe.setRecipeCode(IdGenerator.generateRecipeCode());
        recipe.setCreateDate(LocalDateTime.now());
        recipe.setStatus("active");
        recipeService.save(recipe);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Recipe recipe) {
        recipe.setRecipeId(id);
        recipe.setUpdateDate(LocalDateTime.now());
        recipeService.updateById(recipe);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        recipeService.removeById(id);
        return Result.success();
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
