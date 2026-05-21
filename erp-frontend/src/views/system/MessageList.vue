<template>
  <div class="message-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>站内通知</span>
          <el-button type="primary" @click="handlePublish">发布通知</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入标题/内容" clearable @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.messageType" placeholder="请选择类型" clearable>
            <el-option label="系统通知" :value="1" />
            <el-option label="业务通知" :value="2" />
            <el-option label="公告" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading" @row-click="handleRowClick">
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="messageType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.messageType === 1" type="success">系统通知</el-tag>
            <el-tag v-else-if="row.messageType === 2" type="warning">业务通知</el-tag>
            <el-tag v-else type="info">公告</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="senderName" label="发布人" width="100" />
        <el-table-column prop="publishDate" label="发布时间" width="160">
          <template #default="{ row }">
            {{ row.publishDate ? formatDate(row.publishDate) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.priority === 1" type="danger">紧急</el-tag>
            <el-tag v-else-if="row.priority === 2" type="warning">重要</el-tag>
            <el-tag v-else type="info">普通</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isRead === 1 ? 'success' : 'danger'">
              {{ row.isRead === 1 ? '已读' : '未读' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click.stop="handleView(row)">查看</el-button>
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

    <el-dialog v-model="publishDialogVisible" title="发布通知" width="600px" @close="resetPublishForm">
      <el-form ref="publishFormRef" :model="publishForm" :rules="publishRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="publishForm.title" placeholder="请输入通知标题" />
        </el-form-item>
        <el-form-item label="类型" prop="messageType">
          <el-select v-model="publishForm.messageType" placeholder="请选择类型">
            <el-option label="系统通知" :value="1" />
            <el-option label="业务通知" :value="2" />
            <el-option label="公告" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="publishForm.priority">
            <el-radio :label="0">普通</el-radio>
            <el-radio :label="1">重要</el-radio>
            <el-radio :label="2">紧急</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送范围" prop="isAll">
          <el-radio-group v-model="publishForm.isAll" @change="handleIsAllChange">
            <el-radio :label="1">全体成员</el-radio>
            <el-radio :label="0">指定人员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接收人" prop="receiverNames" v-if="publishForm.isAll === 0">
          <el-input v-model="publishForm.receiverNames" type="textarea" :rows="2" placeholder="请输入接收人，多个用逗号分隔" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="publishForm.content" type="textarea" :rows="6" placeholder="请输入通知内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePublishSubmit">发布</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="通知详情" width="600px">
      <div class="message-detail" v-if="currentMessage">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="标题">{{ currentMessage.title }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag v-if="currentMessage.messageType === 1" type="success">系统通知</el-tag>
            <el-tag v-else-if="currentMessage.messageType === 2" type="warning">业务通知</el-tag>
            <el-tag v-else type="info">公告</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布人">{{ currentMessage.senderName }}</el-descriptions-item>
          <el-descriptions-item label="发布时间">
            {{ currentMessage.publishDate ? formatDate(currentMessage.publishDate) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag v-if="currentMessage.priority === 1" type="danger">紧急</el-tag>
            <el-tag v-else-if="currentMessage.priority === 2" type="warning">重要</el-tag>
            <el-tag v-else type="info">普通</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentMessage.isRead === 1 ? 'success' : 'danger'">
              {{ currentMessage.isRead === 1 ? '已读' : '未读' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <div class="content">
          <h4>通知内容</h4>
          <div class="content-text">{{ currentMessage.content }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleMarkAsRead" v-if="currentMessage && currentMessage.isRead === 0">标记已读</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  getMessageList,
  publishMessage,
  markAsRead,
  deleteMessage,
  type Message,
  type PageParams
} from '@/api/system'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const tableData = ref<Message[]>([])
const publishDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const publishFormRef = ref<FormInstance>()
const currentMessage = ref<Message | null>(null)

const searchForm = reactive({
  keyword: '',
  messageType: null as number | null
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const publishForm = reactive<Message>({
  title: '',
  content: '',
  messageType: 1,
  senderID: 1,
  senderName: '',
  receiverIDs: '',
  receiverNames: '',
  isAll: 1,
  priority: 0,
  status: 1
})

const publishRules: FormRules = {
  title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
  messageType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const fetchData = async () => {
  loading.value = true
  try {
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
    const res = await getMessageList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.messageType = null
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

const handlePublish = () => {
  publishForm.senderID = authStore.userInfo?.userId || 1
  publishForm.senderName = authStore.userInfo?.realName || '系统管理员'
  publishDialogVisible.value = true
}

const handleIsAllChange = () => {
  if (publishForm.isAll === 1) {
    publishForm.receiverIDs = ''
    publishForm.receiverNames = ''
  }
}

const handlePublishSubmit = async () => {
  await publishFormRef.value?.validate()
  try {
    await publishMessage(publishForm)
    ElMessage.success('发布成功')
    publishDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

const handleView = (row: Message) => {
  currentMessage.value = row
  detailDialogVisible.value = true
}

const handleRowClick = (row: Message) => {
  currentMessage.value = row
  detailDialogVisible.value = true
}

const handleMarkAsRead = async () => {
  if (currentMessage.value && authStore.userInfo) {
    try {
      await markAsRead(currentMessage.value.messageID!, authStore.userInfo.userId)
      ElMessage.success('标记已读成功')
      if (currentMessage.value) {
        currentMessage.value.isRead = 1
      }
      fetchData()
    } catch (error) {
      ElMessage.error('标记已读失败')
    }
  }
}

const handleDelete = async (row: Message) => {
  try {
    await ElMessageBox.confirm('确定要删除该通知吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteMessage(row.messageID!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const resetPublishForm = () => {
  publishFormRef.value?.resetFields()
  Object.assign(publishForm, {
    title: '',
    content: '',
    messageType: 1,
    senderID: 1,
    senderName: '',
    receiverIDs: '',
    receiverNames: '',
    isAll: 1,
    priority: 0,
    status: 1
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.message-detail {
  .content {
    h4 {
      margin-bottom: 10px;
    }
    .content-text {
      white-space: pre-wrap;
      line-height: 1.8;
    }
  }
}
</style>
