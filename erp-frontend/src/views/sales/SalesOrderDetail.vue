<template>
  <div class="sales-order-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>销售订单详情</span>
          <el-button @click="goBack">返回</el-button>
        </div>
      </template>

      <div v-loading="loading" class="detail-content">
        <el-descriptions :column="2" border v-if="order">
          <el-descriptions-item label="订单编号">
            {{ order.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item label="客户名称">
            {{ order.customerName }}
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
          <el-descriptions-item label="总成本">
            <span style="font-weight: bold; color: #409eff">
              ¥{{ order.totalCost?.toFixed(2) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="总利润">
            <span style="font-weight: bold; color: #67c23a">
              ¥{{ order.totalProfit?.toFixed(2) }}
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
            <el-table-column prop="costPrice" label="成本价">
              <template #default="{ row }">
                ¥{{ row.costPrice?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="profit" label="利润">
              <template #default="{ row }">
                ¥{{ row.profit?.toFixed(2) }}
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
import { getSalesOrder, getSalesOrderDetails, type SalesOrder, type SalesOrderDetail } from '@/api/sales'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const order = ref<SalesOrder | null>(null)
const details = ref<SalesOrderDetail[]>([])

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'warning',
    approved: 'success',
    producing: 'primary',
    shipped: 'info',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    producing: '生产中',
    shipped: '已发货',
    completed: '已完成'
  }
  return textMap[status] || status
}

const goBack = () => {
  router.back()
}

const loadData = async () => {
  loading.value = true
  try {
    const orderId = Number(route.params.id)
    const orderRes = await getSalesOrder(orderId)
    order.value = orderRes.data
    
    const detailsRes = await getSalesOrderDetails(orderId)
    details.value = detailsRes.data
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
