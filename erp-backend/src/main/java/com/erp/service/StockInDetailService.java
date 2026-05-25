package com.erp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.erp.entity.StockInDetail;

import java.util.List;

public interface StockInDetailService extends IService<StockInDetail> {
    List<StockInDetail> getByStockInId(Integer stockInID);
}
