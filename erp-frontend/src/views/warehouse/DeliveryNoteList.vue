<template>
  <div class="delivery-note-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>发货单管理</span>
          <el-button type="primary" @click="handleAdd">新增发货</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="发货单号">
          <el-input v-model="searchForm.deliveryNo" placeholder="请输入发货单号" clearable />
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待发货" value="pending" />
            <el-option label="已发货" value="shipped" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="deliveryNo" label="发货单号" width="180" />
        <el-table-column prop="orderNo" label="关联订单" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="200" />
        <el-table-column prop="deliveryDate" label="发货日期" width="120" />
        <el-table-column prop="totalAmount" label="金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="carrier" label="承运商" width="120" />
        <el-table-column prop="trackingNo" label="运单号" width="150" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)" v-if="row.status === 'pending'">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="900px" @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="销售订单" prop="soID">
              <el-select v-model="formData.soID" placeholder="请选择销售订单" filterable style="width: 100%" @change="handleOrderChange">
                <el-option
                  v-for="order in salesOrderList"
                  :key="order.soID"
                  :label="order.orderNo + ' - ' + order.customerName"
                  :value="order.soID!"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货日期" prop="deliveryDate">
              <el-date-picker v-model="formData.deliveryDate" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="承运商">
              <el-input v-model="formData.carrier" placeholder="请输入承运商" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运单号">
              <el-input v-model="formData.trackingNo" placeholder="请输入运单号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" />
        </el-form-item>

        <el-divider>发货明细</el-divider>

        <div class="detail-table">
          <el-table :data="details" border size="small">
            <el-table-column prop="productName" label="产品名称" width="120" />
            <el-table-column prop="unit" label="单位" width="60" />
            <el-table-column prop="orderQuantity" label="订单数量" width="100" />
            <el-table-column prop="deliveredQuantity" label="已发货" width="90" />
            <el-table-column prop="remainingQuantity" label="剩余数量" width="90">
              <template #default="{ row }">
                <span :style="{ color: row.remainingQuantity > 0 ? '#67C23A' : '#F56C6C' }">
                  {{ row.remainingQuantity }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="本次发货" width="120">
              <template #default="{ row, $index }">
                <el-input-number
                  v-model="row.quantity"
                  :min="0"
                  :max="row.remainingQuantity"
                  :step="1"
                  size="small"
                  @change="handleQuantityChange($index)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="100">
              <template #default="{ row }">¥{{ row.price?.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="金额" width="100">
              <template #default="{ row }">¥{{ (row.quantity * row.price).toFixed(2) }}</template>
            </el-table-column>
          </el-table>
          <div class="detail-summary">
            <span>本次发货总金额：</span>
            <span class="amount">¥{{ totalDeliveryAmount.toFixed(2) }}</span>
          </div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="viewDialogVisible" title="发货单详情" width="900px">
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="发货单号">{{ currentRow.deliveryNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="关联订单">{{ currentRow.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentRow.customerName }}</el-descriptions-item>
        <el-descriptions-item label="发货日期">{{ currentRow.deliveryDate }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ currentRow.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="承运商">{{ currentRow.carrier || '-' }}</el-descriptions-item>
        <el-descriptions-item label="运单号">{{ currentRow.trackingNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="制单人">{{ currentRow.creator }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>发货明细</el-divider>

      <el-table :data="viewDetails" border size="small">
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="quantity" label="数量" width="120" />
        <el-table-column prop="price" label="单价" width="120">
          <template #default="{ row }">¥{{ row.price?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getDeliveryNoteList,
  getDeliveryNoteDetails,
  addDeliveryNote,
  deleteDeliveryNote,
  inventoryOut,
  getSalesOrdersForDelivery,
  getSalesOrderDetailsForDelivery,
  type DeliveryNote,
  type DeliveryNoteDetail,
  type SalesOrder,
  type SalesOrderDetail,
  type PageParams
} from '@/api/warehouse'

const loading = ref(false)
const tableData = ref<DeliveryNote[]>([])
const salesOrderList = ref<SalesOrder[]>([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<DeliveryNote | null>(null)
const viewDetails = ref<DeliveryNoteDetail[]>([])

const searchForm = reactive({
  deliveryNo: '',
  orderNo: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<DeliveryNote>({
  deliveryID: undefined,
  deliveryNo: '',
  soID: undefined,
  orderNo: '',
  customerID: undefined,
  customerName: '',
  deliveryDate: '',
  status: 'pending',
  carrier: '',
  trackingNo: '',
  totalAmount: 0,
  creator: '',
  remark: ''
})

const details = ref<DeliveryNoteDetail[]>([])

const totalDeliveryAmount = computed(() => {
  return details.value.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0)
})

const formRules = {
  soID: [{ required: true, message: '请选择销售订单', trigger: 'change' }],
  deliveryDate: [{ required: true, message: '请选择发货日期', trigger: 'change' }]
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'warning',
    shipped: 'success'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待发货',
    shipped: '已发货'
  }
  return texts[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    const res = await getDeliveryNoteList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const fetchSalesOrders = async () => {
  try {
    const res = await getSalesOrdersForDelivery()
    salesOrderList.value = res.data
  } catch (error) {
    console.error('获取销售订单列表失败', error)
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.deliveryNo = ''
  searchForm.orderNo = ''
  searchForm.status = ''
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

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增发货单'
  details.value = []
  dialogVisible.value = true
}

const handleOrderChange = async (soID: number) => {
  try {
    const res = await getSalesOrderDetailsForDelivery(soID)
    details.value = res.data.map((d: SalesOrderDetail) => ({
      productID: d.productID,
      productName: d.productName,
      unit: d.unit,
      orderQuantity: d.quantity,
      deliveredQuantity: d.deliveredQuantity || 0,
      remainingQuantity: (d.quantity || 0) - (d.deliveredQuantity || 0),
      quantity: (d.quantity || 0) - (d.deliveredQuantity || 0),
      price: d.price,
      amount: d.amount
    }))
  } catch (error) {
    console.error('获取订单详情失败', error)
  }
}

const handleQuantityChange = (index: number) => {
  const detail = details.value[index]
  if (detail.quantity > detail.remainingQuantity) {
    ElMessage.warning(`发货数量不能超过剩余数量 ${detail.remainingQuantity}`)
    detail.quantity = detail.remainingQuantity
  }
}

const handleView = async (row: DeliveryNote) => {
  currentRow.value = row
  try {
    const res = await getDeliveryNoteDetails(row.deliveryID!)
    viewDetails.value = res.data
  } catch (error) {
    console.error('获取详情失败', error)
  }
  viewDialogVisible.value = true
}

const handleDelete = async (row: DeliveryNote) => {
  try {
    await ElMessageBox.confirm('确定要删除该发货单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteDeliveryNote(row.deliveryID!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  
  const hasValidQuantity = details.value.some(d => d.quantity > 0)
  if (!hasValidQuantity) {
    ElMessage.warning('请至少输入一个产品的发货数量')
    return
  }
  
  try {
    const order = salesOrderList.value.find(o => o.soID === formData.soID)
    if (order) {
      formData.customerID = order.customerID
      formData.customerName = order.customerName
    }

    formData.totalAmount = totalDeliveryAmount.value

    const requestData = {
      note: formData,
      details: details.value
    }

    await addDeliveryNote(requestData as any)
    
    for (const detail of details.value) {
      if (detail.quantity > 0) {
        await inventoryOut({
          warehouseID: 2,
          productID: detail.productID,
          quantity: detail.quantity
        })
      }
    }
    
    ElMessage.success('发货成功，库存已更新')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('发货失败')
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    deliveryID: undefined,
    deliveryNo: '',
    soID: undefined,
    orderNo: '',
    customerID: undefined,
    customerName: '',
    deliveryDate: '',
    status: 'pending',
    carrier: '',
    trackingNo: '',
    totalAmount: 0,
    creator: '',
    remark: ''
  })
  details.value = []
}

onMounted(() => {
  fetchData()
  fetchSalesOrders()
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

.detail-table {
  margin-top: 10px;
}

.detail-summary {
  margin-top: 15px;
  text-align: right;
  font-size: 16px;
  color: #606266;
}

.detail-summary .amount {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}
</style>
