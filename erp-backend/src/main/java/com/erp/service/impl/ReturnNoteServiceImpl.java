package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.ReturnNote;
import com.erp.mapper.ReturnNoteMapper;
import com.erp.service.ReturnNoteService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ReturnNoteServiceImpl extends ServiceImpl<ReturnNoteMapper, ReturnNote> implements ReturnNoteService {

    @Override
    public Page<ReturnNote> getReturnNotePage(Integer page, Integer pageSize, String returnNo, String sourceNo, String status) {
        Page<ReturnNote> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<ReturnNote> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(returnNo)) {
            wrapper.like(ReturnNote::getReturnNo, returnNo);
        }
        
        if (StringUtils.isNotBlank(sourceNo)) {
            wrapper.like(ReturnNote::getSourceNo, sourceNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(ReturnNote::getStatus, status);
        }
        
        wrapper.orderByDesc(ReturnNote::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
