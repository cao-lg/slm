<template>
  <div class="data-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据管理</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="数据统计" name="stats">
          <div class="stats-section">
            <el-row :gutter="20">
              <el-col :span="6" v-for="(count, label) in dataStats" :key="label">
                <el-card shadow="hover" class="stat-card">
                  <div class="stat-content">
                    <div class="stat-number">{{ count }}</div>
                    <div class="stat-label">{{ getLabelName(label) }}</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据导出" name="export">
          <div class="export-section">
            <el-card>
              <template #header>
                <span>导出当前数据</span>
              </template>
              <p style="margin-bottom: 15px; color: #666;">将当前所有业务数据导出为 JSON 文件保存到本地</p>
              <el-button type="primary" @click="handleDownloadData">
                <el-icon><Download /></el-icon>
                导出当前数据
              </el-button>
              <el-button type="success" @click="handleDownloadDemo">
                <el-icon><Document /></el-icon>
                下载示例数据
              </el-button>
            </el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据导入" name="import">
          <div class="import-section">
            <el-card>
              <template #header>
                <span>导入数据</span>
              </template>
              <div class="upload-area" @click="triggerFileUpload">
                <el-icon class="upload-icon"><Upload /></el-icon>
                <p>点击或拖拽文件到此处上传</p>
                <p style="color: #999; font-size: 12px;">支持 JSON 格式文件</p>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept=".json"
                style="display: none"
                @change="handleFileChange"
              />
              <el-alert
                v-if="importResult"
                :type="importResult.success ? 'success' : 'error'"
                :title="importResult.message"
                style="margin-top: 15px"
                :closable="false"
              />
            </el-card>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据重置" name="reset">
          <div class="reset-section">
            <el-card>
              <template #header>
                <span>数据操作</span>
              </template>
              <el-alert
                title="警告"
                type="warning"
                :closable="false"
                style="margin-bottom: 15px"
              >
                <template #default>
                  以下操作会影响当前数据，请谨慎操作！
                </template>
              </el-alert>
              
              <div class="button-group">
                <el-button type="warning" @click="handleLoadDemo">
                  <el-icon><RefreshLeft /></el-icon>
                  加载示例数据
                </el-button>
                <el-button type="danger" @click="handleReset">
                  <el-icon><Delete /></el-icon>
                  重置所有数据
                </el-button>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Download, 
  Upload, 
  Document, 
  RefreshLeft, 
  Delete 
} from '@element-plus/icons-vue'
import { dataStore } from '@/utils/dataStore'

const activeTab = ref('stats')
const fileInputRef = ref<HTMLInputElement>()
const importResult = ref<{ success: boolean; message: string } | null>(null)
const dataStats = ref<Record<string, number>>({})

onMounted(() => {
  loadStats()
})

function loadStats() {
  dataStats.value = dataStore.getStats()
}

function getLabelName(key: string) {
  const labels: Record<string, string> = {
    customers: '客户',
    products: '产品',
    suppliers: '供应商',
    materials: '物料',
    quotations: '报价单',
    salesOrders: '销售订单',
    purchaseOrders: '采购订单',
    productionPlans: '生产计划',
    receivables: '应收款',
    payables: '应付款'
  }
  return labels[key] || key
}

function handleDownloadData() {
  try {
    dataStore.downloadData()
    ElMessage.success('数据导出成功！')
  } catch (error) {
    ElMessage.error('导出失败：' + (error as Error).message)
  }
}

function handleDownloadDemo() {
  try {
    dataStore.downloadDemoData()
    ElMessage.success('示例数据下载成功！')
  } catch (error) {
    ElMessage.error('下载失败：' + (error as Error).message)
  }
}

function triggerFileUpload() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const success = dataStore.importData(content)
      
      if (success) {
        importResult.value = {
          success: true,
          message: '数据导入成功！页面将刷新以加载新数据'
        }
        loadStats()
        ElMessage.success('导入成功')
        
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        importResult.value = {
          success: false,
          message: '数据格式无效，请检查文件内容'
        }
      }
    } catch (error) {
      importResult.value = {
        success: false,
        message: '文件解析失败：' + (error as Error).message
      }
    }
  }
  reader.readAsText(file)
  target.value = ''
}

async function handleLoadDemo() {
  try {
    await ElMessageBox.confirm(
      '确定要加载示例数据吗？当前数据将被覆盖！',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    dataStore.loadDemoData()
    ElMessage.success('示例数据加载成功！')
    loadStats()
    
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch {
    // 用户取消
  }
}

async function handleReset() {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有数据吗？此操作无法恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    dataStore.reset()
    ElMessage.success('数据已重置！')
    loadStats()
    
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch {
    // 用户取消
  }
}
</script>

<style scoped lang="scss">
.data-management {
  .card-header {
    font-size: 18px;
    font-weight: bold;
  }

  .stats-section {
    .stat-card {
      margin-bottom: 20px;
      
      .stat-content {
        text-align: center;
        padding: 10px;
        
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #409eff;
        }
        
        .stat-label {
          font-size: 14px;
          color: #666;
          margin-top: 8px;
        }
      }
    }
  }

  .export-section,
  .import-section,
  .reset-section {
    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  .upload-area {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: #409eff;
    }

    .upload-icon {
      font-size: 48px;
      color: #409eff;
      margin-bottom: 15px;
    }

    p {
      margin: 5px 0;
    }
  }
}
</style>
