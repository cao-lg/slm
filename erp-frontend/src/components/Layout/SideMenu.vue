<template>
  <div class="side-menu">
    <div class="logo">
      <h2>ERP系统</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="menu"
      background-color="#2C2D47"
      text-color="#fff"
      active-text-color="#fff"
      :router="true"
    >
      <!-- 销售 -->
      <el-sub-menu index="sales">
        <template #title>
          <span>销售</span>
        </template>
        <el-menu-item index="/sales/quotation">报价单</el-menu-item>
        <el-menu-item index="/sales/order">销售订单</el-menu-item>
        <el-menu-item index="/sales/summary">产品汇总</el-menu-item>
        <el-menu-item index="/sales/statistics">订单统计</el-menu-item>
        <el-menu-item index="/sales/customer">客户管理</el-menu-item>
      </el-sub-menu>
      
      <!-- 采购 -->
      <el-sub-menu index="purchase">
        <template #title>
          <span>采购</span>
        </template>
        <el-menu-item index="/purchase/order">采购订单</el-menu-item>
        <el-menu-item index="/purchase/material">原材料</el-menu-item>
        <el-menu-item index="/purchase/supplier">供应商管理</el-menu-item>
      </el-sub-menu>
      
      <!-- 生产 -->
      <el-sub-menu index="production">
        <template #title>
          <span>生产</span>
        </template>
        <el-menu-item index="/production/plan">生产计划</el-menu-item>
        <el-menu-item index="/production/recipe">配方单</el-menu-item>
        <el-menu-item index="/production/statistics">生产统计</el-menu-item>
      </el-sub-menu>
      
      <!-- 仓库 -->
      <el-sub-menu index="warehouse">
        <template #title>
          <span>仓库</span>
        </template>
        <div class="warehouse-grid-menu">
          <div class="warehouse-row">
            <router-link to="/warehouse/workshop" class="warehouse-item">车间仓</router-link>
            <router-link to="/warehouse/delivery" class="warehouse-item">发货单</router-link>
          </div>
          <div class="warehouse-row">
            <router-link to="/warehouse/product" class="warehouse-item">成品仓</router-link>
            <router-link to="/warehouse/transfer" class="warehouse-item">调拨单</router-link>
          </div>
          <div class="warehouse-row">
            <router-link to="/warehouse/material" class="warehouse-item">材料仓</router-link>
            <router-link to="/warehouse/pick" class="warehouse-item">领料单</router-link>
          </div>
          <div class="warehouse-row">
            <router-link to="/warehouse/external" class="warehouse-item">外仓</router-link>
            <router-link to="/warehouse/return" class="warehouse-item">退货单</router-link>
          </div>
          <div class="warehouse-row">
            <router-link to="/warehouse/pending" class="warehouse-item">待处理仓</router-link>
            <span class="warehouse-item"></span>
          </div>
        </div>
      </el-sub-menu>
      
      <!-- 产品 -->
      <el-sub-menu index="product">
        <template #title>
          <span>产品</span>
        </template>
        <el-menu-item index="/product">产品列表</el-menu-item>
      </el-sub-menu>
      
      <!-- 财务 -->
      <el-sub-menu index="finance">
        <template #title>
          <span>财务</span>
        </template>
        <el-menu-item index="/finance/receivable">应收管理</el-menu-item>
        <el-menu-item index="/finance/payable">应付管理</el-menu-item>
        <el-menu-item index="/finance/expense">报销管理</el-menu-item>
      </el-sub-menu>
      
      <!-- 设置 -->
      <el-sub-menu index="system">
        <template #title>
          <span>设置 <sup v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</sup></span>
        </template>
        <el-menu-item index="/system/message">站内通知<sup v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</sup></el-menu-item>
        <el-menu-item index="/system/interface">界面管理</el-menu-item>
        <el-menu-item index="/system/password">修改密码</el-menu-item>
        <el-menu-item index="/system/user">用户列表</el-menu-item>
        <el-menu-item index="/system/log">操作日志</el-menu-item>
      </el-sub-menu>
      
      <!-- 退出 -->
      <div class="menu-footer">
        <el-menu-item index="/logout" @click="handleLogout">
          <span>退出系统</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)
const unreadCount = ref(0)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.side-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .logo {
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #036;
    
    h2 {
      color: #fff;
      margin: 0;
      font-size: 18px;
    }
  }
  
  .menu {
    border-right: none;
    flex: 1;
    
    :deep(.el-menu-item), :deep(.el-sub-menu__title) {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      min-width: 55px;
    }
    
    :deep(.el-menu--inline) {
      .el-menu-item {
        background-color: rgba(200,200,216,1);
        color: #000;
        border-bottom: 1px #fff solid;
        
        &:hover {
          background-color: #815B99;
          color: #fff;
        }
        
        &.is-active {
          background-color: #B60BAA;
          color: #fff;
        }
      }
    }
    
    :deep(.el-sub-menu__title) {
      &:hover {
        background-color: #B60BAA;
      }
    }
  }
  
  .warehouse-grid-menu {
    background-color: rgba(200,200,216,1);
    padding: 0;
    width: 160px;
    
    .warehouse-row {
      display: flex;
      border-bottom: 1px #fff solid;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .warehouse-item {
      flex: 1;
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #000;
      text-decoration: none;
      cursor: pointer;
      font-size: 14px;
      
      &:first-child {
        border-right: 1px #fff solid;
      }
      
      &:hover {
        background-color: #815B99;
        color: #fff;
      }
    }
  }
  
  .unread-badge {
    color: #FFFF00;
    font-weight: bold;
    margin-left: 2px;
    font-size: 12px;
  }
  
  .menu-footer {
    margin-top: auto;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
}
</style>
