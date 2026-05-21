package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.RecipeMaterial;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface RecipeMaterialService extends IService<RecipeMaterial> {
    List<RecipeMaterial> getMaterialsByRecipeId(Integer recipeId);
}
