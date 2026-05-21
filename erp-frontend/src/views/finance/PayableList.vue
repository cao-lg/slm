<template>
  <div class="payable-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>应付款管理</span>
          <el-button type="primary" @click="handleAdd">新增应付</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="应付单号">
          <el-input v-model="searchForm.payableNo" placeholder="请输入应付单号" clearable />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierID" placeholder="请选择供应商" clearable filterable style="width: 200px">
            <el-option
              v-for="supplier in supplierList"
              :key="supplier.supplierID"
              :label="supplier.supplierName"
              :value="supplier.supplierID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待付款" value="unpaid" />
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
        <el-table-column prop="payableNo" label="应付单号" width="180" />
        <el-table-column prop="supplierName" label="供应商名称" width="200" />
        <el-table-column prop="purchaseOrderNo" label="采购订单" width="180" />
        <el-table-column prop="totalAmount" label="应付金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="paidAmount" label="已付金额" width="120">
          <template #default="{ row }">
            ¥{{ row.paidAmount?.toFixed(2) }}
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
            <el-button link type="success" size="small" @click="handleVerify(row)" v-if="row.status !== 'paid'">付款核销</el-button>
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
        <el-form-item label="供应商" prop="supplierID">
          <el-select v-model="formData.supplierID" placeholder="请选择供应商" filterable style="width: 100%">
            <el-option
              v-for="supplier in supplierList"
              :key="supplier.supplierID"
              :label="supplier.supplierName"
              :value="supplier.supplierID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购订单" prop="purchaseOrderID">
          <el-select v-model="formData.purchaseOrderID" placeholder="请选择采购订单" filterable style="width: 100%" @change="handleOrderChange">
            <el-option
              v-for="order in purchaseOrderList"
              :key="order.poID"
              :label="order.poNo"
              :value="order.poID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应付金额" prop="totalAmount">
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
      title="付款核销"
      width="500px"
    >
      <el-form :model="verifyForm" label-width="100px">
        <el-form-item label="应付单号">
          <el-input v-model="verifyForm.payableNo" readonly />
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="verifyForm.supplierName" readonly />
        </el-form-item>
        <el-form-item label="应付金额">
          <el-input v-model="verifyForm.totalAmount" readonly>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="已付金额">
          <el-input v-model="verifyForm.paidAmount" readonly>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="欠款">
          <el-input v-model="verifyForm.pendingAmount" readonly>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="本次付款" prop="amount">
          <el-input-number v-model="verifyForm.amount" :min="0" :max="verifyForm.pendingAmount" :precision="2" style="width: 100%" />
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
      title="应付款详情"
      width="700px"
    >
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="应付单号">{{ currentRow.payableNo }}</el-descriptions-item>
        <el-descriptions-item label="供应商名称">{{ currentRow.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="采购订单">{{ currentRow.purchaseOrderNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="到期日期">{{ currentRow.dueDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="应付金额">¥{{ currentRow.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="已付金额">¥{{ currentRow.paidAmount?.toFixed(2) }}</el-descriptions-item>
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
  getPayableList,
  addPayable,
  deletePayable,
  verifyPayable,
  type Payable,
  type PageParams
} from '@/api/finance'
import {
  getSupplierList,
  getPurchaseOrderList,
  type Supplier,
  type PurchaseOrder
} from '@/api/purchase'

const loading = ref(false)
const tableData = ref<Payable[]>([])
const supplierList = ref<Supplier[]>([])
const purchaseOrderList = ref<PurchaseOrder[]>([])
const dialogVisible = ref(false)
const verifyDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<Payable | null>(null)

const searchForm = reactive({
  payableNo: '',
  supplierID: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<Payable>({
  payableID: undefined,
  payableNo: '',
  supplierID: 0,
  supplierName: '',
  purchaseOrderID: undefined,
  purchaseOrderNo: '',
  totalAmount: 0,
  paidAmount: 0,
  pendingAmount: 0,
  dueDate: '',
  status: 'unpaid',
  remark: '',
  creator: ''
})

const verifyForm = reactive({
  payableID: undefined as number | undefined,
  payableNo: '',
  supplierName: '',
  totalAmount: 0,
  paidAmount: 0,
  pendingAmount: 0,
  amount: 0,
  remark: ''
})

const formRules = {
  supplierID: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  totalAmount: [{ required: true, message: '请输入应付金额', trigger: 'blur' }]
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
    unpaid: '待付款',
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
    const res = await getPayableList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const fetchSuppliers = async () => {
  try {
    const res = await getSupplierList({ page: 1, pageSize: 1000 })
    supplierList.value = res.data.list
  } catch (error) {
    console.error('获取供应商列表失败', error)
  }
}

const fetchPurchaseOrders = async () => {
  try {
    const res = await getPurchaseOrderList({ page: 1, pageSize: 1000 })
    purchaseOrderList.value = res.data.list
  } catch (error) {
    console.error('获取采购订单列表失败', error)
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.payableNo = ''
  searchForm.supplierID = ''
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
  dialogTitle.value = '新增应付'
  dialogVisible.value = true
}

const handleView = (row: Payable) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

const handleVerify = (row: Payable) => {
  verifyForm.payableID = row.payableID
  verifyForm.payableNo = row.payableNo
  verifyForm.supplierName = row.supplierName || ''
  verifyForm.totalAmount = row.totalAmount
  verifyForm.paidAmount = row.paidAmount
  verifyForm.pendingAmount = row.pendingAmount
  verifyForm.amount = row.pendingAmount
  verifyForm.remark = ''
  verifyDialogVisible.value = true
}

const handleVerifySubmit = async () => {
  if (verifyForm.amount <= 0) {
    ElMessage.error('请输入付款金额')
    return
  }
  
  try {
    await verifyPayable(verifyForm.payableID!, verifyForm.amount, verifyForm.remark)
    ElMessage.success('核销成功')
    verifyDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('核销失败')
  }
}

const handleDelete = async (row: Payable) => {
  try {
    await ElMessageBox.confirm('确定要删除该应付记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deletePayable(row.payableID!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleOrderChange = (orderId: number) => {
  const order = purchaseOrderList.value.find(o => o.poID === orderId)
  if (order) {
    formData.totalAmount = order.totalAmount
    formData.pendingAmount = order.totalAmount
    formData.supplierID = order.supplierID
    formData.supplierName = order.supplierName
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  try {
    const supplier = supplierList.value.find(s => s.supplierID === formData.supplierID)
    if (supplier) {
      formData.supplierName = supplier.supplierName
    }

    const order = purchaseOrderList.value.find(o => o.poID === formData.purchaseOrderID)
    if (order) {
      formData.purchaseOrderNo = order.poNo
    }

    const requestData = { payable: formData }

    await addPayable(requestData as any)
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
    payableID: undefined,
    payableNo: '',
    supplierID: 0,
    supplierName: '',
    purchaseOrderID: undefined,
    purchaseOrderNo: '',
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    dueDate: '',
    status: 'unpaid',
    remark: '',
    creator: ''
  })
}

onMounted(() => {
  fetchData()
  fetchSuppliers()
  fetchPurchaseOrders()
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
