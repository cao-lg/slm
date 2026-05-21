package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.TransferNote;
import com.erp.mapper.TransferNoteMapper;
import com.erp.service.TransferNoteService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class TransferNoteServiceImpl extends ServiceImpl<TransferNoteMapper, TransferNote> implements TransferNoteService {

    @Override
    public Page<TransferNote> getTransferNotePage(Integer page, Integer pageSize, String transferNo, String status) {
        Page<TransferNote> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<TransferNote> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(transferNo)) {
            wrapper.like(TransferNote::getTransferNo, transferNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(TransferNote::getStatus, status);
        }
        
        wrapper.orderByDesc(TransferNote::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
