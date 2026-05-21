<template>
  <div class="return-note-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>退货单管理</span>
          <el-button type="primary" @click="handleAdd">新增退货</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="退货单号">
          <el-input v-model="searchForm.returnNo" placeholder="请输入退货单号" clearable />
        </el-form-item>
        <el-form-item label="源单号">
          <el-input v-model="searchForm.sourceNo" placeholder="请输入源单号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待审核" value="pending" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="returnNo" label="退货单号" width="180" />
        <el-table-column prop="sourceNo" label="源单号" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="200" />
        <el-table-column prop="warehouseName" label="退货仓库" width="150" />
        <el-table-column prop="returnDate" label="退货日期" width="120" />
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
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'">审核</el-button>
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
            <el-form-item label="源单类型" prop="sourceType">
              <el-select v-model="formData.sourceType" placeholder="请选择源单类型" style="width: 100%" @change="handleSourceTypeChange">
                <el-option label="销售订单" :value="1" />
                <el-option label="直接退货" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="源单号" prop="sourceNo">
              <div class="source-no-input">
                <el-input v-model="formData.sourceNo" placeholder="请选择销售订单" readonly />
                <el-button type="primary" @click="fetchSalesOrders" v-if="formData.sourceType === 1">选择订单</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户" prop="customerID">
              <el-select v-model="formData.customerID" placeholder="请选择客户" filterable style="width: 100%">
                <el-option
                  v-for="customer in customerList"
                  :key="customer.customerID"
                  :label="customer.customerName"
                  :value="customer.customerID!"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货仓库" prop="warehouseID">
              <el-select v-model="formData.warehouseID" placeholder="请选择仓库" style="width: 100%">
                <el-option
                  v-for="warehouse in warehouseList"
                  :key="warehouse.warehouseID"
                  :label="warehouse.warehouseName"
                  :value="warehouse.warehouseID!"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="退货日期" prop="returnDate">
              <el-date-picker v-model="formData.returnDate" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" />
        </el-form-item>

        <el-divider>退货明细</el-divider>

        <div class="detail-table">
          <el-table :data="details" border size="small">
            <el-table-column label="产品" width="200">
              <template #default="{ row, $index }">
                <el-select v-model="row.productID" placeholder="选择产品" filterable @change="handleProductChange($index)">
                  <el-option
                    v-for="product in productList"
                    :key="product.productID"
                    :label="product.productName"
                    :value="product.productID!"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" width="150" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column label="数量" width="120">
              <template #default="{ row, $index }">
                <el-input-number v-model="row.quantity" :min="0" :precision="2" size="small" @change="calculateAmount($index)" />
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template #default="{ row, $index }">
                <el-input-number v-model="row.price" :min="0" :precision="2" size="small" @change="calculateAmount($index)" />
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeDetail($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="addDetail" class="add-detail-btn">添加产品</el-button>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="viewDialogVisible" title="退货单详情" width="900px">
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="退货单号">{{ currentRow.returnNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="源单类型">
          {{ currentRow.sourceType === 1 ? '销售订单' : '直接退货' }}
        </el-descriptions-item>
        <el-descriptions-item label="源单号">{{ currentRow.sourceNo }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentRow.customerName }}</el-descriptions-item>
        <el-descriptions-item label="退货仓库">{{ currentRow.warehouseName }}</el-descriptions-item>
        <el-descriptions-item label="退货日期">{{ currentRow.returnDate }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ currentRow.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="制单人">{{ currentRow.creator }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>退货明细</el-divider>

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

    <el-dialog v-model="showSalesOrderSelect" title="选择销售订单" width="800px">
      <el-table :data="salesOrderList" border @row-click="handleSelectSalesOrder" highlight-current-row>
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="customerName" label="客户名称" />
        <el-table-column prop="orderDate" label="订单日期" width="120" />
        <el-table-column prop="totalAmount" label="订单金额" width="120">
          <template #default="{ row }">¥{{ row.totalAmount?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : 'info'" size="small">
              {{ row.status === 'approved' ? '已批准' : row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getReturnNoteList,
  getReturnNoteDetails,
  addReturnNote,
  deleteReturnNote,
  approveReturnNote,
  getWarehouseList,
  returnInventoryIn,
  getSalesOrdersForReturn,
  getSalesOrderDetailsForReturn,
  type ReturnNote,
  type ReturnNoteDetail,
  type Warehouse,
  type PageParams,
  type SalesOrder,
  type SalesOrderDetail
} from '@/api/warehouse'
import { getProductList } from '@/api/product'
import { getCustomerList } from '@/api/sales'

const loading = ref(false)
const tableData = ref<ReturnNote[]>([])
const customerList = ref<any[]>([])
const warehouseList = ref<Warehouse[]>([])
const productList = ref<any[]>([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<ReturnNote | null>(null)
const viewDetails = ref<ReturnNoteDetail[]>([])
const salesOrderList = ref<SalesOrder[]>([])
const showSalesOrderSelect = ref(false)

const searchForm = reactive({
  returnNo: '',
  sourceNo: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<ReturnNote>({
  returnID: undefined,
  returnNo: '',
  sourceType: 1,
  sourceID: undefined,
  sourceNo: '',
  customerID: undefined,
  customerName: '',
  warehouseID: undefined,
  warehouseName: '',
  returnDate: '',
  status: 'pending',
  totalAmount: 0,
  creator: '',
  remark: ''
})

const details = ref<ReturnNoteDetail[]>([])

const formRules = {
  sourceType: [{ required: true, message: '请选择源单类型', trigger: 'change' }],
  sourceNo: [{ required: true, message: '请输入源单号', trigger: 'blur' }],
  customerID: [{ required: true, message: '请选择客户', trigger: 'change' }],
  warehouseID: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  returnDate: [{ required: true, message: '请选择退货日期', trigger: 'change' }]
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'warning',
    completed: 'success'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待审核',
    completed: '已完成'
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
    const res = await getReturnNoteList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const fetchCustomers = async () => {
  try {
    const res = await getCustomerList({ page: 1, pageSize: 1000 })
    customerList.value = res.data.list
  } catch (error) {
    console.error('获取客户列表失败', error)
  }
}

const fetchWarehouses = async () => {
  try {
    const res = await getWarehouseList()
    warehouseList.value = res.data
    const pendingWarehouse = warehouseList.value.find(w => w.type === 'pending')
    if (pendingWarehouse) {
      formData.warehouseID = pendingWarehouse.warehouseID
      formData.warehouseName = pendingWarehouse.warehouseName
    }
  } catch (error) {
    console.error('获取仓库列表失败', error)
  }
}

const fetchSalesOrders = async () => {
  try {
    const res = await getSalesOrdersForReturn()
    salesOrderList.value = res.data
    showSalesOrderSelect.value = true
  } catch (error) {
    console.error('获取销售订单列表失败', error)
    ElMessage.error('获取销售订单列表失败')
  }
}

const handleSelectSalesOrder = async (order: SalesOrder) => {
  formData.sourceID = order.soID
  formData.sourceNo = order.orderNo
  formData.customerID = order.customerID
  formData.customerName = order.customerName
  showSalesOrderSelect.value = false
  
  try {
    const res = await getSalesOrderDetailsForReturn(order.soID!)
    details.value = res.data.map((item: SalesOrderDetail) => ({
      productID: item.productID,
      productName: item.productName,
      unit: item.unit,
      quantity: item.quantity,
      price: item.price,
      amount: item.amount
    }))
  } catch (error) {
    console.error('获取销售订单详情失败', error)
  }
}

const fetchProducts = async () => {
  try {
    const res = await getProductList({ page: 1, pageSize: 1000 })
    productList.value = res.data.list
  } catch (error) {
    console.error('获取产品列表失败', error)
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.returnNo = ''
  searchForm.sourceNo = ''
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

const handleSourceTypeChange = () => {
  formData.sourceNo = ''
  formData.sourceID = undefined
  details.value = []
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增退货单'
  details.value = []
  dialogVisible.value = true
  
  setTimeout(() => {
    const pendingWarehouse = warehouseList.value.find(w => w.type === 'pending')
    if (pendingWarehouse) {
      formData.warehouseID = pendingWarehouse.warehouseID
      formData.warehouseName = pendingWarehouse.warehouseName
    }
  }, 100)
}

const handleView = async (row: ReturnNote) => {
  currentRow.value = row
  try {
    const res = await getReturnNoteDetails(row.returnID!)
    viewDetails.value = res.data
  } catch (error) {
    console.error('获取详情失败', error)
  }
  viewDialogVisible.value = true
}

const handleApprove = async (row: ReturnNote) => {
  try {
    await ElMessageBox.confirm('确定要审核通过该退货单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await approveReturnNote(row.returnID!)
    ElMessage.success('审核成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核失败')
    }
  }
}

const handleDelete = async (row: ReturnNote) => {
  try {
    await ElMessageBox.confirm('确定要删除该退货单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteReturnNote(row.returnID!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const addDetail = () => {
  details.value.push({
    productID: 0,
    productName: '',
    unit: '',
    quantity: 1,
    price: 0,
    amount: 0
  })
}

const removeDetail = (index: number) => {
  details.value.splice(index, 1)
}

const handleProductChange = (index: number) => {
  const product = productList.value.find(p => p.productID === details.value[index].productID)
  if (product) {
    details.value[index].productName = product.productName
    details.value[index].unit = product.unit
    details.value[index].price = product.price
    calculateAmount(index)
  }
}

const calculateAmount = (index: number) => {
  const detail = details.value[index]
  detail.amount = detail.quantity * detail.price
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  try {
    const customer = customerList.value.find(c => c.customerID === formData.customerID)
    const warehouse = warehouseList.value.find(w => w.warehouseID === formData.warehouseID)
    if (customer) formData.customerName = customer.customerName
    if (warehouse) formData.warehouseName = warehouse.warehouseName

    const totalAmount = details.value.reduce((sum, d) => sum + d.amount, 0)
    formData.totalAmount = totalAmount

    const requestData = {
      note: formData,
      details: details.value.filter(d => d.productID > 0)
    }

    await returnInventoryIn(requestData as any)
    ElMessage.success('退货单创建成功，已入库到待处理仓')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('创建退货单失败', error)
    ElMessage.error('创建退货单失败')
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    returnID: undefined,
    returnNo: '',
    sourceType: 1,
    sourceID: undefined,
    sourceNo: '',
    customerID: undefined,
    customerName: '',
    warehouseID: undefined,
    warehouseName: '',
    returnDate: '',
    status: 'pending',
    totalAmount: 0,
    creator: '',
    remark: ''
  })
  details.value = []
}

onMounted(() => {
  fetchData()
  fetchCustomers()
  fetchWarehouses()
  fetchProducts()
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

.add-detail-btn {
  margin-top: 10px;
}

.source-no-input {
  display: flex;
  gap: 8px;
}

.source-no-input .el-input {
  flex: 1;
}
</style>
