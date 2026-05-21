package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.ProductionPlan;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ProductionPlanService extends IService<ProductionPlan> {
    Page<ProductionPlan> getPlanPage(Integer page, Integer pageSize, String productName, String status);
    
    void updateStatus(Integer planId, String status);
}
