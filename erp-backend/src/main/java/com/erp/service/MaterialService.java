package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Material;
import com.baomidou.mybatisplus.extension.service.IService;

public interface MaterialService extends IService<Material> {
    Page<Material> getMaterialPage(Integer page, Integer pageSize, String materialName);
}
