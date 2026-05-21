package com.erp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.erp.entity.Message;
import com.erp.mapper.MessageMapper;
import com.erp.service.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {
    
    @Override
    public Page<Message> getMessagePage(Integer page, Integer pageSize, String keyword, Integer messageType) {
        Page<Message> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Message> wrapper = new QueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("title", keyword).or().like("content", keyword));
        }
        if (messageType != null) {
            wrapper.eq("messageType", messageType);
        }
        
        wrapper.orderByDesc("createDate");
        return this.page(pageParam, wrapper);
    }
    
    @Override
    public List<Message> getUnreadMessages(Integer receiverID) {
        QueryWrapper<Message> wrapper = new QueryWrapper<>();
        wrapper.eq("isRead", 0);
        wrapper.and(w -> w.eq("receiverIDs", receiverID.toString())
                .or().eq("isAll", 1));
        wrapper.orderByDesc("createDate");
        wrapper.last("LIMIT 10");
        return this.list(wrapper);
    }
    
    @Override
    public boolean markAsRead(Integer messageID, Integer receiverID) {
        Message message = this.getById(messageID);
        if (message != null) {
            message.setIsRead(1);
            message.setReadDate(LocalDateTime.now());
            return this.updateById(message);
        }
        return false;
    }
    
    @Override
    public boolean markAllAsRead(Integer receiverID) {
        QueryWrapper<Message> wrapper = new QueryWrapper<>();
        wrapper.eq("isRead", 0);
        wrapper.and(w -> w.eq("receiverIDs", receiverID.toString())
                .or().eq("isAll", 1));
        
        Message update = new Message();
        update.setIsRead(1);
        update.setReadDate(LocalDateTime.now());
        return this.update(update, wrapper);
    }
    
    @Override
    public boolean publishMessage(Message message) {
        message.setPublishDate(LocalDateTime.now());
        message.setStatus(1);
        return this.save(message);
    }
    
    @Override
    public boolean deleteMessage(Integer messageID) {
        return this.removeById(messageID);
    }
}
