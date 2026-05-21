package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Quotation;
import com.erp.mapper.QuotationMapper;
import com.erp.service.QuotationService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class QuotationServiceImpl extends ServiceImpl<QuotationMapper, Quotation> implements QuotationService {

    @Override
    public Page<Quotation> getQuotationPage(Integer page, Integer pageSize, String quotationNo, String customerName, String status) {
        Page<Quotation> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Quotation> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(quotationNo)) {
            wrapper.like(Quotation::getQuotationNo, quotationNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(Quotation::getStatus, status);
        }
        
        wrapper.orderByDesc(Quotation::getCreateDate);
        return this.page(pageParam, wrapper);
    }
}
