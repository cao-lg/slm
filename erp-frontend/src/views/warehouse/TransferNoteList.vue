<template>
  <div class="transfer-note-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>调拨单管理</span>
          <el-button type="primary" @click="handleAdd">新增调拨</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="调拨单号">
          <el-input v-model="searchForm.transferNo" placeholder="请输入调拨单号" clearable />
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
        <el-table-column prop="transferNo" label="调拨单号" width="180" />
        <el-table-column prop="fromWarehouseName" label="源仓库" width="150" />
        <el-table-column prop="toWarehouseName" label="目标仓库" width="150" />
        <el-table-column prop="transferDate" label="调拨日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="制单人" width="100" />
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
            <el-form-item label="源仓库" prop="fromWarehouseID">
              <el-select v-model="formData.fromWarehouseID" placeholder="请选择源仓库" style="width: 100%" @change="handleWarehouseChange">
                <el-option
                  v-for="warehouse in warehouseList"
                  :key="warehouse.warehouseID"
                  :label="`${warehouse.warehouseName} (${warehouse.warehouseCode})`"
                  :value="warehouse.warehouseID!"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标仓库" prop="toWarehouseID">
              <el-select v-model="formData.toWarehouseID" placeholder="请选择目标仓库" style="width: 100%">
                <el-option
                  v-for="warehouse in warehouseList"
                  :key="warehouse.warehouseID"
                  :label="`${warehouse.warehouseName} (${warehouse.warehouseCode})`"
                  :value="warehouse.warehouseID!"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="调拨日期" prop="transferDate">
              <el-date-picker v-model="formData.transferDate" type="date" placeholder="选择日期" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" />
        </el-form-item>

        <el-divider>调拨明细</el-divider>

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
            <el-table-column prop="productName" label="产品名称" width="120" />
            <el-table-column prop="unit" label="单位" width="60" />
            <el-table-column label="源仓库存" width="100">
              <template #default="{ row, $index }">
                {{ getAvailableQuantity($index) }}
              </template>
            </el-table-column>
            <el-table-column label="调拨数量" width="120">
              <template #default="{ row, $index }">
                <el-input-number v-model="row.quantity" :min="0" :max="getAvailableQuantity($index)" :precision="2" size="small" />
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

    <el-dialog v-model="viewDialogVisible" title="调拨单详情" width="900px">
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="调拨单号">{{ currentRow.transferNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow.status)">{{ getStatusText(currentRow.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="源仓库">{{ currentRow.fromWarehouseName }}</el-descriptions-item>
        <el-descriptions-item label="目标仓库">{{ currentRow.toWarehouseName }}</el-descriptions-item>
        <el-descriptions-item label="调拨日期">{{ currentRow.transferDate }}</el-descriptions-item>
        <el-descriptions-item label="制单人">{{ currentRow.creator }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentRow.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>调拨明细</el-divider>

      <el-table :data="viewDetails" border size="small">
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="quantity" label="数量" width="120" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTransferNoteList,
  getTransferNoteDetails,
  addTransferNote,
  deleteTransferNote,
  approveTransferNote,
  getWarehouseList,
  getWarehouseInventory,
  getTransferInventory,
  type TransferNote,
  type TransferNoteDetail,
  type Warehouse,
  type PageParams,
  type InventoryVO
} from '@/api/warehouse'
import { getProductList } from '@/api/product'

const loading = ref(false)
const tableData = ref<TransferNote[]>([])
const warehouseList = ref<Warehouse[]>([])
const productList = ref<any[]>([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentRow = ref<TransferNote | null>(null)
const viewDetails = ref<TransferNoteDetail[]>([])

const searchForm = reactive({
  transferNo: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<TransferNote>({
  transferID: undefined,
  transferNo: '',
  fromWarehouseID: 0,
  fromWarehouseName: '',
  toWarehouseID: 0,
  toWarehouseName: '',
  transferDate: '',
  status: 'pending',
  creator: '',
  remark: ''
})

const details = ref<TransferNoteDetail[]>([])

const inventoryMap = ref<Record<string, number>>({})

const formRules = {
  fromWarehouseID: [{ required: true, message: '请选择源仓库', trigger: 'change' }],
  toWarehouseID: [{ required: true, message: '请选择目标仓库', trigger: 'change' }],
  transferDate: [{ required: true, message: '请选择调拨日期', trigger: 'change' }]
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
    const res = await getTransferNoteList(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
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
  searchForm.transferNo = ''
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
  dialogTitle.value = '新增调拨单'
  details.value = []
  addDetail()
  dialogVisible.value = true
}

const handleView = async (row: TransferNote) => {
  currentRow.value = row
  try {
    const res = await getTransferNoteDetails(row.transferID!)
    viewDetails.value = res.data
  } catch (error) {
    console.error('获取详情失败', error)
  }
  viewDialogVisible.value = true
}

const handleApprove = async (row: TransferNote) => {
  try {
    await ElMessageBox.confirm(
      `确定要审核通过调拨单 ${row.transferNo} 吗？\n\n审核通过后：\n1. ${row.fromWarehouseName} 库存将减少\n2. ${row.toWarehouseName} 库存将增加\n3. 调拨单状态将变为"已完成"`,
      '审核调拨单',
      {
        confirmButtonText: '确定审核',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await approveTransferNote(row.transferID!)
    ElMessage.success('调拨单审核成功，库存已更新')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核失败')
    }
  }
}

const handleDelete = async (row: TransferNote) => {
  try {
    await ElMessageBox.confirm('确定要删除该调拨单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteTransferNote(row.transferID!)
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
    quantity: 1
  })
}

const removeDetail = (index: number) => {
  details.value.splice(index, 1)
}

const handleProductChange = async (index: number) => {
  const product = productList.value.find(p => p.productID === details.value[index].productID)
  if (product) {
    details.value[index].productName = product.productName
    details.value[index].unit = product.unit
    
    if (formData.fromWarehouseID > 0) {
      try {
        const key = `${formData.fromWarehouseID}-${product.productID}`
        if (!inventoryMap.value[key]) {
          const res = await getWarehouseInventory(formData.fromWarehouseID, { page: 1, pageSize: 1000 })
          const inventory = res.data.list.find((inv: InventoryVO) => inv.productID === product.productID)
          if (inventory) {
            inventoryMap.value[key] = inventory.quantity
          } else {
            inventoryMap.value[key] = 0
          }
        }
        details.value[index].availableQuantity = inventoryMap.value[key]
      } catch (error) {
        console.error('获取库存失败', error)
        details.value[index].availableQuantity = 0
      }
    }
  }
}

const handleWarehouseChange = async () => {
  inventoryMap.value = {}
  for (let i = 0; i < details.value.length; i++) {
    if (details.value[i].productID > 0) {
      await handleProductChange(i)
    }
  }
}

const getAvailableQuantity = (index: number) => {
  const detail = details.value[index]
  if (detail.productID && formData.fromWarehouseID) {
    const key = `${formData.fromWarehouseID}-${detail.productID}`
    return inventoryMap.value[key] || 0
  }
  return 0
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  
  if (formData.fromWarehouseID === formData.toWarehouseID) {
    ElMessage.error('源仓库和目标仓库不能相同')
    return
  }
  
  const validDetails = details.value.filter(d => d.productID > 0 && d.quantity > 0)
  if (validDetails.length === 0) {
    ElMessage.error('请至少添加一条调拨明细')
    return
  }
  
  for (const detail of validDetails) {
    const key = `${formData.fromWarehouseID}-${detail.productID}`
    const availableQuantity = inventoryMap.value[key] || 0
    if (detail.quantity > availableQuantity) {
      ElMessage.error(`产品"${detail.productName}"的调拨数量不能超过源仓库库存（${availableQuantity}）`)
      return
    }
  }
  
  try {
    const fromWarehouse = warehouseList.value.find(w => w.warehouseID === formData.fromWarehouseID)
    const toWarehouse = warehouseList.value.find(w => w.warehouseID === formData.toWarehouseID)
    if (fromWarehouse) formData.fromWarehouseName = fromWarehouse.warehouseName
    if (toWarehouse) formData.toWarehouseName = toWarehouse.warehouseName

    const requestData = {
      note: formData,
      details: validDetails
    }

    await addTransferNote(requestData as any)
    ElMessage.success('调拨单创建成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    transferID: undefined,
    transferNo: '',
    fromWarehouseID: 0,
    fromWarehouseName: '',
    toWarehouseID: 0,
    toWarehouseName: '',
    transferDate: '',
    status: 'pending',
    creator: '',
    remark: ''
  })
  details.value = []
}

onMounted(() => {
  fetchData()
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
