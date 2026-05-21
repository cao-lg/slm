package com.erp.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.erp.entity.PickNote;
import com.baomidou.mybatisplus.extension.service.IService;

public interface PickNoteService extends IService<PickNote> {
    Page<PickNote> getPickNotePage(Integer page, Integer pageSize, String pickNo, String planNo, String status);
}
