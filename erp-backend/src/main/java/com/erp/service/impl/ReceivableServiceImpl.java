package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Receivable;
import com.erp.entity.SalesOrder;
import com.erp.mapper.ReceivableMapper;
import com.erp.service.CustomerService;
import com.erp.service.ReceivableService;
import com.erp.service.SalesOrderService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ReceivableServiceImpl extends ServiceImpl<ReceivableMapper, Receivable> implements ReceivableService {

    @Autowired
    private SalesOrderService salesOrderService;

    @Autowired
    private CustomerService customerService;

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
    @Transactional(rollbackFor = Exception.class)
    public boolean verifyReceivable(Integer receivableID, BigDecimal amount, String paymentDate, String paymentMethod, String remark) {
        Receivable receivable = this.getById(receivableID);
        if (receivable == null) {
            return false;
        }
        
        // 验证核销金额有效性
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        if (amount.compareTo(receivable.getPendingAmount()) > 0) {
            return false;
        }

        BigDecimal oldPending = receivable.getPendingAmount();
        BigDecimal newReceivedAmount = receivable.getReceivedAmount().add(amount);
        BigDecimal pendingAmount = receivable.getTotalAmount().subtract(newReceivedAmount);

        receivable.setReceivedAmount(newReceivedAmount);
        receivable.setPendingAmount(pendingAmount.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : pendingAmount);
        receivable.setUpdateDate(LocalDateTime.now());
        if (StringUtils.isNotBlank(paymentDate)) {
            // 兼容处理只有日期没有时间的情况
            if (paymentDate.length() == 10) {
                receivable.setLastPaymentDate(LocalDateTime.parse(paymentDate + "T00:00:00"));
            } else {
                receivable.setLastPaymentDate(LocalDateTime.parse(paymentDate));
            }
        } else {
            receivable.setLastPaymentDate(LocalDateTime.now());
        }
        if (StringUtils.isNotBlank(paymentMethod)) {
            receivable.setPaymentMethod(paymentMethod);
        }

        if (pendingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            receivable.setStatus("paid");
        } else if ("unpaid".equals(receivable.getStatus()) || "partial".equals(receivable.getStatus())) {
            receivable.setStatus("partial");
        }

        this.updateById(receivable);

        // 释放客户信用额度
        BigDecimal releasedAmount = oldPending.subtract(receivable.getPendingAmount());
        if (releasedAmount.compareTo(BigDecimal.ZERO) > 0 && receivable.getCustomerID() != null) {
            customerService.updateUsedCredit(receivable.getCustomerID(), releasedAmount, false);
        }

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
