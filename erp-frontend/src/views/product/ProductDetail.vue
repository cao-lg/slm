<template>
  <div class="product-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>产品详情</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="2" border v-if="product">
          <el-descriptions-item label="产品编号">
            {{ product.productCode }}
          </el-descriptions-item>
          <el-descriptions-item label="产品名称">
            {{ product.productName }}
          </el-descriptions-item>
          <el-descriptions-item label="类别">
            {{ product.category }}
          </el-descriptions-item>
          <el-descriptions-item label="单位">
            {{ product.unit }}
          </el-descriptions-item>
          <el-descriptions-item label="规格">
            {{ product.spec }}
          </el-descriptions-item>
          <el-descriptions-item label="售价">
            <span style="color: #f56c6c; font-weight: bold">
              ¥{{ product.price?.toFixed(2) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="成本价">
            <span style="color: #e6a23c; font-weight: bold">
              ¥{{ product.cost?.toFixed(2) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="product.status === 1 ? 'success' : 'danger'">
              {{ product.status === 1 ? '启用' : '禁用' }}
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
const product = ref<any>(null)

const goBack = () => {
  router.back()
}

const loadData = async () => {
  loading.value = true
  try {
    const productId = route.params.id
    product.value = {
      productID: productId,
      productCode: `CP2025052000${productId}`,
      productName: 'A型配件',
      category: '配件',
      unit: '个',
      spec: '直径10mm',
      price: 100,
      cost: 50,
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
