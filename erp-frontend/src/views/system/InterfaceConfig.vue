<template>
  <div class="interface-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>界面配置</span>
          <el-button type="primary" @click="handleSave" :loading="loading">保存配置</el-button>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" class="config-form">
        <el-divider content-position="left">主题设置</el-divider>
        
        <el-form-item label="主题颜色">
          <div class="theme-colors">
            <div
              v-for="color in themeColors"
              :key="color.value"
              :class="['color-item', { active: formData.themeColor === color.value }]"
              @click="formData.themeColor = color.value"
            >
              <span :style="{ backgroundColor: color.value }"></span>
              <span>{{ color.label }}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="导航模式">
          <el-radio-group v-model="formData.navMode">
            <el-radio label="vertical">侧边导航</el-radio>
            <el-radio label="horizontal">顶部导航</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="导航折叠">
          <el-switch v-model="formData.navCollapse" />
        </el-form-item>

        <el-divider content-position="left">显示设置</el-divider>

        <el-form-item label="显示Logo">
          <el-switch v-model="formData.showLogo" />
        </el-form-item>

        <el-form-item label="显示标签栏">
          <el-switch v-model="formData.showTagsView" />
        </el-form-item>

        <el-form-item label="显示页脚">
          <el-switch v-model="formData.showFooter" />
        </el-form-item>

        <el-form-item label="固定头部">
          <el-switch v-model="formData.fixedHeader" />
        </el-form-item>

        <el-form-item label="固定侧边栏">
          <el-switch v-model="formData.fixedSidebar" />
        </el-form-item>

        <el-divider content-position="left">其他设置</el-divider>

        <el-form-item label="每页条数">
          <el-input-number
            v-model="formData.pageSize"
            :min="10"
            :max="100"
            :step="10"
          />
        </el-form-item>

        <el-form-item label="表格密度">
          <el-radio-group v-model="formData.tableSize">
            <el-radio label="large">宽松</el-radio>
            <el-radio label="default">默认</el-radio>
            <el-radio label="small">紧凑</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="语言">
          <el-select v-model="formData.language">
            <el-option label="简体中文" value="zh-CN" />
            <el-option label="English" value="en-US" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间格式">
          <el-select v-model="formData.dateFormat">
            <el-option label="2024-01-01 12:00:00" value="YYYY-MM-DD HH:mm:ss" />
            <el-option label="2024/01/01 12:00:00" value="YYYY/MM/DD HH:mm:ss" />
            <el-option label="01-01 12:00" value="MM-DD HH:mm" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getConfigMap, batchUpdateConfigs } from '@/api/system'

const loading = ref(false)

const themeColors = [
  { label: '蓝色', value: '#409eff' },
  { label: '绿色', value: '#67c23a' },
  { label: '橙色', value: '#e6a23c' },
  { label: '红色', value: '#f56c6c' },
  { label: '紫色', value: '#909399' },
  { label: '黑色', value: '#303133' }
]

const formData = reactive({
  themeColor: '#409eff',
  navMode: 'vertical',
  navCollapse: true,
  showLogo: true,
  showTagsView: true,
  showFooter: false,
  fixedHeader: true,
  fixedSidebar: true,
  pageSize: 20,
  tableSize: 'default',
  language: 'zh-CN',
  dateFormat: 'YYYY-MM-DD HH:mm:ss'
})

const loadConfig = async () => {
  try {
    const res = await getConfigMap()
    const config = res.data
    if (config.themeColor) formData.themeColor = config.themeColor
    if (config.navMode) formData.navMode = config.navMode
    if (config.navCollapse !== undefined) formData.navCollapse = config.navCollapse === 'true'
    if (config.showLogo !== undefined) formData.showLogo = config.showLogo === 'true'
    if (config.showTagsView !== undefined) formData.showTagsView = config.showTagsView === 'true'
    if (config.showFooter !== undefined) formData.showFooter = config.showFooter === 'true'
    if (config.fixedHeader !== undefined) formData.fixedHeader = config.fixedHeader === 'true'
    if (config.fixedSidebar !== undefined) formData.fixedSidebar = config.fixedSidebar === 'true'
    if (config.pageSize) formData.pageSize = parseInt(config.pageSize)
    if (config.tableSize) formData.tableSize = config.tableSize
    if (config.language) formData.language = config.language
    if (config.dateFormat) formData.dateFormat = config.dateFormat
  } catch (error) {
    console.error('加载配置失败', error)
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    const configs: Record<string, string> = {}
    configs.themeColor = formData.themeColor
    configs.navMode = formData.navMode
    configs.navCollapse = String(formData.navCollapse)
    configs.showLogo = String(formData.showLogo)
    configs.showTagsView = String(formData.showTagsView)
    configs.showFooter = String(formData.showFooter)
    configs.fixedHeader = String(formData.fixedHeader)
    configs.fixedSidebar = String(formData.fixedSidebar)
    configs.pageSize = String(formData.pageSize)
    configs.tableSize = formData.tableSize
    configs.language = formData.language
    configs.dateFormat = formData.dateFormat
    
    await batchUpdateConfigs(configs)
    ElMessage.success('配置保存成功')
    
    localStorage.setItem('interfaceConfig', JSON.stringify(formData))
  } catch (error) {
    ElMessage.error('配置保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const savedConfig = localStorage.getItem('interfaceConfig')
  if (savedConfig) {
    try {
      const saved = JSON.parse(savedConfig)
      Object.assign(formData, saved)
    } catch (e) {
      console.error('加载本地配置失败', e)
    }
  }
  loadConfig()
})
</script>

<style scoped lang="scss">
.interface-config {
  max-width: 800px;
  margin: 20px auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-form {
  padding: 20px;
  max-width: 600px;
}

.theme-colors {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  
  .color-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    border: 2px solid transparent;
    transition: all 0.3s;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    &.active {
      border-color: #409eff;
      background-color: #ecf5ff;
    }
    
    span:first-child {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    span:last-child {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
