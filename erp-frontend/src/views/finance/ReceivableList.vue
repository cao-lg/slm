<template>
  <div class="receivable-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>应收款管理</span>
          <el-button type="primary" @click="handleAdd">新增应收</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="应收单号">
          <el-input v-model="searchForm.receivableNo" placeholder="请输入应收单号" clearable />
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
            <el-option label="未付款" value="unpaid" />
            <el-option label="部分付款" value="partial" />
            <el-option label="已付清" value="paid" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="receivableNo" label="应收单号" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="200" />
        <el-table-column prop="salesOrderNo" label="销售订单" width="180" />
        <el-table-column prop="totalAmount" label="应收金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="receivedAmount" label="已收金额" width="120">
          <template #default="{ row }">
            ¥{{ row.receivedAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="pendingAmount" label="欠款" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.pendingAmount > 0 }">
              ¥{{ row.pendingAmount?.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="制单人" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="success" size="small" @click="handleVerify(row)" v-if="row.status !== 'paid'">收款核销</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)" v-if="row.status === 'unpaid'">删除</el-button>
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
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
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
        <el-form-item label="销售订单" prop="salesOrderID">
          <el-select v-model="formData.salesOrderID" placeholder="请选择销售订单" filterable style="width: 100%">
            <el-option
              v-for="order in salesOrderList"
              :key="order.soID"
              :label="order.orderNo"
              :value="order.soID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应收金额" prop="totalAmount">
          <el-input-number v-model="formData.totalAmount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="到期日期" prop="dueDate">
          <el-date-picker
            v-model="formData.dueDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="verifyDialogVisible"
      title="收款核销"
      width="500px"
    >
      <el-form
        ref="verifyFormRef"
        :model="verifyForm"
        :rules="verifyRules"
        label-width="100px"
      >
        <el-form-item label="应收单号">
          <el-input v-model="verifyForm.receivableNo" readonly />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="verifyForm.customerName" readonly />
        </el-form-item>
        <el-form-item label="应收金额">
          <el-input v-model="verifyForm.totalAmount" readonly>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="已收金额">
          <el-input v-model="verifyForm.receivedAmount" readonly>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="欠款">
          <el-input v-model="verifyForm.pendingAmount" readonly>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="本次收款" prop="amount">
          <el-input-number v-model="verifyForm.amount" :min="0" :max="verifyForm.pendingAmount" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="收款日期" prop="paymentDate">
          <el-date-picker
            v-model="verifyForm.paymentDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="收款方式" prop="paymentMethod">
          <el-select v-model="verifyForm.paymentMethod" placeholder="请选择收款方式" style="width: 100%">
            <el-option label="现金" value="cash" />
            <el-option label="转账" value="transfer" />
            <el-option label="票据" value="bill" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="verifyForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="verifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleVerifySubmit">确定核销</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewDialogVisible"
      title="应收款详情"
      width="700px"
    >
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="应收单号">{{ currentRow.receivableNo }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentRow.customerName }}</el-descriptions-item>
        <el-descriptions-item label="销售订单">{{ currentRow.salesOrderNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="到期日期">{{ currentRow.dueDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="应收金额">¥{{ currentRow.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="已收金额">¥{{ currentRow.receivedAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="欠款">¥{{ currentRow.pendingAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="制单人">{{ currentRow.creator || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getReceivableList,
  addReceivable,
  deleteReceivable,
  verifyReceivable,
  type Receivable,
  type PageParams
} from '@/api/finance'
import {
  getCustomerList,
  getSalesOrderList,
  type Customer,
  type SalesOrder
} from '@/api/sales'

const loading = ref(false)
const tableData = ref<Receivable[]>([])
const customerList = ref<Customer[]>([])
const salesOrderList = ref<SalesOrder[]>([])
const dialogVisible = ref(false)
const verifyDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const verifyFormRef = ref()
const currentRow = ref<Receivable | null>(null)

const searchForm = reactive({
  receivableNo: '',
  customerID: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<Receivable>({
  receivableID: undefined,
  receivableNo: '',
  customerID: 0,
  customerName: '',
  salesOrderID: undefined,
  totalAmount: 0,
  receivedAmount: 0,
  pendingAmount: 0,
  dueDate: '',
  status: 'unpaid',
  remark: '',
  creator: ''
})

const verifyForm = reactive({
  receivableID: undefined as number | undefined,
  receivableNo: '',
  customerName: '',
  totalAmount: 0,
  receivedAmount: 0,
  pendingAmount: 0,
  amount: 0,
  paymentDate: '',
  paymentMethod: 'transfer',
  remark: ''
})

const formRules = {
  customerID: [{ required: true, message: '请选择客户', trigger: 'change' }],
  totalAmount: [{ required: true, message: '请输入应收金额', trigger: 'blur' }]
}

const verifyRules = {
  amount: [
    { required: true, message: '请输入收款金额', trigger: 'blur' },
    { validator: (rule: any, value: any, callback: any) => {
      if (value <= 0) {
        callback(new Error('收款金额必须大于0'))
      } else if (value > verifyForm.pendingAmount) {
        callback(new Error('收款金额不能超过欠款金额'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    unpaid: 'warning',
    partial: 'info',
    paid: 'success'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    unpaid: '未付款',
    partial: '部分付款',
    paid: '已付清'
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
    const res = await getReceivableList(params)
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

const fetchSalesOrders = async () => {
  try {
    const res = await getSalesOrderList({ page: 1, pageSize: 1000 })
    salesOrderList.value = res.data.list
  } catch (error) {
    console.error('获取销售订单列表失败', error)
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.receivableNo = ''
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
  dialogTitle.value = '新增应收'
  dialogVisible.value = true
}

const handleView = (row: Receivable) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

const handleVerify = (row: Receivable) => {
  verifyForm.receivableID = row.receivableID
  verifyForm.receivableNo = row.receivableNo
  verifyForm.customerName = row.customerName || ''
  verifyForm.totalAmount = row.totalAmount
  verifyForm.receivedAmount = row.receivedAmount
  verifyForm.pendingAmount = row.pendingAmount
  verifyForm.amount = row.pendingAmount
  verifyForm.paymentDate = new Date().toISOString().split('T')[0]
  verifyForm.paymentMethod = 'transfer'
  verifyForm.remark = ''
  verifyDialogVisible.value = true
}

const handleVerifySubmit = async () => {
  await verifyFormRef.value?.validate()
  
  try {
    if (!verifyForm.paymentDate) {
      ElMessage.error('请选择收款日期')
      return
    }
    
    await verifyReceivable(
      verifyForm.receivableID!,
      verifyForm.amount,
      verifyForm.paymentDate,
      verifyForm.paymentMethod,
      verifyForm.remark
    )
    ElMessage.success('核销成功')
    verifyDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('核销失败')
  }
}

const handleDelete = async (row: Receivable) => {
  try {
    await ElMessageBox.confirm('确定要删除该应收记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteReceivable(row.receivableID!)
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
  try {
    const customer = customerList.value.find(c => c.customerID === formData.customerID)
    if (customer) {
      formData.customerName = customer.customerName
    }
    
    const requestData = { receivable: formData }
    
    await addReceivable(requestData as any)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    receivableID: undefined,
    receivableNo: '',
    customerID: 0,
    customerName: '',
    salesOrderID: undefined,
    totalAmount: 0,
    receivedAmount: 0,
    pendingAmount: 0,
    dueDate: '',
    status: 'unpaid',
    remark: '',
    creator: ''
  })
}

onMounted(() => {
  fetchData()
  fetchCustomers()
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

.text-danger {
  color: #f56c6c;
  font-weight: bold;
}
</style>
