package com.erp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Inventory;
import com.erp.mapper.InventoryMapper;
import com.erp.service.InventoryService;
import org.springframework.stereotype.Service;

@Service
public class InventoryServiceImpl extends ServiceImpl<InventoryMapper, Inventory> implements InventoryService {
}
