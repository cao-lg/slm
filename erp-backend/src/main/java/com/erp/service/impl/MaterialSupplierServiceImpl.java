package com.erp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.MaterialSupplier;
import com.erp.mapper.MaterialSupplierMapper;
import com.erp.service.MaterialSupplierService;
import org.springframework.stereotype.Service;

@Service
public class MaterialSupplierServiceImpl extends ServiceImpl<MaterialSupplierMapper, MaterialSupplier> implements MaterialSupplierService {
}
