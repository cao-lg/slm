package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.DeliveryNote;
import com.baomidou.mybatisplus.extension.service.IService;

public interface DeliveryNoteService extends IService<DeliveryNote> {
    Page<DeliveryNote> getDeliveryNotePage(Integer page, Integer pageSize, String deliveryNo, String orderNo, String status);
}
