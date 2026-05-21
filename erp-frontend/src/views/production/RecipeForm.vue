<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="900px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="配方编号" prop="recipeCode">
            <el-input v-model="formData.recipeCode" placeholder="系统自动生成" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配方名称" prop="recipeName">
            <el-input v-model="formData.recipeName" placeholder="请输入配方名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="关联产品" prop="productId">
            <el-select
              v-model="formData.productId"
              placeholder="请选择关联产品"
              filterable
              @change="handleProductChange"
            >
              <el-option
                v-for="product in productList"
                :key="product.productID || product.productId"
                :label="product.productName"
                :value="product.productID || product.productId"
              >
                <span style="float: left">{{ product.productName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ product.productCode }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本" prop="version">
            <el-input v-model="formData.version" placeholder="如：1.0" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材料成本">
            <span class="cost-display">¥{{ totalMaterialCost.toFixed(2) }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="2"
          placeholder="请输入备注说明"
        />
      </el-form-item>

      <el-divider content-position="left">材料明细</el-divider>

      <div class="materials-section">
        <div class="materials-toolbar">
          <el-button type="primary" size="small" @click="handleAddMaterial">
            <el-icon><Plus /></el-icon>
            添加材料
          </el-button>
        </div>

        <el-table :data="formData.materials" border style="width: 100%">
          <el-table-column label="序号" width="60" align="center">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="原材料" min-width="180">
            <template #default="{ row, $index }">
              <el-select
                v-model="row.materialId"
                placeholder="请选择原材料"
                filterable
                @change="handleMaterialSelect($index)"
              >
                <el-option
                  v-for="material in materialList"
                  :key="material.materialID || material.materialId"
                  :label="material.materialName"
                  :value="material.materialID || material.materialId"
                >
                  <span style="float: left">{{ material.materialName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    ¥{{ material.unitPrice }}
                  </span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单位" width="80" align="center">
            <template #default="{ row }">
              {{ row.unit || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="用量" width="120">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="0"
                :precision="2"
                controls-position="right"
                @change="calculateMaterialCost"
              />
            </template>
          </el-table-column>
          <el-table-column label="单价" width="100" align="right">
            <template #default="{ row }">
              ¥{{ (row.unitPrice || 0).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="金额" width="100" align="right">
            <template #default="{ row }">
              ¥{{ ((row.quantity || 0) * (row.unitPrice || 0)).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="损耗率(%)" width="120">
            <template #default="{ row }">
              <el-input-number
                v-model="row.wasteRate"
                :min="0"
                :max="100"
                :precision="0"
                controls-position="right"
                @change="calculateMaterialCost"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ $index }">
              <el-button
                type="danger"
                size="small"
                link
                @click="handleRemoveMaterial($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Material {
  materialId?: number
  materialIdRef?: number
  materialName: string
  unit: string
  quantity: number
  wasteRate: number
  unitPrice: number
}

interface Recipe {
  recipeId?: number
  recipeCode: string
  recipeName: string
  productId: number
  productName: string
  version: string
  status: number
  remark?: string
  materials: Material[]
}

const props = defineProps<{
  visible: boolean
  mode: 'create' | 'edit' | 'view'
  recipe?: Recipe | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: Recipe): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const dialogTitle = computed(() => {
  const titles = {
    create: '新增配方',
    edit: '编辑配方',
    view: '查看配方'
  }
  return titles[props.mode]
})

const formRef = ref()
const formData = ref<Recipe>({
  recipeCode: '',
  recipeName: '',
  productId: 0,
  productName: '',
  version: '1.0',
  status: 1,
  remark: '',
  materials: []
})

const rules = {
  recipeName: [{ required: true, message: '请输入配方名称', trigger: 'blur' }],
  productId: [{ required: true, message: '请选择关联产品', trigger: 'change' }]
}

const productList = ref<any[]>([])
const materialList = ref<any[]>([])

const totalMaterialCost = computed(() => {
  return formData.value.materials.reduce((sum, mat) => {
    const qty = (mat.quantity || 0) * (1 + (mat.wasteRate || 0) / 100)
    return sum + qty * (mat.unitPrice || 0)
  }, 0)
})

watch(() => props.visible, async (val) => {
  if (val) {
    await loadProductList()
    await loadMaterialList()

    if (props.mode === 'edit' && props.recipe) {
      formData.value = JSON.parse(JSON.stringify(props.recipe))
    } else if (props.mode === 'create') {
      resetForm()
    }
  }
})

const loadProductList = async () => {
  try {
    const res = await fetch('/api/product/products')
    const data = await res.json()
    if (data.code === 200) {
      productList.value = data.data.list || []
    }
  } catch (error) {
    console.error('加载产品列表失败:', error)
  }
}

const loadMaterialList = async () => {
  try {
    const res = await fetch('/api/purchase/materials')
    const data = await res.json()
    if (data.code === 200) {
      materialList.value = data.data.list || []
    }
  } catch (error) {
    console.error('加载原材料列表失败:', error)
  }
}

const handleProductChange = (productId: number) => {
  const product = productList.value.find(p => (p.productID || p.productId) === productId)
  if (product) {
    formData.value.productName = product.productName
  }
}

const handleMaterialSelect = (index: number) => {
  const materialId = formData.value.materials[index].materialId
  const material = materialList.value.find(m => (m.materialID || m.materialId) === materialId)
  if (material) {
    formData.value.materials[index].materialIdRef = material.materialID || material.materialId
    formData.value.materials[index].materialName = material.materialName
    formData.value.materials[index].unit = material.unit
    formData.value.materials[index].unitPrice = material.unitPrice
    formData.value.materials[index].wasteRate = material.wasteRate || 0
  }
  calculateMaterialCost()
}

const handleAddMaterial = () => {
  formData.value.materials.push({
    materialId: 0,
    materialName: '',
    unit: '',
    quantity: 0,
    wasteRate: 0,
    unitPrice: 0
  })
}

const handleRemoveMaterial = (index: number) => {
  formData.value.materials.splice(index, 1)
  calculateMaterialCost()
}

const calculateMaterialCost = () => {
  // 自动重新计算，会触发 totalMaterialCost 重新计算
}

const handleSubmit = async () => {
  if (props.mode === 'view') {
    handleClose()
    return
  }

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (formData.value.materials.length === 0) {
        ElMessage.warning('请至少添加一个材料')
        return
      }

      emit('submit', formData.value)
      ElMessage.success(props.mode === 'create' ? '创建成功' : '更新成功')
      handleClose()
    }
  })
}

const handleClose = () => {
  formRef.value?.resetFields()
  resetForm()
  dialogVisible.value = false
}

const resetForm = () => {
  formData.value = {
    recipeCode: '',
    recipeName: '',
    productId: 0,
    productName: '',
    version: '1.0',
    status: 1,
    remark: '',
    materials: []
  }
}
</script>

<style scoped lang="scss">
.materials-section {
  .materials-toolbar {
    margin-bottom: 10px;
  }
}

.cost-display {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}
</style>
