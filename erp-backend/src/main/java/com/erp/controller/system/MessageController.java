package com.erp.controller;

import com.erp.common.Result;
import com.erp.entity.Message;
import com.erp.service.MessageService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system/message")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping("/list")
    public Result<Page<Message>> getMessageList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer messageType) {
        Page<Message> result = messageService.getMessagePage(page, pageSize, keyword, messageType);
        return Result.success(result);
    }
    
    @GetMapping("/unread")
    public Result<List<Message>> getUnreadMessages(@RequestParam Integer receiverID) {
        List<Message> messages = messageService.getUnreadMessages(receiverID);
        return Result.success(messages);
    }
    
    @GetMapping("/detail")
    public Result<Message> getMessageDetail(@RequestParam Integer messageID) {
        Message message = messageService.getById(messageID);
        return Result.success(message);
    }
    
    @PostMapping("/publish")
    public Result<Void> publishMessage(@RequestBody Message message) {
        boolean success = messageService.publishMessage(message);
        return success ? Result.success("发布成功") : Result.error("发布失败");
    }
    
    @PostMapping("/mark-read")
    public Result<Void> markAsRead(@RequestParam Integer messageID, @RequestParam Integer receiverID) {
        boolean success = messageService.markAsRead(messageID, receiverID);
        return success ? Result.success("标记已读成功") : Result.error("标记已读失败");
    }
    
    @PostMapping("/mark-all-read")
    public Result<Void> markAllAsRead(@RequestParam Integer receiverID) {
        boolean success = messageService.markAllAsRead(receiverID);
        return success ? Result.success("全部标记已读成功") : Result.error("标记失败");
    }
    
    @DeleteMapping("/delete")
    public Result<Void> deleteMessage(@RequestParam Integer messageID) {
        boolean success = messageService.deleteMessage(messageID);
        return success ? Result.success("删除成功") : Result.error("删除失败");
    }
}
