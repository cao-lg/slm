package com.erp.common;

public class Constants {
    
    public static final String JWT_SECRET = "erp-jwt-secret-key-2024-very-long-secret-key-for-security";
    
    public static final Long JWT_EXPIRATION = 86400000L;
    
    public static final String JWT_HEADER = "Authorization";
    
    public static final String JWT_PREFIX = "Bearer ";
    
    public static final String ROLE_ADMIN = "admin";
    
    public static final String ROLE_USER = "user";
    
    public static final Integer STATUS_ENABLED = 1;
    
    public static final Integer STATUS_DISABLED = 0;
    
    public static final String ORDER_STATUS_PENDING = "pending";
    
    public static final String ORDER_STATUS_PRODUCING = "producing";
    
    public static final String ORDER_STATUS_SHIPPED = "shipped";
    
    public static final String ORDER_STATUS_COMPLETED = "completed";
    
    public static final String ORDER_STATUS_RECEIVED = "received";
    
    public static final String RECEIVABLE_STATUS_UNPAID = "unpaid";
    
    public static final String RECEIVABLE_STATUS_PARTIAL = "partial";
    
    public static final String RECEIVABLE_STATUS_PAID = "paid";
    
    public static final String EXPENSE_STATUS_PENDING = "pending";
    
    public static final String EXPENSE_STATUS_APPROVED = "approved";
    
    public static final String EXPENSE_STATUS_REJECTED = "rejected";
    
    public static final String EXPENSE_STATUS_PAID = "paid";
    
    public static final String WAREHOUSE_TYPE_WORKSHOP = "车间仓";
    
    public static final String WAREHOUSE_TYPE_PRODUCT = "成品仓";
    
    public static final String WAREHOUSE_TYPE_MATERIAL = "材料仓";
    
    public static final String WAREHOUSE_TYPE_EXTERNAL = "外仓";
    
    public static final String WAREHOUSE_TYPE_PENDING = "待处理仓";
}
