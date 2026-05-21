package com.erp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.QuotationDetail;
import com.erp.mapper.QuotationDetailMapper;
import com.erp.service.QuotationDetailService;
import org.springframework.stereotype.Service;

@Service
public class QuotationDetailServiceImpl extends ServiceImpl<QuotationDetailMapper, QuotationDetail> implements QuotationDetailService {
}
