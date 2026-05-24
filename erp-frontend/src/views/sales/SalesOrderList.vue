<template>
  <div class="sales-order-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>销售订单管理</span>
          <el-button type="primary" @click="handleAdd">新增订单</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="searchForm.customerID" placeholder="请选择客户" clearable filterable style="width: 200px">
            <el-option
              v-for="customer in customerList"
              :key="customer.customerID"
              :label="customer.customerName"
              :value="customer.customerID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待审核" value="pending" />
            <el-option label="已审核" value="approved" />
            <el-option label="生产中" value="producing" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="200" />
        <el-table-column prop="orderDate" label="下单日期" width="120" />
        <el-table-column prop="deliveryDate" label="交货日期" width="120" />
        <el-table-column prop="totalAmount" label="订单金额" width="120">
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
        <el-table-column prop="creator" label="制单人" width="100" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)" v-if="row.status === 'pending'">编辑</el-button>
            <el-button link type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'">审核</el-button>
            <el-button link type="warning" size="small" @click="handleProduce(row)" v-if="row.status === 'approved'">开始生产</el-button>
            <el-button link type="info" size="small" @click="handleShip(row)" v-if="row.status === 'producing'">发货</el-button>
            <el-button link type="success" size="small" @click="handleComplete(row)" v-if="row.status === 'shipped'">完成</el-button>
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
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
            <el-form-item label="下单日期" prop="orderDate">
              <el-date-picker
                v-model="formData.orderDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交货日期" prop="deliveryDate">
              <el-date-picker
                v-model="formData.deliveryDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单金额">
              <el-input v-model="formData.totalAmount" readonly>
                <template #prefix>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>产品明细</el-divider>

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
                <el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" @change="calculateAmount($index)" />
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                ¥{{ row.amount?.toFixed(2) }}
              </template>
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

    <el-dialog
      v-model="viewDialogVisible"
      title="订单详情"
      width="900px"
    >
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="订单号">{{ currentRow.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentRow.customerName }}</el-descriptions-item>
        <el-descriptions-item label="下单日期">{{ currentRow.orderDate }}</el-descriptions-item>
        <el-descriptions-item label="交货日期">{{ currentRow.deliveryDate }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ currentRow.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="制单人">{{ currentRow.creator }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>产品明细</el-divider>

      <el-table :data="viewDetails" border size="small">
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column label="单价" width="120">
          <template #default="{ row }">¥{{ row.unitPrice?.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">¥{{ row.amount?.toFixed(2) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getSalesOrderList,
  getSalesOrderDetails,
  addSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  updateSalesOrderStatus,
  getCustomerList,
  getQuotation,
  getQuotationDetails,
  type SalesOrder,
  type SalesOrderDetail,
  type Customer,
  type PageParams
} from '@/api/sales'
import { getProductList } from '@/api/product'
import { addReceivable, type Receivable } from '@/api/finance'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const tableData = ref<SalesOrder[]>([])
const customerList = ref<Customer[]>([])
const productList = ref<any[]>([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<SalesOrder | null>(null)
const viewDetails = ref<SalesOrderDetail[]>([])

const searchForm = reactive({
  orderNo: '',
  customerID: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<SalesOrder>({
  soID: undefined,
  orderNo: '',
  customerID: 0,
  customerName: '',
  orderDate: '',
  deliveryDate: '',
  totalAmount: 0,
  status: 'pending',
  creator: ''
})

const details = ref<SalesOrderDetail[]>([])

const formRules = {
  customerID: [{ required: true, message: '请选择客户', trigger: 'change' }],
  orderDate: [{ required: true, message: '请选择下单日期', trigger: 'change' }],
  deliveryDate: [{ required: true, message: '请选择交货日期', trigger: 'change' }]
}

const validateDetails = () => {
  if (details.value.length === 0) {
    ElMessage.error('请至少添加一个产品')
    return false
  }
  for (let i = 0; i < details.value.length; i++) {
    const detail = details.value[i]
    if (!detail.productID) {
      ElMessage.error(`第${i + 1}行：请选择产品`)
      return false
    }
    if (!detail.quantity || detail.quantity <= 0) {
      ElMessage.error(`第${i + 1}行：请输入有效的数量`)
      return false
    }
    if (!detail.unitPrice || detail.unitPrice <= 0) {
      ElMessage.error(`第${i + 1}行：请输入有效的单价`)
      return false
    }
  }
  return true
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'warning',
    approved: 'primary',
    producing: 'info',
    shipped: 'success',
    completed: 'success'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    producing: '生产中',
    shipped: '已发货',
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
    const res = await getSalesOrderList(params)
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
  searchForm.orderNo = ''
  searchForm.customerID = ''
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
  dialogTitle.value = '新增销售订单'
  details.value = []
  addDetail()
  dialogVisible.value = true
}

const handleEdit = async (row: SalesOrder) => {
  isEdit.value = true
  dialogTitle.value = '编辑销售订单'
  Object.assign(formData, row)
  try {
    const res = await getSalesOrderDetails(row.soID!)
    details.value = res.data
  } catch (error) {
    console.error('获取详情失败', error)
  }
  dialogVisible.value = true
}

const handleView = (row: SalesOrder) => {
  router.push(`/sales/order/${row.soID}`)
}

const handleApprove = async (row: SalesOrder) => {
  try {
    await ElMessageBox.confirm('确定要审核通过该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateSalesOrderStatus(row.soID!, 'approved')
    ElMessage.success('审核成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核失败')
    }
  }
}

const handleProduce = async (row: SalesOrder) => {
  try {
    await ElMessageBox.confirm('确定要开始生产该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateSalesOrderStatus(row.soID!, 'producing')
    ElMessage.success('已开始生产')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleShip = async (row: SalesOrder) => {
  try {
    await ElMessageBox.confirm('确定该订单已发货吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateSalesOrderStatus(row.soID!, 'shipped')
    ElMessage.success('已标记为已发货')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleComplete = async (row: SalesOrder) => {
  try {
    await ElMessageBox.confirm('确定该订单已完成吗？订单完成后将自动生成应收款记录。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    })
    await updateSalesOrderStatus(row.soID!, 'completed')
    ElMessage.success('订单已完成，正在生成应收款...')
    
    const receivableData: Receivable = {
      customerID: row.customerID,
      customerName: row.customerName || '',
      salesOrderID: row.soID,
      totalAmount: row.totalAmount || 0,
      receivedAmount: 0,
      pendingAmount: row.totalAmount || 0,
      dueDate: row.deliveryDate || '',
      status: 'pending',
      creator: row.creator || '',
      receivableNo: 'YS' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Math.floor(Math.random() * 1000)).padStart(3, '0')
    }
    
    await addReceivable({ receivable: receivableData })
    ElMessage.success('应收款已生成，可在应收管理中查看')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row: SalesOrder) => {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteSalesOrder(row.soID!)
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
    quantity: 1,
    unitPrice: 0,
    amount: 0
  })
}

const removeDetail = (index: number) => {
  details.value.splice(index, 1)
}

const handleProductChange = (index: number) => {
  const product = productList.value.find(p => p.productID === details.value[index].productID)
  if (product) {
    details.value[index].unitPrice = product.price
    calculateAmount(index)
  }
}

const calculateAmount = (index: number) => {
  const detail = details.value[index]
  detail.amount = detail.quantity * detail.unitPrice
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  
  if (!validateDetails()) {
    return
  }
  
  try {
    const customer = customerList.value.find(c => c.customerID === formData.customerID)
    if (customer) {
      formData.customerName = customer.customerName
    }
    
    const requestData = {
      order: formData,
      details: details.value.filter(d => d.productID > 0)
    }
    
    if (isEdit.value) {
      await updateSalesOrder(requestData as any)
      ElMessage.success('更新成功')
    } else {
      await addSalesOrder(requestData as any)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    soID: undefined,
    orderNo: '',
    customerID: 0,
    customerName: '',
    orderDate: '',
    deliveryDate: '',
    totalAmount: 0,
    status: 'pending',
    creator: ''
  })
  details.value = []
}

onMounted(() => {
  fetchData()
  fetchCustomers()
  fetchProducts()
  
  if (route.query.fromQuotation === 'true' && route.query.quotationId) {
    handleConvertFromQuotation(Number(route.query.quotationId))
  }
})

const handleConvertFromQuotation = async (quotationId: number) => {
  try {
    const quotationRes = await getQuotation(quotationId)
    const quotation = quotationRes.data
    
    formData.customerID = quotation.customerID
    formData.customerName = quotation.customerName || ''
    formData.orderDate = new Date().toISOString().split('T')[0]
    formData.deliveryDate = ''
    
    const detailsRes = await getQuotationDetails(quotationId)
    details.value = detailsRes.data.map(detail => ({
      productID: detail.productID,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      amount: detail.amount,
      productName: productList.value.find(p => p.productID === detail.productID)?.productName || '',
      unit: productList.value.find(p => p.productID === detail.productID)?.unit || ''
    }))
    
    isEdit.value = false
    dialogTitle.value = '从报价单创建销售订单'
    dialogVisible.value = true
    
    ElMessage.success('已从报价单带入数据，请确认并填写交货日期')
  } catch (error) {
    console.error('获取报价单详情失败', error)
    ElMessage.error('获取报价单详情失败')
  }
}
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
</style>
