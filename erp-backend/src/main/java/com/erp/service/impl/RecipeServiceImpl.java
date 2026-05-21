package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Recipe;
import com.erp.mapper.RecipeMapper;
import com.erp.service.RecipeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class RecipeServiceImpl extends ServiceImpl<RecipeMapper, Recipe> implements RecipeService {

    @Override
    public Page<Recipe> getRecipePage(Integer page, Integer pageSize, String recipeName) {
        Page<Recipe> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Recipe> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(recipeName)) {
            wrapper.like(Recipe::getRecipeName, recipeName);
        }
        
        wrapper.orderByDesc(Recipe::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
