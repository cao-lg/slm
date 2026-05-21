package com.erp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.SalesOrderDetail;
import com.erp.mapper.SalesOrderDetailMapper;
import com.erp.service.SalesOrderDetailService;
import org.springframework.stereotype.Service;

@Service
public class SalesOrderDetailServiceImpl extends ServiceImpl<SalesOrderDetailMapper, SalesOrderDetail> implements SalesOrderDetailService {
}
