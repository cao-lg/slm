package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Quotation;
import com.baomidou.mybatisplus.extension.service.IService;

public interface QuotationService extends IService<Quotation> {
    Page<Quotation> getQuotationPage(Integer page, Integer pageSize, String quotationNo, String customerName, String status);
}
