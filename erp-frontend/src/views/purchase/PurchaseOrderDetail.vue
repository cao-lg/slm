<template>
  <div class="purchase-order-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>采购订单详情</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="2" border v-if="order">
          <el-descriptions-item label="订单编号">
            {{ order.poNo }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商名称">
            {{ order.supplierName }}
          </el-descriptions-item>
          <el-descriptions-item label="订单日期">
            {{ order.orderDate }}
          </el-descriptions-item>
          <el-descriptions-item label="交货日期">
            {{ order.deliveryDate }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">
            <span style="font-weight: bold; color: #f56c6c">
              ¥{{ order.totalAmount?.toFixed(2) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(order.status)">
              {{ getStatusText(order.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="制单人">
            {{ order.creator }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>订单明细</h4>
          <el-table :data="details" border style="width: 100%">
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
const order = ref<any>(null)
const details = ref<any[]>([])

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    received: 'success'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    received: '已收货'
  }
  return textMap[status] || status
}

const goBack = () => {
  router.back()
}

const loadData = async () => {
  loading.value = true
  try {
    const orderId = route.params.id
    order.value = {
      poID: orderId,
      poNo: `CG2025052000${orderId}`,
      supplierID: 1,
      supplierName: '深圳材料厂',
      orderDate: '2025-05-20',
      deliveryDate: '2025-05-30',
      totalAmount: 5000,
      status: 'approved',
      creator: '陈立国'
    }
    details.value = [
      {
        detailID: 1,
        poID: orderId,
        productID: 1,
        productName: 'A型配件',
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
