package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.Expense;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ExpenseService extends IService<Expense> {
    Page<Expense> getExpensePage(Integer page, Integer pageSize, String expenseNo, String applicantName, String status, Integer applicantID);
    
    boolean approveExpense(Integer expenseID, Integer approverID, String approverName, String remark);
    
    boolean rejectExpense(Integer expenseID, Integer approverID, String approverName, String remark);
}
