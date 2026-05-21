<template>
  <div class="expense-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>报销管理</span>
          <el-button type="primary" @click="handleAdd">新增报销</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="报销单号">
          <el-input v-model="searchForm.expenseNo" placeholder="请输入报销单号" clearable />
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="searchForm.applicantName" placeholder="请输入申请人" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待审批" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="expenseNo" label="报销单号" width="180" />
        <el-table-column prop="applicantName" label="申请人" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="category" label="报销类别" width="120" />
        <el-table-column prop="amount" label="报销金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="报销说明" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approverName" label="审批人" width="120" />
        <el-table-column prop="approveDate" label="审批日期" width="120" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button link type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending' && isApprover">审批</el-button>
            <el-button link type="warning" size="small" @click="handleReject(row)" v-if="row.status === 'pending' && isApprover">驳回</el-button>
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
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="申请人" prop="applicantName">
          <el-input v-model="formData.applicantName" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="formData.department" placeholder="请选择部门" style="width: 100%">
            <el-option label="销售部" value="销售部" />
            <el-option label="市场部" value="市场部" />
            <el-option label="研发部" value="研发部" />
            <el-option label="财务部" value="财务部" />
            <el-option label="人力资源部" value="人力资源部" />
            <el-option label="行政部" value="行政部" />
          </el-select>
        </el-form-item>
        <el-form-item label="报销类别" prop="category">
          <el-select v-model="formData.category" placeholder="请选择报销类别" style="width: 100%">
            <el-option label="差旅费" value="差旅费" />
            <el-option label="交通费" value="交通费" />
            <el-option label="餐饮费" value="餐饮费" />
            <el-option label="办公费" value="办公费" />
            <el-option label="通讯费" value="通讯费" />
            <el-option label="招待费" value="招待费" />
            <el-option label="培训费" value="培训费" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="报销金额" prop="amount">
          <el-input-number v-model="formData.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="报销说明" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入报销说明" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="approveDialogVisible"
      title="审批报销"
      width="500px"
    >
      <el-form :model="approveForm" label-width="100px">
        <el-form-item label="报销单号">
          <el-input v-model="approveForm.expenseNo" readonly />
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="approveForm.applicantName" readonly />
        </el-form-item>
        <el-form-item label="报销类别">
          <el-input v-model="approveForm.category" readonly />
        </el-form-item>
        <el-form-item label="报销金额">
          <el-input v-model="approveForm.amount" readonly>
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="审批备注">
          <el-input v-model="approveForm.remark" type="textarea" :rows="3" placeholder="请输入审批备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="success" @click="handleApproveSubmit">通过</el-button>
        <el-button type="danger" @click="handleRejectSubmit">驳回</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewDialogVisible"
      title="报销详情"
      width="700px"
    >
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="报销单号">{{ currentRow.expenseNo }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ currentRow.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentRow.department || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报销类别">{{ currentRow.category || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报销金额">¥{{ currentRow.amount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="报销说明" :span="2">{{ currentRow.description || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批人">{{ currentRow.approverName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批日期">{{ currentRow.approveDate || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审批备注" :span="2">{{ currentRow.approveRemark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentRow.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getExpenseList,
  addExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  type Expense,
  type PageParams
} from '@/api/finance'

const loading = ref(false)
const tableData = ref<Expense[]>([])
const dialogVisible = ref(false)
const approveDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<Expense | null>(null)
const isApprover = ref(true)
const currentUser = reactive({
  userID: 1,
  userName: '管理员',
  realName: 'Admin'
})

const searchForm = reactive({
  expenseNo: '',
  applicantName: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<Expense>({
  expenseID: undefined,
  expenseNo: '',
  applicantID: 0,
  applicantName: '',
  department: '',
  amount: 0,
  category: '',
  description: '',
  status: 'pending',
  remark: ''
})

const approveForm = reactive({
  expenseID: undefined as number | undefined,
  expenseNo: '',
  applicantName: '',
  category: '',
  amount: 0,
  remark: ''
})

const formRules = {
  applicantName: [{ required: true, message: '请输入申请人姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  category: [{ required: true, message: '请选择报销类别', trigger: 'change' }],
  amount: [{ required: true, message: '请输入报销金额', trigger: 'blur' }],
  description: [{ required: true, message: '请输入报销说明', trigger: 'blur' }]
}

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已驳回'
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
    const res = await getExpenseList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.expenseNo = ''
  searchForm.applicantName = ''
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
  dialogTitle.value = '新增报销'
  formData.applicantID = currentUser.userID
  dialogVisible.value = true
}

const handleView = (row: Expense) => {
  currentRow.value = row
  viewDialogVisible.value = true
}

const handleApprove = (row: Expense) => {
  approveForm.expenseID = row.expenseID
  approveForm.expenseNo = row.expenseNo
  approveForm.applicantName = row.applicantName || ''
  approveForm.category = row.category || ''
  approveForm.amount = row.amount
  approveForm.remark = ''
  approveDialogVisible.value = true
}

const handleApproveSubmit = async () => {
  try {
    await approveExpense(approveForm.expenseID!, {
      approverID: currentUser.userID,
      approverName: currentUser.realName,
      remark: approveForm.remark
    })
    ElMessage.success('审批通过')
    approveDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('审批失败')
  }
}

const handleRejectSubmit = async () => {
  try {
    await rejectExpense(approveForm.expenseID!, {
      approverID: currentUser.userID,
      approverName: currentUser.realName,
      remark: approveForm.remark
    })
    ElMessage.success('已驳回')
    approveDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('驳回失败')
  }
}

const handleReject = async (row: Expense) => {
  try {
    await ElMessageBox.prompt('请输入驳回原因', '驳回报销', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入驳回原因'
    }).then(async ({ value }) => {
      try {
        await rejectExpense(row.expenseID!, {
          approverID: currentUser.userID,
          approverName: currentUser.realName,
          remark: value
        })
        ElMessage.success('已驳回')
        fetchData()
      } catch (error) {
        ElMessage.error('驳回失败')
      }
    })
  } catch (error) {
    console.log('取消驳回')
  }
}

const handleDelete = async (row: Expense) => {
  try {
    await ElMessageBox.confirm('确定要删除该报销记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteExpense(row.expenseID!)
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
    const requestData = { expense: formData }
    await addExpense(requestData as any)
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
    expenseID: undefined,
    expenseNo: '',
    applicantID: 0,
    applicantName: '',
    department: '',
    amount: 0,
    category: '',
    description: '',
    status: 'pending',
    remark: ''
  })
}

onMounted(() => {
  fetchData()
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
</style>
