<template>
  <div class="quotation-detail" data-testid="quotation-detail-page">
    <el-card data-testid="quotation-detail-card">
      <template #header>
        <div class="card-header">
          <span>报价单详情</span>
          <el-button @click="goBack" data-testid="quotation-detail-back-btn">返回</el-button>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="2" border v-if="quotation" data-testid="quotation-detail-descriptions">
          <el-descriptions-item label="报价单号">
            {{ quotation.quotationNo }}
          </el-descriptions-item>
          <el-descriptions-item label="客户名称">
            {{ quotation.customerName }}
          </el-descriptions-item>
          <el-descriptions-item label="报价日期">
            {{ quotation.quotationDate }}
          </el-descriptions-item>
          <el-descriptions-item label="有效期至">
            {{ quotation.validUntil }}
          </el-descriptions-item>
          <el-descriptions-item label="总金额">
            <span style="font-weight: bold; color: #f56c6c">
              ¥{{ quotation.totalAmount?.toFixed(2) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(quotation.status)">
              {{ getStatusText(quotation.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="制单人">
            {{ quotation.creator }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-section" data-testid="quotation-detail-section">
          <h4>报价明细</h4>
          <el-table :data="details" border style="width: 100%" data-testid="quotation-detail-table">
            <el-table-column prop="productName" label="产品名称" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="unitPrice" label="单价">
              <template #default="{ row }">
                ¥{{ row.unitPrice?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额">
              <template #default="{ row }">
                ¥{{ row.amount?.toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
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
const quotation = ref<any>(null)
const details = ref<any[]>([])

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
    converted: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待确认',
    accepted: '已接受',
    rejected: '已拒绝',
    converted: '已转化'
  }
  return textMap[status] || status
}

const goBack = () => {
  router.back()
}

const loadData = async () => {
  loading.value = true
  try {
    const quotationId = route.params.id
    quotation.value = {
      quotationID: quotationId,
      quotationNo: `BJ2025052000${quotationId}`,
      customerID: 1,
      customerName: '北京科技有限公司',
      quotationDate: '2025-05-20',
      validUntil: '2025-06-20',
      totalAmount: 5000,
      status: 'accepted',
      creator: '陈立国'
    }
    details.value = [
      {
        detailID: 1,
        quotationID: quotationId,
        productID: 1,
        productName: 'A型配件',
        unit: '个',
        quantity: 50,
        unitPrice: 100,
        amount: 5000
      }
    ]
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

.detail-section {
  margin-top: 30px;
}

.detail-section h4 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}
</style>
