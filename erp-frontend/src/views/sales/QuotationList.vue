<template>
  <div class="quotation-list" data-testid="quotation-list-page">
    <el-card data-testid="quotation-list-card">
      <template #header>
        <div class="card-header">
          <span>报价单管理</span>
          <el-button type="primary" @click="handleAdd" data-testid="add-quotation-btn">新增报价单</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form" data-testid="quotation-search-form">
        <el-form-item label="报价单号">
          <el-input v-model="searchForm.quotationNo" placeholder="请输入报价单号" clearable data-testid="quotation-no-search-input" />
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="searchForm.customerID" placeholder="请选择客户" clearable filterable style="width: 200px" data-testid="quotation-customer-search-select">
            <el-option
              v-for="customer in customerList"
              :key="customer.customerID"
              :label="customer.customerName"
              :value="customer.customerID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px" data-testid="quotation-status-search-select">
            <el-option label="待确认" value="pending" />
            <el-option label="已接受" value="accepted" />
            <el-option label="已拒绝" value="rejected" />
            <el-option label="已转化" value="converted" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" data-testid="quotation-search-btn">搜索</el-button>
          <el-button @click="handleReset" data-testid="quotation-reset-btn">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading" data-testid="quotation-table">
        <el-table-column prop="quotationNo" label="报价单号" width="180" />
        <el-table-column prop="customerName" label="客户名称" width="200" />
        <el-table-column prop="quotationDate" label="报价日期" width="120" />
        <el-table-column prop="validUntil" label="有效期至" width="120" />
        <el-table-column prop="totalAmount" label="总金额" width="120">
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
            <el-button link type="primary" size="small" @click="handleView(row)" :data-testid="'view-quotation-btn-' + row.quotationID">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)" v-if="row.status === 'pending'" :data-testid="'edit-quotation-btn-' + row.quotationID">编辑</el-button>
            <el-button link type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'" :data-testid="'approve-quotation-btn-' + row.quotationID">接受</el-button>
            <el-button link type="warning" size="small" @click="handleReject(row)" v-if="row.status === 'pending'" :data-testid="'reject-quotation-btn-' + row.quotationID">拒绝</el-button>
            <el-button link type="primary" size="small" @click="handleConvertToOrder(row)" v-if="row.status === 'accepted'" :data-testid="'convert-quotation-btn-' + row.quotationID">转为订单</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)" v-if="row.status === 'pending'" :data-testid="'delete-quotation-btn-' + row.quotationID">删除</el-button>
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
        data-testid="quotation-pagination"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      @close="resetForm"
      data-testid="quotation-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        data-testid="quotation-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户" prop="customerID">
              <el-select v-model="formData.customerID" placeholder="请选择客户" filterable style="width: 100%" data-testid="quotation-customer-select">
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
            <el-form-item label="报价日期" prop="quotationDate">
              <el-date-picker
                v-model="formData.quotationDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                data-testid="quotation-date-picker"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="有效期至" prop="validUntil">
              <el-date-picker
                v-model="formData.validUntil"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                data-testid="quotation-valid-until-picker"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总金额">
              <el-input v-model="formData.totalAmount" readonly data-testid="quotation-total-input">
                <template #prefix>¥</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>产品明细</el-divider>

        <div class="detail-table" data-testid="quotation-detail-table">
          <el-table :data="details" border size="small">
            <el-table-column label="产品" width="200">
              <template #default="{ row, $index }">
                <el-select v-model="row.productID" placeholder="选择产品" filterable @change="handleProductChange($index)" :data-testid="'quotation-product-select-' + $index">
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
                <el-input-number v-model="row.quantity" :min="0" :precision="2" size="small" @change="calculateAmount($index)" :data-testid="'quotation-quantity-input-' + $index" />
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template #default="{ row, $index }">
                <el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" @change="calculateAmount($index)" :data-testid="'quotation-unit-price-input-' + $index" />
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                ¥{{ row.amount?.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeDetail($index)" :data-testid="'quotation-remove-detail-btn-' + $index">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="addDetail" class="add-detail-btn" data-testid="quotation-add-detail-btn">添加产品</el-button>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" data-testid="quotation-dialog-cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleSubmit" data-testid="quotation-dialog-submit-btn">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewDialogVisible"
      title="报价单详情"
      width="900px"
      data-testid="quotation-view-dialog"
    >
      <el-descriptions :column="2" border v-if="currentRow" data-testid="quotation-view-descriptions">
        <el-descriptions-item label="报价单号">{{ currentRow.quotationNo }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentRow.customerName }}</el-descriptions-item>
        <el-descriptions-item label="报价日期">{{ currentRow.quotationDate }}</el-descriptions-item>
        <el-descriptions-item label="有效期至">{{ currentRow.validUntil }}</el-descriptions-item>
        <el-descriptions-item label="总金额">¥{{ currentRow.totalAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="制单人">{{ currentRow.creator }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>产品明细</el-divider>

      <el-table :data="viewDetails" border size="small" data-testid="quotation-view-details">
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getQuotationList,
  getQuotationDetails,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
  convertQuotationToOrder,
  getCustomerList,
  type Quotation,
  type QuotationDetail,
  type Customer,
  type PageParams
} from '@/api/sales'
import { getProductList } from '@/api/product'

const router = useRouter()
const loading = ref(false)
const tableData = ref<Quotation[]>([])
const customerList = ref<Customer[]>([])
const productList = ref<any[]>([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<Quotation | null>(null)
const viewDetails = ref<QuotationDetail[]>([])

const searchForm = reactive({
  quotationNo: '',
  customerID: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<Quotation>({
  quotationID: undefined,
  quotationNo: '',
  customerID: 0,
  customerName: '',
  quotationDate: '',
  validUntil: '',
  totalAmount: 0,
  status: 'pending',
  creator: ''
})

const details = ref<QuotationDetail[]>([])

const formRules = {
  customerID: [{ required: true, message: '请选择客户', trigger: 'change' }],
  quotationDate: [{ required: true, message: '请选择报价日期', trigger: 'change' }],
  validUntil: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
    converted: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待确认',
    accepted: '已接受',
    rejected: '已拒绝',
    converted: '已转化'
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
    const res = await getQuotationList(params)
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
  searchForm.quotationNo = ''
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
  dialogTitle.value = '新增报价单'
  details.value = []
  addDetail()
  dialogVisible.value = true
}

const handleEdit = async (row: Quotation) => {
  isEdit.value = true
  dialogTitle.value = '编辑报价单'
  Object.assign(formData, row)
  try {
    const res = await getQuotationDetails(row.quotationID!)
    details.value = res.data
  } catch (error) {
    console.error('获取详情失败', error)
  }
  dialogVisible.value = true
}

const handleView = (row: Quotation) => {
  router.push(`/sales/quotation/${row.quotationID}`)
}

const handleApprove = async (row: Quotation) => {
  try {
    await ElMessageBox.confirm('确定要接受该报价吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateQuotationStatus(row.quotationID!, 'accepted')
    ElMessage.success('报价已接受')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleReject = async (row: Quotation) => {
  try {
    await ElMessageBox.confirm('确定要拒绝该报价吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateQuotationStatus(row.quotationID!, 'rejected')
    ElMessage.success('已拒绝')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleConvertToOrder = async (row: Quotation) => {
  try {
    await ElMessageBox.confirm('确定要将该报价单转为销售订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    const res = await convertQuotationToOrder(row.quotationID!)
    ElMessage.success('已成功转为销售订单')
    
    router.push({
      path: '/sales/order',
      query: { 
        fromQuotation: 'true',
        quotationId: row.quotationID!.toString()
      }
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('转换失败')
    }
  }
}

const handleDelete = async (row: Quotation) => {
  try {
    await ElMessageBox.confirm('确定要删除该报价单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteQuotation(row.quotationID!)
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
  try {
    const customer = customerList.value.find(c => c.customerID === formData.customerID)
    if (customer) {
      formData.customerName = customer.customerName
    }
    
    const requestData = {
      quotation: formData,
      details: details.value.filter(d => d.productID > 0)
    }
    
    if (isEdit.value) {
      await updateQuotation(requestData as any)
      ElMessage.success('更新成功')
    } else {
      await addQuotation(requestData as any)
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
    quotationID: undefined,
    quotationNo: '',
    customerID: 0,
    customerName: '',
    quotationDate: '',
    validUntil: '',
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
</style>
