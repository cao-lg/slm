package com.erp.controller.finance;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Receivable;
import com.erp.service.ReceivableService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/finance/receivables")
public class ReceivableController {

    @Autowired
    private ReceivableService receivableService;

    @GetMapping
    public Result<PageResult<Receivable>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String receivableNo,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String status) {
        
        Page<Receivable> pageResult = receivableService.getReceivablePage(page, pageSize, receivableNo, customerName, status);
        PageResult<Receivable> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Receivable> getById(@PathVariable Integer id) {
        Receivable receivable = receivableService.getById(id);
        if (receivable == null) {
            return Result.error("应收款记录不存在");
        }
        return Result.success(receivable);
    }

    @PostMapping
    public Result<Void> add(@RequestBody ReceivableRequest request) {
        Receivable receivable = request.getReceivable();
        receivable.setReceivableNo("AR" + System.currentTimeMillis());
        receivable.setReceivedAmount(BigDecimal.ZERO);
        receivable.setPendingAmount(receivable.getTotalAmount());
        receivable.setCreateDate(LocalDateTime.now());
        receivable.setStatus("unpaid");
        
        receivableService.save(receivable);
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody Receivable receivable) {
        receivable.setReceivableID(id);
        receivable.setUpdateDate(LocalDateTime.now());
        
        BigDecimal pendingAmount = receivable.getTotalAmount().subtract(receivable.getReceivedAmount());
        receivable.setPendingAmount(pendingAmount.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : pendingAmount);
        
        receivableService.updateById(receivable);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        receivableService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/verify")
    public Result<Void> verify(@PathVariable Integer id, @RequestParam BigDecimal amount, @RequestParam(required = false) String paymentDate, @RequestParam(required = false) String paymentMethod, @RequestParam(required = false) String remark) {
        boolean success = receivableService.verifyReceivable(id, amount, paymentDate, paymentMethod, remark);
        if (!success) {
            return Result.error("核销失败");
        }
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        Receivable receivable = receivableService.getById(id);
        if (receivable == null) {
            return Result.error("应收款记录不存在");
        }
        
        receivable.setStatus(status);
        receivable.setUpdateDate(LocalDateTime.now());
        receivableService.updateById(receivable);
        return Result.success();
    }

    @Data
    public static class ReceivableRequest {
        private Receivable receivable;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
