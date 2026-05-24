<template>
  <div class="production-statistics">
    <div class="page-header">
      <h2>生产统计</h2>
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
      
      <el-select v-model="statusFilter" placeholder="状态" style="width: 150px" clearable>
        <el-option label="全部" value="" />
        <el-option label="待生产" value="pending" />
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
            <div class="stat-value">{{ totalPlans }}</div>
            <div class="stat-label">总生产计划</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ totalProduced }}</div>
            <div class="stat-label">总生产数量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ pendingPlans }}</div>
            <div class="stat-label">待生产</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-value">{{ completedPlans }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <div class="content-area">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="planNo" label="计划编号" width="150" />
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column prop="planQuantity" label="计划数量" width="120" align="right" />
        <el-table-column prop="producedQuantity" label="已生产数量" width="120" align="right" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
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
const totalPlans = ref(0)
const totalProduced = ref(0)
const pendingPlans = ref(0)
const completedPlans = ref(0)

const tableData = ref([
  {
    planNo: 'SC202505200001',
    productName: 'A型配件',
    planQuantity: 100,
    producedQuantity: 50,
    startDate: '2025-05-20',
    endDate: '2025-05-30',
    status: 'producing'
  },
  {
    planNo: 'SC202505180002',
    productName: 'B型组件',
    planQuantity: 50,
    producedQuantity: 0,
    startDate: '2025-05-18',
    endDate: '2025-05-28',
    status: 'pending'
  },
  {
    planNo: 'SC202505150003',
    productName: 'C型零件',
    planQuantity: 200,
    producedQuantity: 200,
    startDate: '2025-05-15',
    endDate: '2025-05-25',
    status: 'completed'
  }
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    pending: 'warning',
    producing: 'primary',
    completed: 'success'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待生产',
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
    `生产计划详情\n\n计划编号：${row.planNo}\n产品名称：${row.productName}\n计划数量：${row.planQuantity}\n已生产数量：${row.producedQuantity}\n开始日期：${row.startDate}\n结束日期：${row.endDate}\n状态：${getStatusText(row.status)}`,
    '生产计划详情',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).catch(() => {})
}

onMounted(() => {
  totalPlans.value = tableData.value.length
  totalProduced.value = tableData.value.reduce((sum, item) => sum + item.producedQuantity, 0)
  pendingPlans.value = tableData.value.filter(item => item.status === 'pending').length
  completedPlans.value = tableData.value.filter(item => item.status === 'completed').length
})
</script>

<style scoped lang="scss">
.production-statistics {
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
        color: #67c23a;
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
