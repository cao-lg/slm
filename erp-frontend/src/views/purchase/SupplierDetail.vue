<template>
  <div class="supplier-detail" data-testid="supplier-detail-page">
    <el-card data-testid="supplier-detail-card">
      <template #header>
        <div class="card-header">
          <span data-testid="supplier-detail-title">供应商详情</span>
          <el-button @click="goBack" data-testid="supplier-detail-back-btn">返回</el-button>
        </div>
      </template>

      <div v-loading="loading" class="detail-content" data-testid="supplier-detail-content">
        <el-descriptions :column="2" border v-if="supplier" data-testid="supplier-detail-descriptions">
          <el-descriptions-item label="供应商编号" data-testid="supplier-detail-code-item">
            {{ supplier.supplierCode }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商名称" data-testid="supplier-detail-name-item">
            {{ supplier.supplierName }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人" data-testid="supplier-detail-contact-item">
            {{ supplier.contact }}
          </el-descriptions-item>
          <el-descriptions-item label="电话" data-testid="supplier-detail-phone-item">
            {{ supplier.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="传真" data-testid="supplier-detail-fax-item">
            {{ supplier.fax }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱" data-testid="supplier-detail-email-item">
            {{ supplier.email }}
          </el-descriptions-item>
          <el-descriptions-item label="地址" data-testid="supplier-detail-address-item">
            {{ supplier.address }}
          </el-descriptions-item>
          <el-descriptions-item label="状态" data-testid="supplier-detail-status-item">
            <el-tag :type="supplier.status === 1 ? 'success' : 'danger'" data-testid="supplier-detail-status-tag">
              {{ supplier.status === 1 ? '启用' : '禁用' }}
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
import { getSupplier, Supplier } from '@/api/purchase'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const supplier = ref<Supplier | null>(null)

const goBack = () => {
  router.back()
}

const loadData = async () => {
  loading.value = true
  try {
    const supplierId = Number(route.params.id)
    const response = await getSupplier(supplierId)
    supplier.value = response.data
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
