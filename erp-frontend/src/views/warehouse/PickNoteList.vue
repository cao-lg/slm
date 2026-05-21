<template>
  <div class="pick-note-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>领料单管理</span>
          <el-button type="primary" @click="handleAdd">新增领料</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="领料单号">
          <el-input v-model="searchForm.pickNo" placeholder="请输入领料单号" clearable />
        </el-form-item>
        <el-form-item label="计划单号">
          <el-input v-model="searchForm.planNo" placeholder="请输入计划单号" clearable />
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
        <el-table-column prop="pickNo" label="领料单号" width="180" />
        <el-table-column prop="planNo" label="关联计划" width="180" />
        <el-table-column prop="warehouseName" label="领料仓库" width="150" />
        <el-table-column prop="pickDate" label="领料日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="picker" label="领料人" width="100" />
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
            <el-form-item label="生产计划" prop="productionPlanID">
              <el-select v-model="formData.productionPlanID" placeholder="请选择生产计划" filterable style="width: 100%" @change="handleProductionPlanChange">
                <el-option
                  v-for="plan in productionPlanList"
                  :key="plan.productionPlanID"
                  :label="plan.planNo + ' - ' + plan.productName + ' (' + plan.status + ')'"
                  :value="plan.productionPlanID!"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料仓库" prop="warehouseID">
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
            <el-form-item label="领料日期" prop="pickDate">
              <el-date-picker v-model="formData.pickDate" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领料人">
              <el-input v-model="formData.picker" placeholder="请输入领料人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" />
        </el-form-item>

        <el-divider>领料明细 <span style="font-size: 12px; color: #999;">（选择生产计划后自动带入配方材料）</span></el-divider>

        <div class="detail-table">
          <el-table :data="details" border size="small">
            <el-table-column prop="materialCode" label="材料编码" width="120" />
            <el-table-column prop="materialName" label="材料名称" width="150" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column prop="recipeQuantity" label="配方用量" width="100" />
            <el-table-column prop="pickedQuantity" label="已领数量" width="100" />
            <el-table-column prop="remainingQuantity" label="剩余数量" width="100">
              <template #default="{ row }">
                <span :style="{ color: row.remainingQuantity > 0 ? 'green' : 'red' }">
                  {{ row.remainingQuantity }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="本次领料" width="120">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.currentQuantity"
                  :min="0"
                  :max="row.remainingQuantity"
                  :precision="2"
                  size="small"
                  @change="validatePickQuantity(row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="viewDialogVisible" title="领料单详情" width="900px">
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="领料单号">{{ currentRow.pickNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="关联计划">{{ currentRow.planNo }}</el-descriptions-item>
        <el-descriptions-item label="领料仓库">{{ currentRow.warehouseName }}</el-descriptions-item>
        <el-descriptions-item label="领料日期">{{ currentRow.pickDate }}</el-descriptions-item>
        <el-descriptions-item label="领料人">{{ currentRow.picker }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>领料明细</el-divider>

      <el-table :data="viewDetails" border size="small">
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="quantity" label="数量" width="120" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPickNoteList,
  getPickNoteDetails,
  addPickNote,
  deletePickNote,
  approvePickNote,
  getProductionPlansForPick,
  getWarehouseList,
  getRecipeMaterialsByPlan,
  getPickQuantitiesByPlan,
  pickInventoryOut,
  getPickNote,
  type PickNote,
  type PickNoteDetail,
  type ProductionPlan,
  type Warehouse,
  type RecipeMaterial,
  type PickQuantityInfo,
  type PageParams,
  type PickInventoryOutRequest
} from '@/api/warehouse'
import { getProductList } from '@/api/product'

const loading = ref(false)
const tableData = ref<PickNote[]>([])
const productionPlanList = ref<ProductionPlan[]>([])
const warehouseList = ref<Warehouse[]>([])
const productList = ref<any[]>([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<PickNote | null>(null)
const viewDetails = ref<PickNoteDetail[]>([])

const searchForm = reactive({
  pickNo: '',
  planNo: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<PickNote>({
  pickID: undefined,
  pickNo: '',
  productionPlanID: undefined,
  planNo: '',
  warehouseID: undefined,
  warehouseName: '',
  pickDate: '',
  status: 'pending',
  picker: '',
  remark: ''
})

interface PickMaterialDetail {
  materialID: number
  materialCode: string
  materialName: string
  unit: string
  recipeQuantity: number
  pickedQuantity: number
  currentQuantity: number
  remainingQuantity: number
}

const details = ref<PickMaterialDetail[]>([])

const formRules = {
  productionPlanID: [{ required: true, message: '请选择生产计划', trigger: 'change' }],
  warehouseID: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  pickDate: [{ required: true, message: '请选择领料日期', trigger: 'change' }]
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
    const res = await getPickNoteList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const fetchProductionPlans = async () => {
  try {
    const res = await getProductionPlansForPick()
    productionPlanList.value = res.data
  } catch (error) {
    console.error('获取生产计划列表失败', error)
  }
}

const fetchWarehouses = async () => {
  try {
    const res = await getWarehouseList()
    warehouseList.value = res.data
  } catch (error) {
    console.error('获取仓库列表失败', error)
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
  searchForm.pickNo = ''
  searchForm.planNo = ''
  searchForm.status = ''
  handleSearch()
}

const handleProductionPlanChange = async (planID: number) => {
  if (!planID) {
    details.value = []
    return
  }

  try {
    const plan = productionPlanList.value.find(p => p.productionPlanID === planID)
    if (plan) {
      formData.planNo = plan.planNo
    }

    const [materialsRes, quantitiesRes] = await Promise.all([
      getRecipeMaterialsByPlan(planID),
      getPickQuantitiesByPlan(planID)
    ])

    const materials = materialsRes.data || []
    const quantities = quantitiesRes.data || []

    details.value = materials.map((material: RecipeMaterial) => {
      const quantityInfo = quantities.find((q: PickQuantityInfo) => q.materialID === material.materialID)
      const picked = quantityInfo?.totalPicked || 0
      const required = quantityInfo?.remainingQuantity || material.recipeQuantity

      return {
        materialID: material.materialID,
        materialCode: material.materialCode || '',
        materialName: material.materialName,
        unit: material.unit,
        recipeQuantity: material.recipeQuantity,
        pickedQuantity: picked,
        currentQuantity: required,
        remainingQuantity: required
      }
    })
  } catch (error) {
    ElMessage.error('获取配方材料失败')
    console.error('获取配方材料失败', error)
  }
}

const validatePickQuantity = (row: PickMaterialDetail) => {
  if (row.currentQuantity > row.remainingQuantity) {
    ElMessage.warning(`领料数量不能超过剩余数量(${row.remainingQuantity})`)
    row.currentQuantity = row.remainingQuantity
  }
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
  dialogTitle.value = '新增领料单'
  details.value = []
  Object.assign(formData, {
    pickID: undefined,
    pickNo: '',
    productionPlanID: undefined,
    planNo: '',
    warehouseID: 3,
    warehouseName: '',
    pickDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    picker: '',
    remark: ''
  })
  dialogVisible.value = true
}

const handleView = async (row: PickNote) => {
  currentRow.value = row
  try {
    const res = await getPickNoteDetails(row.pickID!)
    viewDetails.value = res.data
  } catch (error) {
    console.error('获取详情失败', error)
  }
  viewDialogVisible.value = true
}

const handleApprove = async (row: PickNote) => {
  try {
    await ElMessageBox.confirm('确定要审核通过该领料单吗？审核通过后将自动扣减材料仓库存。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const pickRes = await getPickNote(row.pickID!)
    const detailsRes = await getPickNoteDetails(row.pickID!)

    const materials = detailsRes.data.map((detail: PickNoteDetail) => ({
      materialID: detail.materialID,
      materialName: detail.materialName || '',
      quantity: detail.quantity
    }))

    const inventoryData: PickInventoryOutRequest = {
      warehouseID: pickRes.data.warehouseID || 3,
      materials
    }

    await pickInventoryOut(inventoryData)
    await approvePickNote(row.pickID!)

    ElMessage.success('审核成功，库存已更新')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核失败')
    }
  }
}

const handleDelete = async (row: PickNote) => {
  try {
    await ElMessageBox.confirm('确定要删除该领料单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deletePickNote(row.pickID!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const removeDetail = (index: number) => {
  details.value.splice(index, 1)
}

const handleProductChange = (index: number) => {
  const product = productList.value.find(p => p.productID === details.value[index].productID)
  if (product) {
    details.value[index].materialName = product.productName
    details.value[index].unit = product.unit
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()

  const hasValidDetail = details.value.some(d => d.currentQuantity > 0)
  if (!hasValidDetail) {
    ElMessage.warning('请至少填写一项领料数量')
    return
  }

  for (const detail of details.value) {
    if (detail.currentQuantity > detail.remainingQuantity) {
      ElMessage.warning(`材料"${detail.materialName}"的领料数量不能超过剩余数量(${detail.remainingQuantity})`)
      return
    }
  }

  try {
    const warehouse = warehouseList.value.find(w => w.warehouseID === formData.warehouseID)
    if (warehouse) formData.warehouseName = warehouse.warehouseName

    const validDetails = details.value
      .filter(d => d.currentQuantity > 0)
      .map(d => ({
        materialID: d.materialID,
        materialName: d.materialName,
        unit: d.unit,
        quantity: d.currentQuantity
      }))

    const requestData = {
      note: formData,
      details: validDetails
    }

    await addPickNote(requestData as any)
    ElMessage.success('添加成功，领料单已提交等待审核')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  details.value = []
}

onMounted(() => {
  fetchData()
  fetchProductionPlans()
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
</style>
