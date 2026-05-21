<template>
  <div class="operation-log">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <div class="header-actions">
            <el-tag type="info">总记录: {{ stats.total }}</el-tag>
            <el-tag type="success">今日: {{ stats.today }}</el-tag>
            <el-button type="danger" size="small" @click="handleClear">清空日志</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入操作描述/操作人" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="模块">
          <el-select v-model="searchForm.module" placeholder="请选择模块" clearable>
            <el-option label="用户管理" value="user" />
            <el-option label="客户管理" value="customer" />
            <el-option label="订单管理" value="order" />
            <el-option label="产品管理" value="product" />
            <el-option label="仓库管理" value="warehouse" />
            <el-option label="财务管理" value="finance" />
            <el-option label="系统配置" value="system" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading" @row-click="handleRowClick">
        <el-table-column prop="operateDate" label="操作时间" width="160">
          <template #default="{ row }">
            {{ row.operateDate ? formatDate(row.operateDate) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ getModuleName(row.module) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationType" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getOperationTypeTag(row.operationType)">{{ row.operationType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operationDesc" label="操作描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="operatorName" label="操作人" width="100" />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="executionTime" label="耗时" width="80">
          <template #default="{ row }">
            {{ row.executionTime ? row.executionTime + 'ms' : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isSuccess === 1 ? 'success' : 'danger'" size="small">
              {{ row.isSuccess === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click.stop="handleView(row)">详情</el-button>
            <el-button link type="danger" size="small" @click.stop="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </el-card>

    <el-dialog v-model="detailDialogVisible" title="日志详情" width="800px">
      <el-descriptions v-if="currentLog" :column="2" border>
        <el-descriptions-item label="操作时间">{{ currentLog.operateDate ? formatDate(currentLog.operateDate) : '-' }}</el-descriptions-item>
        <el-descriptions-item label="模块">{{ getModuleName(currentLog.module) }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getOperationTypeTag(currentLog.operationType)">{{ currentLog.operationType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentLog.isSuccess === 1 ? 'success' : 'danger'">
            {{ currentLog.isSuccess === 1 ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作人" :span="2">{{ currentLog.operatorName }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog.ipAddress }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ currentLog.requestMethod }}</el-descriptions-item>
        <el-descriptions-item label="请求URL" :span="2">{{ currentLog.requestUrl }}</el-descriptions-item>
        <el-descriptions-item label="执行时间">{{ currentLog.executionTime ? currentLog.executionTime + 'ms' : '-' }}</el-descriptions-item>
        <el-descriptions-item label="UserAgent" :span="2">{{ currentLog.userAgent }}</el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <pre class="code-block">{{ formatJson(currentLog.requestParams) }}</pre>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentLog.errorMessage" label="错误信息" :span="2">
          <span style="color: #f56c6c;">{{ currentLog.errorMessage }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="操作描述" :span="2">{{ currentLog.operationDesc }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getLogList,
  getLogStats,
  deleteLog,
  clearLogs,
  type OperationLog,
  type PageParams
} from '@/api/system'

const loading = ref(false)
const tableData = ref<OperationLog[]>([])
const detailDialogVisible = ref(false)
const currentLog = ref<OperationLog | null>(null)
const dateRange = ref<[string, string] | null>(null)

const stats = reactive({
  total: 0,
  today: 0
})

const searchForm = reactive({
  keyword: '',
  module: '',
  startDate: '',
  endDate: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const moduleMap: Record<string, string> = {
  user: '用户管理',
  customer: '客户管理',
  order: '订单管理',
  product: '产品管理',
  warehouse: '仓库管理',
  finance: '财务管理',
  system: '系统配置'
}

const getModuleName = (module: string) => {
  return moduleMap[module] || module
}

const getOperationTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    '新增': 'success',
    '编辑': 'warning',
    '删除': 'danger',
    '查询': 'info',
    '登录': '',
    '登出': ''
  }
  return tagMap[type] || 'info'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const formatJson = (str: string | undefined) => {
  if (!str) return '-'
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    if (dateRange.value) {
      searchForm.startDate = dateRange.value[0]
      searchForm.endDate = dateRange.value[1]
    } else {
      searchForm.startDate = ''
      searchForm.endDate = ''
    }
    
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })
    
    const res = await getLogList(params as any)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const res = await getLogStats()
    stats.total = res.data.total
    stats.today = res.data.today
  } catch (error) {
    console.error('获取统计数据失败', error)
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.module = ''
  dateRange.value = null
  searchForm.startDate = ''
  searchForm.endDate = ''
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}

const handleView = (row: OperationLog) => {
  currentLog.value = row
  detailDialogVisible.value = true
}

const handleRowClick = (row: OperationLog) => {
  currentLog.value = row
  detailDialogVisible.value = true
}

const handleDelete = async (row: OperationLog) => {
  try {
    await ElMessageBox.confirm('确定要删除该日志吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteLog(row.logID!)
    ElMessage.success('删除成功')
    fetchData()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleClear = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有日志吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await clearLogs()
    ElMessage.success('清空成功')
    fetchData()
    fetchStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空失败')
    }
  }
}

onMounted(() => {
  fetchData()
  fetchStats()
})
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .header-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.code-block {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
