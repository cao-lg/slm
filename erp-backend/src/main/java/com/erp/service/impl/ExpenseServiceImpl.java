package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Expense;
import com.erp.mapper.ExpenseMapper;
import com.erp.service.ExpenseService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ExpenseServiceImpl extends ServiceImpl<ExpenseMapper, Expense> implements ExpenseService {

    @Override
    public Page<Expense> getExpensePage(Integer page, Integer pageSize, String expenseNo, String applicantName, String status, Integer applicantID) {
        Page<Expense> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Expense> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.isNotBlank(expenseNo)) {
            wrapper.like(Expense::getExpenseNo, expenseNo);
        }
        
        if (StringUtils.isNotBlank(applicantName)) {
            wrapper.like(Expense::getApplicantName, applicantName);
        }
        
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(Expense::getStatus, status);
        }
        
        if (applicantID != null) {
            wrapper.eq(Expense::getApplicantID, applicantID);
        }
        
        wrapper.orderByDesc(Expense::getCreateDate);
        return this.page(pageParam, wrapper);
    }

    @Override
    public boolean approveExpense(Integer expenseID, Integer approverID, String approverName, String remark) {
        Expense expense = this.getById(expenseID);
        if (expense == null || !"pending".equals(expense.getStatus())) {
            return false;
        }
        
        expense.setStatus("approved");
        expense.setApproverID(approverID);
        expense.setApproverName(approverName);
        expense.setApproveDate(LocalDateTime.now());
        expense.setApproveRemark(remark);
        expense.setUpdateDate(LocalDateTime.now());
        
        return this.updateById(expense);
    }

    @Override
    public boolean rejectExpense(Integer expenseID, Integer approverID, String approverName, String remark) {
        Expense expense = this.getById(expenseID);
        if (expense == null || !"pending".equals(expense.getStatus())) {
            return false;
        }
        
        expense.setStatus("rejected");
        expense.setApproverID(approverID);
        expense.setApproverName(approverName);
        expense.setApproveDate(LocalDateTime.now());
        expense.setApproveRemark(remark);
        expense.setUpdateDate(LocalDateTime.now());
        
        return this.updateById(expense);
    }
}
