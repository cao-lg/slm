package com.erp.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class IdGenerator {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMdd");

    public static String generateCustomerCode() {
        return "KH" + DATE_FORMAT.format(new Date()) + System.currentTimeMillis() % 10000;
    }

    public static String generateSupplierCode() {
        return "GYS" + DATE_FORMAT.format(new Date()) + System.currentTimeMillis() % 10000;
    }

    public static String generateProductCode() {
        return "CP" + DATE_FORMAT.format(new Date()) + System.currentTimeMillis() % 10000;
    }

    public static String generateProductionPlanNo() {
        return "SC" + DATE_FORMAT.format(new Date()) + System.currentTimeMillis() % 10000;
    }

    public static String generateRecipeCode() {
        return "PF" + DATE_FORMAT.format(new Date()) + System.currentTimeMillis() % 10000;
    }

    public static String generateProductionRecordNo() {
        return "SCJL" + DATE_FORMAT.format(new Date()) + System.currentTimeMillis() % 10000;
    }
}
