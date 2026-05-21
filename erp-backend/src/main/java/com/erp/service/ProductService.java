package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Product;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ProductService extends IService<Product> {
    Page<Product> getProductPage(Integer page, Integer pageSize, String productName);
}
