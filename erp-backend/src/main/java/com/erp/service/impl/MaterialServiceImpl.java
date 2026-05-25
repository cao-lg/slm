package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Material;
import com.erp.mapper.MaterialMapper;
import com.erp.service.MaterialService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class MaterialServiceImpl extends ServiceImpl<MaterialMapper, Material> implements MaterialService {

    @Override
    public Page<Material> getMaterialPage(Integer page, Integer pageSize, String materialName) {
        Page<Material> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Material> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(materialName)) {
            wrapper.like(Material::getMaterialName, materialName);
        }
        
        wrapper.orderByDesc(Material::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
