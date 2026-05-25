package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.PurchaseOrderDetail;
import com.erp.mapper.PurchaseOrderDetailMapper;
import com.erp.service.PurchaseOrderDetailService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseOrderDetailServiceImpl extends ServiceImpl<PurchaseOrderDetailMapper, PurchaseOrderDetail> implements PurchaseOrderDetailService {
    
    @Override
    public List<PurchaseOrderDetail> getByPurchaseOrderId(Integer poID) {
        return list(new LambdaQueryWrapper<PurchaseOrderDetail>()
            .eq(PurchaseOrderDetail::getPoID, poID));
    }
}
