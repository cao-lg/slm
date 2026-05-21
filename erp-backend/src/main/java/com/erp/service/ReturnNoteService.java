package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.ReturnNote;
import com.baomidou.mybatisplus.extension.service.IService;

public interface ReturnNoteService extends IService<ReturnNote> {
    Page<ReturnNote> getReturnNotePage(Integer page, Integer pageSize, String returnNo, String sourceNo, String status);
}
