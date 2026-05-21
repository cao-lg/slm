package com.erp.controller.sales;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.common.Result;
import com.erp.entity.Quotation;
import com.erp.entity.QuotationDetail;
import com.erp.service.QuotationService;
import com.erp.service.QuotationDetailService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/sales/quotations")
public class QuotationController {

    @Autowired
    private QuotationService quotationService;

    @Autowired
    private QuotationDetailService quotationDetailService;

    @GetMapping
    public Result<PageResult<Quotation>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String quotationNo,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String status) {
        
        Page<Quotation> pageResult = quotationService.getQuotationPage(page, pageSize, quotationNo, customerName, status);
        PageResult<Quotation> result = new PageResult<>();
        result.setList(pageResult.getRecords());
        result.setTotal(pageResult.getTotal());
        
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Quotation> getById(@PathVariable Integer id) {
        Quotation quotation = quotationService.getById(id);
        if (quotation == null) {
            return Result.error("报价单不存在");
        }
        return Result.success(quotation);
    }

    @GetMapping("/{id}/details")
    public Result<List<QuotationDetail>> getDetails(@PathVariable Integer id) {
        List<QuotationDetail> details = quotationDetailService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<QuotationDetail>()
                .eq(QuotationDetail::getQuotationID, id)
        );
        return Result.success(details);
    }

    @PostMapping
    public Result<Void> add(@RequestBody QuotationRequest request) {
        Quotation quotation = request.getQuotation();
        quotation.setQuotationNo("BJ" + System.currentTimeMillis());
        quotation.setCreateDate(LocalDateTime.now());
        quotation.setStatus("pending");
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (QuotationDetail detail : request.getDetails()) {
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
            totalAmount = totalAmount.add(amount);
        }
        quotation.setTotalAmount(totalAmount);
        
        quotationService.save(quotation);
        
        for (QuotationDetail detail : request.getDetails()) {
            detail.setQuotationID(quotation.getQuotationID());
        }
        quotationDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Integer id, @RequestBody QuotationRequest request) {
        Quotation quotation = request.getQuotation();
        quotation.setQuotationID(id);
        quotation.setUpdateDate(LocalDateTime.now());
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (QuotationDetail detail : request.getDetails()) {
            BigDecimal amount = detail.getQuantity().multiply(detail.getPrice());
            detail.setAmount(amount);
            totalAmount = totalAmount.add(amount);
        }
        quotation.setTotalAmount(totalAmount);
        
        quotationService.updateById(quotation);
        
        quotationDetailService.remove(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<QuotationDetail>()
            .eq(QuotationDetail::getQuotationID, id));
        
        for (QuotationDetail detail : request.getDetails()) {
            detail.setQuotationID(id);
        }
        quotationDetailService.saveBatch(request.getDetails());
        
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        quotationDetailService.remove(new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<QuotationDetail>()
            .eq(QuotationDetail::getQuotationID, id));
        quotationService.removeById(id);
        return Result.success();
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        Quotation quotation = quotationService.getById(id);
        if (quotation == null) {
            return Result.error("报价单不存在");
        }
        quotation.setStatus(status);
        quotation.setUpdateDate(LocalDateTime.now());
        quotationService.updateById(quotation);
        return Result.success();
    }

    @Data
    public static class QuotationRequest {
        private Quotation quotation;
        private List<QuotationDetail> details;
    }

    @Data
    public static class PageResult<T> {
        private java.util.List<T> list;
        private long total;
    }
}
