package com.erp.service;

import com.erp.entity.Message;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface MessageService extends IService<Message> {
    
    Page<Message> getMessagePage(Integer page, Integer pageSize, String keyword, Integer messageType);
    
    List<Message> getUnreadMessages(Integer receiverID);
    
    boolean markAsRead(Integer messageID, Integer receiverID);
    
    boolean markAllAsRead(Integer receiverID);
    
    boolean publishMessage(Message message);
    
    boolean deleteMessage(Integer messageID);
}
