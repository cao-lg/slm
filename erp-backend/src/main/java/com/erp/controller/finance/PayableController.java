package com.erp.controller.finance;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Payable;
import com.erp.service.PayableService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/finance/payables")
public class PayableController {

    @Autowired
    private PayableService payableService;

    @GetMapping
    public Result<PageResult<Payable>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String payableNo,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String status) {
        
        Page<Payable> pageResult = payableService.getPayablePage(page, pageSize, payableNo, supplierName, status);
        PageResult<Payable> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Payable> getById(@PathVariable Integer id) {
        Payable payable = payableService.getById(id);
        if (payable == null) {
            return Result.error("应付款记录不存在");
        }
        return Result.success(payable);
    }

    @PostMapping
    public Result<Void> add(@RequestBody PayableRequest request) {
        Payable payable = request.getPayable();
        payable.setPayableNo("AP" + System.currentTimeMillis());
        payable.setPaidAmount(BigDecimal.ZERO);
        payable.setPendingAmount(payable.getTotalAmount());
        payable.setCreateDate(LocalDateTime.now());
        payable.setStatus("pending");
        
        payableService.save(payable);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Payable payable) {
        payable.setPayableID(id);
        payable.setUpdateDate(LocalDateTime.now());
        
        BigDecimal pendingAmount = payable.getTotalAmount().subtract(payable.getPaidAmount());
        payable.setPendingAmount(pendingAmount.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : pendingAmount);
        
        payableService.updateById(payable);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        payableService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/verify")
    public Result<Void> verify(@PathVariable Integer id, @RequestParam BigDecimal amount, @RequestParam(required = false) String remark) {
        boolean success = payableService.verifyPayable(id, amount, remark);
        if (!success) {
            return Result.error("核销失败");
        }
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        Payable payable = payableService.getById(id);
        if (payable == null) {
            return Result.error("应付款记录不存在");
        }
        
        payable.setStatus(status);
        payable.setUpdateDate(LocalDateTime.now());
        payableService.updateById(payable);
        return Result.success();
    }

    @Data
    public static class PayableRequest {
        private Payable payable;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
