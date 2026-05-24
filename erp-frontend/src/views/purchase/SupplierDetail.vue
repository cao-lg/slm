<template>
  <div class="supplier-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>供应商详情</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="2" border v-if="supplier">
          <el-descriptions-item label="供应商编号">
            {{ supplier.supplierCode }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商名称">
            {{ supplier.supplierName }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人">
            {{ supplier.contact }}
          </el-descriptions-item>
          <el-descriptions-item label="电话">
            {{ supplier.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="传真">
            {{ supplier.fax }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ supplier.email }}
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            {{ supplier.address }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="supplier.status === 1 ? 'success' : 'danger'">
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
