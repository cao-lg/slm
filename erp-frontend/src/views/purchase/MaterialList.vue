<template>
  <div class="material-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>原材料管理</span>
          <el-button type="primary" @click="handleAdd">新增原材料</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="原材料名称">
          <el-input v-model="searchForm.materialName" placeholder="请输入原材料名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="materialCode" label="原材料编码" width="180" />
        <el-table-column prop="materialName" label="原材料名称" width="200" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="stockQuantity" label="库存数量" width="120" align="right" />
        <el-table-column prop="unitPrice" label="单价" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.unitPrice?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
      width="800px"
      @close="resetForm"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
          >
            <el-form-item label="原材料编码" v-if="!isEdit">
              <el-input v-model="formData.materialCode" placeholder="请输入原材料编码" />
            </el-form-item>
            <el-form-item label="原材料编码" v-else>
              <el-input v-model="formData.materialCode" disabled />
            </el-form-item>
            <el-form-item label="原材料名称" prop="materialName">
              <el-input v-model="formData.materialName" placeholder="请输入原材料名称" />
            </el-form-item>
            <el-form-item label="规格" prop="spec">
              <el-input v-model="formData.spec" placeholder="请输入规格" />
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input v-model="formData.unit" placeholder="请输入单位" />
            </el-form-item>
            <el-form-item label="类别" prop="category">
              <el-input v-model="formData.category" placeholder="请输入类别" />
            </el-form-item>
            <el-form-item label="库存数量" prop="stockQuantity">
              <el-input-number v-model="formData.stockQuantity" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
            <el-form-item label="单价" prop="unitPrice">
              <el-input-number v-model="formData.unitPrice" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="供应商关联" name="suppliers">
          <div class="supplier-section">
            <div class="supplier-header">
              <span>供应商关联（点击添加按钮即时生效）</span>
              <el-button type="primary" size="small" @click="handleAddSupplier">+ 添加供应商关联</el-button>
            </div>
            
            <el-table :data="supplierList" border style="width: 100%" v-if="supplierList.length > 0">
              <el-table-column label="序号" type="index" width="60" />
              <el-table-column label="供应商" width="200">
                <template #default="{ row }">
                  <el-select v-model="row.supplierID" placeholder="请选择供应商" @change="handleSupplierChange(row)">
                    <el-option
                      v-for="supplier in supplierOptions"
                      :key="supplier.supplierID"
                      :label="`${supplier.supplierCode}（${supplier.supplierName}）`"
                      :value="supplier.supplierID"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="供应商产品代码" width="150">
                <template #default="{ row }">
                  <el-input v-model="row.supplierProductCode" placeholder="供应商产品代码" />
                </template>
              </el-table-column>
              <el-table-column label="供应商产品名称" width="150">
                <template #default="{ row }">
                  <el-input v-model="row.supplierProductName" placeholder="供应商产品名称" />
                </template>
              </el-table-column>
              <el-table-column label="采购价" width="120">
                <template #default="{ row }">
                  <el-input-number v-model="row.purchasePrice" :min="0" :precision="2" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button link type="danger" size="small" @click="handleDeleteSupplier(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div v-else class="empty-supplier">
              <el-empty description="暂无供应商关联，点击上方按钮添加" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="supplierDialogVisible"
      title="添加供应商关联"
      width="500px"
    >
      <el-form
        ref="supplierFormRef"
        :model="newSupplier"
        :rules="supplierRules"
        label-width="100px"
      >
        <el-form-item label="供应商" prop="supplierID">
          <el-select v-model="newSupplier.supplierID" placeholder="请选择供应商">
            <el-option
              v-for="supplier in supplierOptions"
              :key="supplier.supplierID"
              :label="`${supplier.supplierCode}（${supplier.supplierName}）`"
              :value="supplier.supplierID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商产品代码">
          <el-input v-model="newSupplier.supplierProductCode" placeholder="供应商产品代码" />
        </el-form-item>
        <el-form-item label="供应商产品名称">
          <el-input v-model="newSupplier.supplierProductName" placeholder="供应商产品名称" />
        </el-form-item>
        <el-form-item label="采购价" prop="purchasePrice">
          <el-input-number v-model="newSupplier.purchasePrice" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="supplierDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSupplier">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMaterialList,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialSuppliers,
  addMaterialSupplier,
  updateMaterialSupplier,
  deleteMaterialSupplier,
  getSupplierList,
  type Material,
  type MaterialSupplier,
  type Supplier,
  type PageParams,
  type PageResult
} from '@/api/purchase'

const loading = ref(false)
const tableData = ref<Material[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const supplierFormRef = ref()
const activeTab = ref('basic')
const supplierDialogVisible = ref(false)
const supplierOptions = ref<Supplier[]>([])
const supplierList = ref<MaterialSupplier[]>([])

const searchForm = reactive({
  materialName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<Material>({
  materialCode: '',
  materialName: '',
  spec: '',
  unit: '',
  category: '',
  stockQuantity: 0,
  unitPrice: 0,
  status: 1
})

const newSupplier = reactive<MaterialSupplier>({
  materialID: 0,
  supplierID: 0,
  supplierProductCode: '',
  supplierProductName: '',
  purchasePrice: 0,
  status: 1
})

const formRules = {
  materialName: [{ required: true, message: '请输入原材料名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }]
}

const supplierRules = {
  supplierID: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  purchasePrice: [{ required: true, message: '请输入采购价', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    const res = await getMaterialList(params)
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
    const res = await getSupplierList({ page: 1, pageSize: 100 })
    supplierOptions.value = res.data.list
  } catch (error) {
    ElMessage.error('获取供应商列表失败')
  }
}

const fetchMaterialSuppliers = async (materialId: number) => {
  try {
    const res = await getMaterialSuppliers(materialId)
    supplierList.value = res.data.map(item => ({
      ...item,
      supplierCode: '',
      supplierName: ''
    }))
    await updateSupplierNames()
  } catch (error) {
    supplierList.value = []
  }
}

const updateSupplierNames = async () => {
  supplierList.value.forEach(item => {
    const supplier = supplierOptions.value.find(s => s.supplierID === item.supplierID)
    if (supplier) {
      item.supplierCode = supplier.supplierCode
      item.supplierName = supplier.supplierName
    }
  })
}

const handleSupplierChange = async (row: MaterialSupplier) => {
  const supplier = supplierOptions.value.find(s => s.supplierID === row.supplierID)
  if (supplier) {
    row.supplierCode = supplier.supplierCode
    row.supplierName = supplier.supplierName
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.materialName = ''
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
  dialogTitle.value = '新增原材料'
  activeTab.value = 'basic'
  supplierList.value = []
  Object.assign(formData, {
    materialCode: '',
    materialName: '',
    spec: '',
    unit: '',
    category: '',
    stockQuantity: 0,
    unitPrice: 0,
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = async (row: Material) => {
  isEdit.value = true
  dialogTitle.value = '编辑原材料'
  activeTab.value = 'basic'
  Object.assign(formData, row)
  await fetchMaterialSuppliers(row.materialID!)
  dialogVisible.value = true
}

const handleDelete = async (row: Material) => {
  try {
    await ElMessageBox.confirm('确定要删除该原材料吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteMaterial(row.materialID!)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleAddSupplier = () => {
  newSupplier.materialID = formData.materialID || 0
  newSupplier.supplierID = 0
  newSupplier.supplierProductCode = ''
  newSupplier.supplierProductName = ''
  newSupplier.purchasePrice = 0
  supplierDialogVisible.value = true
}

const handleSaveSupplier = async () => {
  await supplierFormRef.value?.validate()
  try {
    newSupplier.materialID = formData.materialID || 0
    await addMaterialSupplier(newSupplier)
    ElMessage.success('添加成功')
    supplierDialogVisible.value = false
    await fetchMaterialSuppliers(newSupplier.materialID)
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

const handleDeleteSupplier = async (row: MaterialSupplier) => {
  try {
    await ElMessageBox.confirm('确定要删除该供应商关联吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (row.id) {
      await deleteMaterialSupplier(row.id)
    }
    supplierList.value = supplierList.value.filter(item => item !== row)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  try {
    if (isEdit.value) {
      await updateMaterial(formData)
      for (const supplier of supplierList.value) {
        if (supplier.id) {
          await updateMaterialSupplier(supplier)
        }
      }
      ElMessage.success('更新成功')
    } else {
      const res = await addMaterial(formData)
      const materialId = res.data?.materialID || formData.materialID
      for (const supplier of supplierList.value) {
        supplier.materialID = materialId
        await addMaterialSupplier(supplier)
      }
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
  supplierList.value = []
}

onMounted(() => {
  fetchData()
  fetchSuppliers()
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

.supplier-section {
  padding: 10px;
}

.supplier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.empty-supplier {
  padding: 40px;
}
</style>
