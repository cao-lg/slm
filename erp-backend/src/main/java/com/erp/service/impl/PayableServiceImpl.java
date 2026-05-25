package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Payable;
import com.erp.entity.PurchaseOrder;
import com.erp.mapper.PayableMapper;
import com.erp.service.PayableService;
import com.erp.service.PurchaseOrderService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PayableServiceImpl extends ServiceImpl<PayableMapper, Payable> implements PayableService {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Override
    public Page<Payable> getPayablePage(Integer page, Integer pageSize, String payableNo, String supplierName, String status) {
        Page<Payable> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(payableNo)) {
            wrapper.like(Payable::getPayableNo, payableNo);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(Payable::getStatus, status);
        }
        
        wrapper.orderByDesc(Payable::getCreateDate);
        return this.page(pageParam, wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean verifyPayable(Integer payableID, BigDecimal amount, String paymentDate, String paymentMethod, String remark) {
        Payable payable = this.getById(payableID);
        if (payable == null) {
            return false;
        }
        
        // 验证核销金额有效性
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        if (amount.compareTo(payable.getPendingAmount()) > 0) {
            return false;
        }

        BigDecimal newPaidAmount = payable.getPaidAmount().add(amount);
        BigDecimal pendingAmount = payable.getTotalAmount().subtract(newPaidAmount);

        payable.setPaidAmount(newPaidAmount);
        payable.setPendingAmount(pendingAmount.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : pendingAmount);
        payable.setUpdateDate(LocalDateTime.now());
        if (StringUtils.isNotBlank(paymentDate)) {
            // 兼容处理只有日期没有时间的情况
            if (paymentDate.length() == 10) {
                payable.setLastPaymentDate(LocalDateTime.parse(paymentDate + "T00:00:00"));
            } else {
                payable.setLastPaymentDate(LocalDateTime.parse(paymentDate));
            }
        } else {
            payable.setLastPaymentDate(LocalDateTime.now());
        }
        if (StringUtils.isNotBlank(paymentMethod)) {
            payable.setPaymentMethod(paymentMethod);
        }

        if (pendingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            payable.setStatus("paid");
        } else if ("unpaid".equals(payable.getStatus()) || "partial".equals(payable.getStatus())) {
            payable.setStatus("partial");
        }

        this.updateById(payable);

        PurchaseOrder purchaseOrder = purchaseOrderService.getById(payable.getPurchaseOrderID());
        if (purchaseOrder != null && "approved".equals(purchaseOrder.getStatus())) {
            if (pendingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                purchaseOrder.setStatus("completed");
                purchaseOrder.setUpdateDate(LocalDateTime.now());
                purchaseOrderService.updateById(purchaseOrder);
            }
        }

        return true;
    }
}
