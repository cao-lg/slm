package com.erp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.erp.entity.PurchaseOrderDetail;

import java.util.List;

public interface PurchaseOrderDetailService extends IService<PurchaseOrderDetail> {
    List<PurchaseOrderDetail> getByPurchaseOrderId(Integer poID);
}
