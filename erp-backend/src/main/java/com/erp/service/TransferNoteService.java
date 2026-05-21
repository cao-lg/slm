package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.TransferNote;
import com.baomidou.mybatisplus.extension.service.IService;

public interface TransferNoteService extends IService<TransferNote> {
    Page<TransferNote> getTransferNotePage(Integer page, Integer pageSize, String transferNo, String status);
}
