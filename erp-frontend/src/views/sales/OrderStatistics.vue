<template>
  <div class="order-statistics">
    <div class="page-header">
      <h2>订单统计</h2>
    </div>
    
    <div class="search-bar">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 350px"
        @change="handleSearch"
      />
      
      <el-select v-model="statusFilter" placeholder="订单状态" style="width: 150px" clearable>
        <el-option label="全部" value="" />
        <el-option label="待审核" value="pending" />
        <el-option label="已审核" value="approved" />
        <el-option label="生产中" value="producing" />
        <el-option label="已完成" value="completed" />
      </el-select>
      
      <el-button type="primary" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>
    
    <div class="statistics-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ totalOrders }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">¥{{ totalAmount.toFixed(2) }}</div>
            <div class="stat-label">总销售金额</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ pendingOrders }}</div>
            <div class="stat-label">待审核订单</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ completedOrders }}</div>
            <div class="stat-label">已完成订单</div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <div class="content-area">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" width="150" />
        <el-table-column prop="customerName" label="客户名称" width="150" />
        <el-table-column prop="orderDate" label="订单日期" width="120" />
        <el-table-column prop="deliveryDate" label="交货日期" width="120" />
        <el-table-column prop="totalAmount" label="订单金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleView(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dateRange = ref([])
const statusFilter = ref('')
const totalOrders = ref(0)
const totalAmount = ref(0)
const pendingOrders = ref(0)
const completedOrders = ref(0)

const tableData = ref([
  {
    orderNo: 'XS202505200001',
    customerName: '北京科技有限公司',
    orderDate: '2025-05-20',
    deliveryDate: '2025-05-30',
    totalAmount: 5000,
    status: 'approved'
  },
  {
    orderNo: 'XS202505180002',
    customerName: '上海商贸集团',
    orderDate: '2025-05-18',
    deliveryDate: '2025-05-28',
    totalAmount: 8000,
    status: 'pending'
  },
  {
    orderNo: 'XS202505150003',
    customerName: '广州电子科技',
    orderDate: '2025-05-15',
    deliveryDate: '2025-05-25',
    totalAmount: 12000,
    status: 'completed'
  }
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    producing: 'primary',
    completed: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    producing: '生产中',
    completed: '已完成'
  }
  return map[status] || status
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleView = (row: any) => {
  ElMessageBox.confirm(
    `订单详情\n\n订单编号：${row.orderNo}\n客户名称：${row.customerName}\n订单日期：${row.orderDate}\n交货日期：${row.deliveryDate}\n订单金额：¥${row.totalAmount?.toFixed(2) || '0.00'}\n订单状态：${getStatusText(row.status)}`,
    '订单详情',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).catch(() => {})
}

onMounted(() => {
  totalOrders.value = tableData.value.length
  totalAmount.value = tableData.value.reduce((sum, item) => sum + item.totalAmount, 0)
  pendingOrders.value = tableData.value.filter(item => item.status === 'pending').length
  completedOrders.value = tableData.value.filter(item => item.status === 'completed').length
})
</script>

<style scoped lang="scss">
.order-statistics {
  padding: 20px;
  
  .page-header {
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      color: #333;
    }
  }
  
  .search-bar {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    align-items: center;
  }
  
  .statistics-cards {
    margin-bottom: 20px;
    
    .stat-card {
      background: #fff;
      padding: 25px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      text-align: center;
      
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 10px;
      }
      
      .stat-label {
        color: #666;
        font-size: 14px;
      }
    }
  }
  
  .content-area {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
}
</style>
