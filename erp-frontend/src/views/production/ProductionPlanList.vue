<template>
  <div class="production-plan-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>生产计划管理</span>
          <el-button type="primary" @click="handleAdd">新增计划</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="产品名称">
          <el-input v-model="searchForm.productName" placeholder="请输入产品名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待生产" value="pending" />
            <el-option label="生产中" value="producing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="planNo" label="计划编号" width="180" />
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column label="计划数量" width="100">
          <template #default="{ row }">
            {{ row.plannedQuantity }}
          </template>
        </el-table-column>
        <el-table-column label="已完成数量" width="100">
          <template #default="{ row }">
            {{ row.completedQuantity || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="recipeName" label="使用配方" width="150">
          <template #default="{ row }">
            {{ row.recipeName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="responsible" label="负责人" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="160" />
        <el-table-column prop="creator" label="制单人" width="100" />
        <el-table-column prop="remark" label="备注" min-width="150" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              v-if="row.status === 'pending'"
              link type="success"
              size="small"
              @click="handleStart(row)"
            >
              开始生产
            </el-button>
            <el-button
              v-if="row.status === 'producing'"
              link type="warning"
              size="small"
              @click="handleComplete(row)"
            >
              完成
            </el-button>
            <el-button
              v-if="row.status === 'producing'"
              link type="danger"
              size="small"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
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
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productId">
              <el-select
                v-model="formData.productId"
                placeholder="请选择产品"
                filterable
                remote
                :remote-method="handleProductSearch"
                :loading="productSelectLoading"
                style="width: 100%"
                @change="handleProductChange"
              >
                <el-option
                  v-for="product in productList"
                  :key="product.productID"
                  :label="product.productName"
                  :value="product.productID!"
                >
                  <span style="float: left">{{ product.productName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px;">{{ product.productCode }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划数量" prop="plannedQuantity">
              <el-input-number v-model="formData.plannedQuantity" :min="1" style="width: 100%" @change="handleQuantityChange" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="请选择开始日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                placeholder="请选择结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" prop="responsible">
              <el-input v-model="formData.responsible" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择配方">
              <el-select
                v-model="formData.recipeId"
                placeholder="可选 - 根据配方计算材料"
                clearable
                filterable
                style="width: 100%"
                @change="handleRecipeChange"
              >
                <el-option
                  v-for="recipe in recipeList"
                  :key="recipe.recipeID || recipe.recipeId"
                  :label="recipe.recipeName"
                  :value="recipe.recipeID || recipe.recipeId"
                >
                  <span style="float: left">{{ recipe.recipeName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px;">
                    {{ recipe.productName }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" rows="3" placeholder="请输入备注" />
        </el-form-item>

        <el-divider v-if="formData.recipeId && calculatedMaterials.length > 0" content-position="left">
          材料需求计算（根据配方自动计算）
        </el-divider>

        <div v-if="formData.recipeId && calculatedMaterials.length > 0" class="material-calc-section">
          <el-alert
            :title="`配方：${selectedRecipe?.recipeName} | 产品：${formData.productName} | 计划数量：${formData.plannedQuantity}`"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 15px"
          />

          <el-table :data="calculatedMaterials" border size="small">
            <el-table-column prop="materialName" label="原材料" width="180" />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="unitPrice" label="单价" width="100" align="right">
              <template #default="{ row }">
                ¥{{ (row.unitPrice || 0).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="formulaQuantity" label="配方用量(单位产品)" width="150" align="right">
              <template #default="{ row }">
                {{ (row.formulaQuantity || 0).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column prop="requiredQuantity" label="需求数量" width="120" align="right">
              <template #default="{ row }">
                <span style="color: #409eff; font-weight: bold;">
                  {{ (row.requiredQuantity || 0).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120" align="right">
              <template #default="{ row }">
                ¥{{ (row.amount || 0).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>

          <div class="material-summary">
            <el-row>
              <el-col :span="8">
                <span class="label">材料项数：</span>
                <span class="value">{{ calculatedMaterials.length }}</span>
              </el-col>
              <el-col :span="8">
                <span class="label">材料成本合计：</span>
                <span class="value cost">¥{{ totalMaterialCost.toFixed(2) }}</span>
              </el-col>
              <el-col :span="8">
                <span class="label">单位成本：</span>
                <span class="value cost">¥{{ unitMaterialCost.toFixed(2) }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

        <el-alert
          v-if="!isEdit"
          title="提示"
          type="info"
          :closable="false"
          show-icon
          style="margin-top: 10px"
        >
          <template #default>
            生产计划创建后，状态默认为"待生产"。<br>
            点击"开始生产"后，状态将变为"生产中"。<br>
            点击"完成"后，状态将变为"已完成"并自动触发成品入库。
          </template>
        </el-alert>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getProductionPlanList,
  addProductionPlan,
  updateProductionPlan,
  deleteProductionPlan,
  updateProductionPlanStatus,
  getRecipeList,
  getRecipeMaterials,
  type ProductionPlan,
  type PageParams,
  type Recipe
} from '@/api/production';
import { getProductList, type Product } from '@/api/product';
import { inventoryIn } from '@/api/warehouse';

interface MaterialRequirement {
  materialId: number
  materialName: string
  unit: string
  unitPrice: number
  formulaQuantity: number
  requiredQuantity: number
  wasteRate: number
  amount: number
}

const loading = ref(false);
const tableData = ref<ProductionPlan[]>([]);
const productList = ref<Product[]>([]);
const recipeList = ref<any[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref('');
const formRef = ref();
const productSelectLoading = ref(false);

const calculatedMaterials = ref<MaterialRequirement[]>([]);
const selectedRecipe = ref<any>(null);

const fetchProductList = async () => {
  productSelectLoading.value = true;
  try {
    const res = await getProductList({ page: 1, pageSize: 1000 });
    productList.value = res.data.list.filter((p: Product) => p.status === 1);
  } catch (error) {
    ElMessage.error('获取产品列表失败');
  } finally {
    productSelectLoading.value = false;
  }
};

const fetchRecipeList = async () => {
  try {
    const res = await getRecipeList({ page: 1, pageSize: 100 });
    if (res.data) {
      recipeList.value = res.data.list.filter((r: any) => r.status === 1);
    }
  } catch (error) {
    console.error('获取配方列表失败:', error);
  }
};

const searchForm = reactive({
  productName: '',
  status: ''
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const formData = reactive<any>({
  planNo: '',
  productId: 0,
  productName: '',
  plannedQuantity: 0,
  completedQuantity: 0,
  startDate: '',
  endDate: '',
  responsible: '',
  status: 'pending',
  remark: '',
  recipeId: null as number | null,
  recipeName: '',
  creator: '陈立国',
  createDate: new Date().toLocaleString()
});

const formRules = {
  productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
  plannedQuantity: [{ required: true, message: '请输入计划数量', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  responsible: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
};

const getStatusType = (status: string) => {
  const typeMap: any = {
    pending: 'info',
    producing: 'warning',
    completed: 'success',
    cancelled: 'danger'
  };
  return typeMap[status] || 'info';
};

const getStatusText = (status: string) => {
  const textMap: any = {
    pending: '待生产',
    producing: '生产中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return textMap[status] || status;
};

const totalMaterialCost = computed(() => {
  return calculatedMaterials.value.reduce((sum, mat) => sum + (mat.amount || 0), 0);
});

const unitMaterialCost = computed(() => {
  if (formData.plannedQuantity > 0) {
    return totalMaterialCost.value / formData.plannedQuantity;
  }
  return 0;
});

const fetchData = async () => {
  loading.value = true;
  try {
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    const res = await getProductionPlanList(params);
    tableData.value = res.data.list;
    pagination.total = res.data.total;
  } catch (error) {
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.page = 1;
  fetchData();
};

const handleReset = () => {
  searchForm.productName = '';
  searchForm.status = '';
  handleSearch();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  fetchData();
};

const handleCurrentChange = (page: number) => {
  pagination.page = page;
  fetchData();
};

const handleAdd = () => {
  isEdit.value = false;
  dialogTitle.value = '新增生产计划';
  dialogVisible.value = true;
  fetchProductList();
  fetchRecipeList();
  calculatedMaterials.value = [];
  selectedRecipe.value = null;
};

const handleEdit = (row: ProductionPlan) => {
  isEdit.value = true;
  dialogTitle.value = '编辑生产计划';
  Object.assign(formData, row);
  dialogVisible.value = true;
  fetchProductList();
  fetchRecipeList();

  if (row.recipeId) {
    formData.recipeId = row.recipeId;
    handleRecipeChange(row.recipeId);
  }
};

const handleProductSearch = async (query: string) => {
  if (query) {
    productSelectLoading.value = true;
    try {
      const res = await getProductList({ page: 1, pageSize: 100, productName: query });
      productList.value = res.data.list.filter((p: Product) => p.status === 1);
    } catch (error) {
      ElMessage.error('搜索产品失败');
    } finally {
      productSelectLoading.value = false;
    }
  } else {
    fetchProductList();
  }
};

const handleProductChange = (productId: number) => {
  const product = productList.value.find(p => p.productID === productId);
  if (product) {
    formData.productName = product.productName;
  }
};

const handleQuantityChange = () => {
  if (formData.recipeId && formData.plannedQuantity > 0) {
    calculateMaterialRequirements();
  }
};

const handleRecipeChange = async (recipeId: number | null) => {
  if (!recipeId) {
    calculatedMaterials.value = [];
    selectedRecipe.value = null;
    formData.recipeName = '';
    return;
  }

  try {
    const recipe = recipeList.value.find(r => (r.recipeID || r.recipeId) === recipeId);
    selectedRecipe.value = recipe;

    if (recipe) {
      formData.recipeName = recipe.recipeName;

      if (recipe.productId !== formData.productId) {
        ElMessage.warning('配方关联产品与选择的产品不一致，可能导致材料需求计算不准确');
      }

      const res = await getRecipeMaterials(recipeId);
      if (res.data) {
        calculateMaterialRequirementsFromMaterials(res.data);
      }
    }
  } catch (error) {
    console.error('获取配方材料失败:', error);
    ElMessage.error('获取配方材料失败');
  }
};

const calculateMaterialRequirementsFromMaterials = (materials: any[]) => {
  if (!formData.plannedQuantity || formData.plannedQuantity <= 0) {
    calculatedMaterials.value = [];
    return;
  }

  const ratio = formData.plannedQuantity;

  calculatedMaterials.value = materials.map((mat: any) => {
    const formulaQty = mat.quantity || 0;
    const wasteRate = mat.wasteRate || 0;
    const requiredQty = formulaQty * ratio * (1 + wasteRate / 100);
    const unitPrice = mat.unitPrice || 0;

    return {
      materialId: mat.materialIdRef || mat.materialId,
      materialName: mat.materialName,
      unit: mat.unit,
      unitPrice,
      formulaQuantity: formulaQty,
      requiredQuantity: requiredQty,
      wasteRate,
      amount: requiredQty * unitPrice
    };
  });
};

const calculateMaterialRequirements = () => {
  if (!selectedRecipe.value || !formData.plannedQuantity) {
    calculatedMaterials.value = [];
    return;
  }
};

const handleDelete = async (row: ProductionPlan) => {
  try {
    await ElMessageBox.confirm('确定要删除该生产计划吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deleteProductionPlan(row.planId!);
    ElMessage.success('删除成功');
    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const handleStart = async (row: ProductionPlan) => {
  try {
    await ElMessageBox.confirm('确定要开始生产吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await updateProductionPlanStatus(row.planId!, 'producing');
    ElMessage.success('已开始生产');
    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

const handleComplete = async (row: ProductionPlan) => {
  try {
    await ElMessageBox.confirm(
      `确定要完成生产吗？\n完成后将自动入库 ${row.plannedQuantity} 个「${row.productName}」到成品仓。`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await updateProductionPlanStatus(row.planId!, 'completed');

    try {
      await inventoryIn({
        warehouseID: 2,
        productID: row.productId!,
        quantity: row.plannedQuantity!,
        unitCost: 0,
        remark: `生产计划 ${row.planNo} 完成入库`
      });
      ElMessage.success('已完成生产，并触发成品入库');
    } catch (inboundError) {
      ElMessage.warning('生产已完成，但成品入库失败');
    }

    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

const handleCancel = async (row: ProductionPlan) => {
  try {
    await ElMessageBox.confirm('确定要取消生产吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await updateProductionPlanStatus(row.planId!, 'cancelled');
    ElMessage.success('已取消生产');
    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  try {
    if (isEdit.value) {
      await updateProductionPlan(formData);
      ElMessage.success('更新成功');
    } else {
      await addProductionPlan(formData);
      ElMessage.success('添加成功');
    }
    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '添加失败');
  }
};

const resetForm = () => {
  formRef.value?.resetFields();
  Object.assign(formData, {
    planNo: '',
    productId: 0,
    productName: '',
    plannedQuantity: 0,
    completedQuantity: 0,
    startDate: '',
    endDate: '',
    responsible: '',
    status: 'pending',
    remark: '',
    recipeId: null,
    recipeName: '',
    creator: '陈立国',
    createDate: new Date().toLocaleString()
  });
  calculatedMaterials.value = [];
  selectedRecipe.value = null;
};

onMounted(() => {
  fetchData();
});
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

.material-calc-section {
  margin: 15px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.material-summary {
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.material-summary .label {
  font-weight: 500;
  color: #606266;
}

.material-summary .value {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.material-summary .cost {
  color: #409eff;
  font-size: 16px;
}
</style>
