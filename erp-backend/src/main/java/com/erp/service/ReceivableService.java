package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Receivable;
import com.baomidou.mybatisplus.extension.service.IService;
import java.math.BigDecimal;

public interface ReceivableService extends IService<Receivable> {
    Page<Receivable> getReceivablePage(Integer page, Integer pageSize, String receivableNo, String customerName, String status);
    
    boolean verifyReceivable(Integer receivableID, BigDecimal amount, String paymentDate, String paymentMethod, String remark);
}
