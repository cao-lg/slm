package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.PickNote;
import com.erp.mapper.PickNoteMapper;
import com.erp.service.PickNoteService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class PickNoteServiceImpl extends ServiceImpl<PickNoteMapper, PickNote> implements PickNoteService {

    @Override
    public Page<PickNote> getPickNotePage(Integer page, Integer pageSize, String pickNo, String planNo, String status) {
        Page<PickNote> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<PickNote> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(pickNo)) {
            wrapper.like(PickNote::getPickNo, pickNo);
        }
        
        if (StringUtils.isNotBlank(planNo)) {
            wrapper.like(PickNote::getPlanNo, planNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(PickNote::getStatus, status);
        }
        
        wrapper.orderByDesc(PickNote::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
