<template>
  <div class="warehouse-inventory">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ warehouseName }} - 库存管理</span>
          <div style="display: flex; gap: 10px; align-items: center">
            <el-alert
              v-if="lowStockCount > 0"
              :title="`${lowStockCount} 个产品库存预警！`"
              type="warning"
              :closable="false"
              show-icon
              style="margin-right: 10px"
            />
            <el-button type="primary" @click="handleIn">入库</el-button>
            <el-button type="warning" @click="handleOut">出库</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="产品名称">
          <el-input v-model="searchForm.productName" placeholder="请输入产品名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="productCode" label="产品编码" width="120" />
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="quantity" label="库存数量" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.quantity <= 10 ? '#f56c6c' : 'inherit', fontWeight: row.quantity <= 10 ? 'bold' : 'normal' }">
              {{ row.quantity }}
              <el-tag v-if="row.quantity <= 10" size="small" type="danger" style="margin-left: 5px">预警</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="unitCost" label="单位成本" width="120">
          <template #default="{ row }">
            ¥{{ row.unitCost?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="location" label="库位" width="120" />
        <el-table-column prop="updateDate" label="更新时间" width="180" />
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

    <el-dialog v-model="inDialogVisible" title="入库" width="500px">
      <el-form ref="inFormRef" :model="inFormData" :rules="formRules" label-width="100px">
        <el-form-item label="产品" prop="productID">
          <el-select v-model="inFormData.productID" placeholder="请选择产品" filterable style="width: 100%">
            <el-option
              v-for="product in productList"
              :key="product.productID"
              :label="product.productName"
              :value="product.productID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="inFormData.quantity" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="单位成本" prop="unitCost">
          <el-input-number v-model="inFormData.unitCost" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库位">
          <el-input v-model="inFormData.location" placeholder="请输入库位" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleInSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="outDialogVisible" title="出库" width="500px">
      <el-form ref="outFormRef" :model="outFormData" :rules="outFormRules" label-width="100px">
        <el-form-item label="产品" prop="productID">
          <el-select v-model="outFormData.productID" placeholder="请选择产品" filterable style="width: 100%">
            <el-option
              v-for="product in productList"
              :key="product.productID"
              :label="product.productName"
              :value="product.productID!"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="outFormData.quantity" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="outDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleOutSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getWarehouseInventory,
  inventoryIn,
  inventoryOut,
  type InventoryVO,
  type PageParams
} from '@/api/warehouse'
import { getProductList } from '@/api/product'

const props = defineProps<{
  warehouseId: number
  warehouseName: string
}>()

const loading = ref(false)
const tableData = ref<InventoryVO[]>([])
const productList = ref<any[]>([])
const inDialogVisible = ref(false)
const outDialogVisible = ref(false)
const inFormRef = ref()
const outFormRef = ref()

const searchForm = reactive({
  productName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const inFormData = reactive({
  productID: 0 as number,
  quantity: 0 as number,
  unitCost: 0 as number,
  location: ''
})

const outFormData = reactive({
  productID: 0 as number,
  quantity: 0 as number
})

const lowStockCount = computed(() => {
  return tableData.value.filter(item => item.quantity <= 10).length
})

const formRules = {
  productID: [{ required: true, message: '请选择产品', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  unitCost: [{ required: true, message: '请输入单位成本', trigger: 'blur' }]
}

const outFormRules = {
  productID: [{ required: true, message: '请选择产品', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      productName: searchForm.productName
    }
    const res = await getWarehouseInventory(props.warehouseId, params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
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
  searchForm.productName = ''
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

const handleIn = () => {
  inFormData.productID = 0
  inFormData.quantity = 0
  inFormData.unitCost = 0
  inFormData.location = ''
  inDialogVisible.value = true
}

const handleOut = () => {
  outFormData.productID = 0
  outFormData.quantity = 0
  outDialogVisible.value = true
}

const handleInSubmit = async () => {
  await inFormRef.value?.validate()
  try {
    await inventoryIn({
      warehouseID: props.warehouseId,
      ...inFormData
    })
    ElMessage.success('入库成功')
    inDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('入库失败')
  }
}

const handleOutSubmit = async () => {
  await outFormRef.value?.validate()
  try {
    await inventoryOut({
      warehouseID: props.warehouseId,
      ...outFormData
    })
    ElMessage.success('出库成功')
    outDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('出库失败')
  }
}

onMounted(() => {
  fetchData()
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
</style>
