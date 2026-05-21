package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.DeliveryNote;
import com.erp.mapper.DeliveryNoteMapper;
import com.erp.service.DeliveryNoteService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class DeliveryNoteServiceImpl extends ServiceImpl<DeliveryNoteMapper, DeliveryNote> implements DeliveryNoteService {

    @Override
    public Page<DeliveryNote> getDeliveryNotePage(Integer page, Integer pageSize, String deliveryNo, String orderNo, String status) {
        Page<DeliveryNote> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<DeliveryNote> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(deliveryNo)) {
            wrapper.like(DeliveryNote::getDeliveryNo, deliveryNo);
        }
        
        if (StringUtils.isNotBlank(orderNo)) {
            wrapper.like(DeliveryNote::getOrderNo, orderNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(DeliveryNote::getStatus, status);
        }
        
        wrapper.orderByDesc(DeliveryNote::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
