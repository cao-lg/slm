<template>
  <div class="home">
    <h1>欢迎使用ERP企业管理系统</h1>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <el-card shadow="hover" class="stat-card-wrapper">
          <div class="stat-card">
            <el-icon :size="40" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
            <div class="stat-info">
              <p class="stat-title">{{ item.title }}</p>
              <p class="stat-value">{{ item.value }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/sales/order')">销售订单</el-button>
            <el-button type="success" @click="$router.push('/purchase/order')">采购订单</el-button>
            <el-button type="warning" @click="$router.push('/production/plan')">生产计划</el-button>
            <el-button type="info" @click="$router.push('/system/data')">数据管理</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>系统信息</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="当前用户">{{ authStore.userInfo?.realName }}</el-descriptions-item>
            <el-descriptions-item label="用户角色">{{ authStore.userInfo?.role === 'admin' ? '管理员' : '普通用户' }}</el-descriptions-item>
          </el-descriptions-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore from '@/stores/auth'
import { ref, onMounted } from 'vue'
import { dataStore } from '@/utils/dataStore'
import { ShoppingCart, Box, Setting, Bell } from '@element-plus/icons-vue'

const authStore = useAuthStore()

const stats = ref([
  { title: '客户', value: '0', icon: ShoppingCart, color: '#409eff' },
  { title: '产品', value: '0', icon: Box, color: '#67c23a' },
  { title: '销售订单', value: '0', icon: Setting, color: '#e6a23c' },
  { title: '生产计划', value: '0', icon: Bell, color: '#f56c6c' }
])

onMounted(() => {
  loadStats()
})

function loadStats() {
  const data = dataStore.getStats()
  stats.value[0].value = String(data.customers)
  stats.value[1].value = String(data.products)
  stats.value[2].value = String(data.salesOrders)
  stats.value[3].value = String(data.productionPlans)
}
</script>

<style scoped lang="scss">
.home {
  h1 {
    margin-bottom: 20px;
    color: #333;
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    gap: 20px;
    
    .stat-info {
      .stat-title {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
      
      .stat-value {
        margin: 5px 0 0;
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
    }
  }
  
  .quick-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}
</style>
