package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.RecipeMaterial;
import com.erp.mapper.RecipeMaterialMapper;
import com.erp.service.RecipeMaterialService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeMaterialServiceImpl extends ServiceImpl<RecipeMaterialMapper, RecipeMaterial> implements RecipeMaterialService {

    @Override
    public List<RecipeMaterial> getMaterialsByRecipeId(Integer recipeId) {
        LambdaQueryWrapper<RecipeMaterial> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RecipeMaterial::getRecipeId, recipeId);
        return this.list(wrapper);
    }
}
