<template>
  <div class="recipe-list">
    <div class="page-header">
      <h2>配方单</h2>
    </div>

    <div class="toolbar">
      <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索配方单名称"
          style="width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="filterStatus"
          placeholder="状态筛选"
          clearable
          style="width: 120px"
          @change="loadRecipes"
        >
          <el-option label="全部" :value="null" />
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
      </div>
      <div class="button-area">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增配方单
        </el-button>
        <el-button type="default" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <div class="content-area">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="recipeCode" label="配方单编号" width="180" />
        <el-table-column prop="recipeName" label="配方单名称" width="180" />
        <el-table-column prop="productName" label="对应产品" width="150" />
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="materialCount" label="材料数量" width="100" align="center">
          <template #default="{ row }">
            {{ row.materials?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="materialCost" label="材料成本" width="120" align="right">
          <template #default="{ row }">
            ¥{{ (row.materialCost || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建日期" width="120" />
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
            <el-button type="success" size="small" link @click="handleViewMaterials(row)">
              查看材料
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-area">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <RecipeForm
      v-model:visible="formVisible"
      :mode="formMode"
      :recipe="currentRecipe"
      @submit="handleFormSubmit"
    />

    <el-dialog
      v-model="materialsVisible"
      title="配方材料明细"
      width="800px"
    >
      <el-table :data="currentMaterials" border style="width: 100%">
        <el-table-column prop="materialName" label="原材料名称" width="180" />
        <el-table-column prop="unit" label="单位" width="100" align="center" />
        <el-table-column prop="quantity" label="配方用量" width="120" align="right">
          <template #default="{ row }">
            {{ (row.quantity || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" width="120" align="right">
          <template #default="{ row }">
            ¥{{ (row.unitPrice || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ ((row.quantity || 0) * (row.unitPrice || 0)).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="wasteRate" label="损耗率" width="100" align="center">
          <template #default="{ row }">
            {{ row.wasteRate || 0 }}%
          </template>
        </el-table-column>
      </el-table>

      <div class="material-summary">
        <el-row>
          <el-col :span="12">
            <span class="label">材料项数：</span>
            <span class="value">{{ currentMaterials.length }}</span>
          </el-col>
          <el-col :span="12">
            <span class="label">材料成本合计：</span>
            <span class="value cost">
              ¥{{ totalMaterialCost.toFixed(2) }}
            </span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RecipeForm from './RecipeForm.vue'
import {
  getRecipeList,
  getRecipeMaterials,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipeMaterials
} from '@/api/production'

interface RecipeMaterial {
  materialId?: number
  materialIdRef: number
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
  materials: RecipeMaterial[]
  materialCost?: number
  materialCount?: number
  createDate?: string
  creator?: string
}

const searchKeyword = ref('')
const filterStatus = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const tableData = ref<Recipe[]>([])
const loading = ref(false)

const formVisible = ref(false)
const formMode = ref<'create' | 'edit' | 'view'>('create')
const currentRecipe = ref<Recipe | null>(null)

const materialsVisible = ref(false)
const currentMaterials = ref<RecipeMaterial[]>([])

const totalMaterialCost = computed(() => {
  return currentMaterials.value.reduce((sum, mat) => {
    return sum + (mat.quantity || 0) * (mat.unitPrice || 0)
  }, 0)
})

const loadRecipes = async () => {
  loading.value = true
  try {
    const res = await getRecipeList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: filterStatus.value
    })

    if (res.data) {
      tableData.value = res.data.list.map((recipe: any) => ({
        ...recipe,
        materialCost: calculateMaterialCost(recipe.materials || [])
      }))
      total.value = res.data.total
    }
  } catch (error) {
    console.error('加载配方列表失败:', error)
    ElMessage.error('加载配方列表失败')
  } finally {
    loading.value = false
  }
}

const calculateMaterialCost = (materials: RecipeMaterial[]): number => {
  return materials.reduce((sum, mat) => {
    const qty = (mat.quantity || 0) * (1 + (mat.wasteRate || 0) / 100)
    return sum + qty * (mat.unitPrice || 0)
  }, 0)
}

const handleSearch = () => {
  currentPage.value = 1
  loadRecipes()
}

const handleRefresh = () => {
  searchKeyword.value = ''
  filterStatus.value = null
  currentPage.value = 1
  loadRecipes()
  ElMessage.success('刷新成功')
}

const handleAdd = () => {
  formMode.value = 'create'
  currentRecipe.value = null
  formVisible.value = true
}

const handleView = (row: Recipe) => {
  formMode.value = 'view'
  currentRecipe.value = row
  formVisible.value = true
}

const handleEdit = (row: Recipe) => {
  formMode.value = 'edit'
  currentRecipe.value = row
  formVisible.value = true
}

const handleDelete = (row: Recipe) => {
  ElMessageBox.confirm(
    `确定要删除配方单 "${row.recipeName}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteRecipe(row.recipeId!)
      ElMessage.success('删除成功')
      loadRecipes()
    } catch (error) {
      console.error('删除配方失败:', error)
      ElMessage.error('删除配方失败')
    }
  }).catch(() => {})
}

const handleViewMaterials = async (row: Recipe) => {
  try {
    const res = await getRecipeMaterials(row.recipeId!)
    if (res.data) {
      currentMaterials.value = res.data
      materialsVisible.value = true
    }
  } catch (error) {
    console.error('加载配方材料失败:', error)
    ElMessage.error('加载配方材料失败')
  }
}

const handleFormSubmit = async (data: Recipe) => {
  try {
    if (formMode.value === 'create') {
      const res = await addRecipe(data)
      if (res.data && res.data.recipeId) {
        await saveRecipeMaterials(res.data.recipeId, data.materials)
      }
    } else if (formMode.value === 'edit') {
      await updateRecipe(data)
      if (data.recipeId) {
        await saveRecipeMaterials(data.recipeId, data.materials)
      }
    }
    loadRecipes()
  } catch (error) {
    console.error('保存配方失败:', error)
    ElMessage.error('保存配方失败')
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadRecipes()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadRecipes()
}

onMounted(() => {
  loadRecipes()
})
</script>

<style scoped lang="scss">
.recipe-list {
  padding: 20px;

  .page-header {
    margin-bottom: 20px;

    h2 {
      margin: 0;
      color: #333;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .search-area {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .button-area {
      display: flex;
      gap: 10px;
    }
  }

  .content-area {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .pagination-area {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.material-summary {
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;

  .label {
    font-weight: 500;
    color: #606266;
  }

  .value {
    font-size: 16px;
    font-weight: bold;
    color: #303133;
  }

  .cost {
    color: #409eff;
    font-size: 18px;
  }
}
</style>
