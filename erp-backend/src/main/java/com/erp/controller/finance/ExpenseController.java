package com.erp.controller.finance;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Expense;
import com.erp.service.ExpenseService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/finance/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public Result<PageResult<Expense>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String expenseNo,
            @RequestParam(required = false) String applicantName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer applicantID) {
        
        Page<Expense> pageResult = expenseService.getExpensePage(page, pageSize, expenseNo, applicantName, status, applicantID);
        PageResult<Expense> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Expense> getById(@PathVariable Integer id) {
        Expense expense = expenseService.getById(id);
        if (expense == null) {
            return Result.error("报销记录不存在");
        }
        return Result.success(expense);
    }

    @PostMapping
    public Result<Void> add(@RequestBody ExpenseRequest request) {
        Expense expense = request.getExpense();
        expense.setExpenseNo("EX" + System.currentTimeMillis());
        expense.setCreateDate(LocalDateTime.now());
        expense.setStatus("pending");
        
        expenseService.save(expense);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Expense expense) {
        Expense existingExpense = expenseService.getById(id);
        if (existingExpense == null) {
            return Result.error("报销记录不存在");
        }
        
        if (!"pending".equals(existingExpense.getStatus())) {
            return Result.error("只能修改待审批的报销记录");
        }
        
        expense.setExpenseID(id);
        expense.setUpdateDate(LocalDateTime.now());
        expenseService.updateById(expense);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        Expense expense = expenseService.getById(id);
        if (expense == null) {
            return Result.error("报销记录不存在");
        }
        
        if (!"pending".equals(expense.getStatus())) {
            return Result.error("只能删除待审批的报销记录");
        }
        
        expenseService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Integer id, @RequestBody ApproveRequest request) {
        boolean success = expenseService.approveExpense(id, request.getApproverID(), request.getApproverName(), request.getRemark());
        if (!success) {
            return Result.error("审批失败");
        }
        return Result.success();
    }

    @PutMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Integer id, @RequestBody ApproveRequest request) {
        boolean success = expenseService.rejectExpense(id, request.getApproverID(), request.getApproverName(), request.getRemark());
        if (!success) {
            return Result.error("驳回失败");
        }
        return Result.success();
    }

    @Data
    public static class ExpenseRequest {
        private Expense expense;
    }

    @Data
    public static class ApproveRequest {
        private Integer approverID;
        private String approverName;
        private String remark;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
