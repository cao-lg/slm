package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.StockInDetail;
import com.erp.mapper.StockInDetailMapper;
import com.erp.service.StockInDetailService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockInDetailServiceImpl extends ServiceImpl<StockInDetailMapper, StockInDetail> implements StockInDetailService {
    
    @Override
    public List<StockInDetail> getByStockInId(Integer stockInID) {
        return list(new LambdaQueryWrapper<StockInDetail>()
            .eq(StockInDetail::getStockInID, stockInID));
    }
}
