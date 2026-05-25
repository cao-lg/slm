package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Payable;
import com.baomidou.mybatisplus.extension.service.IService;
import java.math.BigDecimal;

public interface PayableService extends IService<Payable> {
    Page<Payable> getPayablePage(Integer page, Integer pageSize, String payableNo, String supplierName, String status);
    
    boolean verifyPayable(Integer payableID, BigDecimal amount, String paymentDate, String paymentMethod, String remark);
}
