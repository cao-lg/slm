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
          <el-descriptions-item label="客户简称">
            {{ customer.customerShortName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="省份">
            {{ customer.province || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="城市">
            {{ customer.city || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            {{ customer.address || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            {{ customer.contact || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="电话">
            {{ customer.phone || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="传真">
            {{ customer.fax || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ customer.email || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="发货天数">
            {{ customer.deliveryDays ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="付款天数">
            {{ customer.paymentDays ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="信用额度">
            <span style="color: #409eff; font-weight: bold">
              ¥{{ customer.creditLimit?.toFixed(2) || '0.00' }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="已用信用">
            <span style="color: #e6a23c; font-weight: bold">
              ¥{{ customer.usedCredit?.toFixed(2) || '0.00' }}
            </span>
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
import { getCustomer, Customer } from '@/api/sales'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const customer = ref<Customer | null>(null)

const goBack = () => {
  router.back()
}

const loadData = async () => {
  loading.value = true
  try {
    const customerId = Number(route.params.id)
    const response = await getCustomer(customerId)
    customer.value = response.data
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
