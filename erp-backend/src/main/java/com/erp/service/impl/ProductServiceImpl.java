package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Product;
import com.erp.mapper.ProductMapper;
import com.erp.service.ProductService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    @Override
    public Page<Product> getProductPage(Integer page, Integer pageSize, String productName) {
        Page<Product> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(productName)) {
            wrapper.like(Product::getProductName, productName);
        }
        
        wrapper.orderByDesc(Product::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
