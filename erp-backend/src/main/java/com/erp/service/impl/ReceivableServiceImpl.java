package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Receivable;
import com.erp.entity.SalesOrder;
import com.erp.mapper.ReceivableMapper;
import com.erp.service.ReceivableService;
import com.erp.service.SalesOrderService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ReceivableServiceImpl extends ServiceImpl<ReceivableMapper, Receivable> implements ReceivableService {

    @Autowired
    private SalesOrderService salesOrderService;

    @Override
    public Page<Receivable> getReceivablePage(Integer page, Integer pageSize, String receivableNo, String customerName, String status) {
        Page<Receivable> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(receivableNo)) {
            wrapper.like(Receivable::getReceivableNo, receivableNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(Receivable::getStatus, status);
        }
        
        wrapper.orderByDesc(Receivable::getCreateDate);
        return this.page(pageParam, wrapper);
    }

    @Override
    public boolean verifyReceivable(Integer receivableID, BigDecimal amount, String remark) {
        Receivable receivable = this.getById(receivableID);
        if (receivable == null) {
            return false;
        }
        
        BigDecimal newReceivedAmount = receivable.getReceivedAmount().add(amount);
        BigDecimal pendingAmount = receivable.getTotalAmount().subtract(newReceivedAmount);
        
        receivable.setReceivedAmount(newReceivedAmount);
        receivable.setPendingAmount(pendingAmount.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : pendingAmount);
        receivable.setUpdateDate(LocalDateTime.now());
        
        if (pendingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            receivable.setStatus("completed");
        } else if ("pending".equals(receivable.getStatus())) {
            receivable.setStatus("partial");
        }
        
        this.updateById(receivable);
        
        SalesOrder salesOrder = salesOrderService.getById(receivable.getSalesOrderID());
        if (salesOrder != null && "approved".equals(salesOrder.getStatus())) {
            if (pendingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                salesOrder.setStatus("completed");
                salesOrder.setUpdateDate(LocalDateTime.now());
                salesOrderService.updateById(salesOrder);
            }
        }
        
        return true;
    }
}
