package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Recipe;
import com.baomidou.mybatisplus.extension.service.IService;

public interface RecipeService extends IService<Recipe> {
    Page<Recipe> getRecipePage(Integer page, Integer pageSize, String recipeName);
}
