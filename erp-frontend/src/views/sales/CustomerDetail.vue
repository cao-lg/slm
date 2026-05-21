<template>
  <div class="customer-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户详情</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="2" border v-if="customer">
          <el-descriptions-item label="客户编号">
            {{ customer.customerCode }}
          </el-descriptions-item>
          <el-descriptions-item label="客户名称">
            {{ customer.customerName }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            {{ customer.contact }}
          </el-descriptions-item>
          <el-descriptions-item label="电话">
            {{ customer.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="传真">
            {{ customer.fax }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ customer.email }}
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            {{ customer.address }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="customer.status === 1 ? 'success' : 'danger'">
              {{ customer.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const customer = ref<any>(null)

const goBack = () => {
  router.back()
}

const loadData = async () => {
  loading.value = true
  try {
    const customerId = route.params.id
    customer.value = {
      customerID: customerId,
      customerCode: `KH2025052000${customerId}`,
      customerName: '北京科技有限公司',
      contact: '张三',
      phone: '13800138001',
      fax: '010-66666666',
      email: 'zhang@tech.com',
      address: '北京市朝阳区望京',
      status: 1
    }
  } catch (error) {
    ElMessage.error('加载详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content {
  padding: 20px 0;
}
</style>
