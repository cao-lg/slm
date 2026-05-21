package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.ProductionPlan;
import com.erp.mapper.ProductionPlanMapper;
import com.erp.service.ProductionPlanService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ProductionPlanServiceImpl extends ServiceImpl<ProductionPlanMapper, ProductionPlan> implements ProductionPlanService {

    @Override
    public Page<ProductionPlan> getPlanPage(Integer page, Integer pageSize, String productName, String status) {
        Page<ProductionPlan> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<ProductionPlan> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(productName)) {
            wrapper.like(ProductionPlan::getProductName, productName);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(ProductionPlan::getStatus, status);
        }
        
        wrapper.orderByDesc(ProductionPlan::getCreateDate);
        return this.page(pageParam, wrapper);
    }

    @Override
    public void updateStatus(Integer planId, String status) {
        ProductionPlan plan = this.getById(planId);
        if (plan == null) {
            throw new RuntimeException("生产计划不存在");
        }
        
        String currentStatus = plan.getStatus();
        if ("pending".equals(currentStatus) && "producing".equals(status)) {
            plan.setStatus(status);
        } else if ("producing".equals(currentStatus) && "completed".equals(status)) {
            plan.setStatus(status);
        } else if ("producing".equals(currentStatus) && "cancelled".equals(status)) {
            plan.setStatus(status);
        } else {
            throw new RuntimeException("状态流转不正确");
        }
        
        this.updateById(plan);
    }
}
