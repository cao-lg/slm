package com.erp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.erp.entity.Expense;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ExpenseMapper extends BaseMapper<Expense> {
}
