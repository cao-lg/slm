package com.erp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Warehouse;
import com.erp.mapper.WarehouseMapper;
import com.erp.service.WarehouseService;
import org.springframework.stereotype.Service;

@Service
public class WarehouseServiceImpl extends ServiceImpl<WarehouseMapper, Warehouse> implements WarehouseService {
}
