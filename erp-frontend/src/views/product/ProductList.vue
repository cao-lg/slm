<template>
  <div class="product-list" data-testid="product-list-page">
    <el-card data-testid="product-list-card">
      <template #header>
        <div class="card-header">
          <span>产品管理</span>
          <el-button type="primary" @click="handleAdd" data-testid="add-product-btn">新增产品</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form" data-testid="product-search-form">
        <el-form-item label="产品名称">
          <el-input v-model="searchForm.productName" placeholder="请输入产品名称" clearable data-testid="product-name-search-input" />
        </el-form-item>
        <el-form-item label="产品类别">
          <el-select v-model="searchForm.category" placeholder="请选择产品类别" clearable style="width: 180px" data-testid="product-category-search-select">
            <el-option label="原材料" value="原材料" />
            <el-option label="半成品" value="半成品" />
            <el-option label="成品" value="成品" />
            <el-option label="配件" value="配件" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" data-testid="product-search-btn">搜索</el-button>
          <el-button @click="handleReset" data-testid="product-reset-btn">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" data-testid="product-table">
        <el-table-column prop="productCode" label="产品编号" width="180" />
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="spec" label="规格" width="150" />
        <el-table-column prop="price" label="售价" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本" width="100">
          <template #default="{ row }">
            ¥{{ row.cost }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)" :data-testid="'view-product-btn-' + row.productID">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)" :data-testid="'edit-product-btn-' + row.productID">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)" :data-testid="'delete-product-btn-' + row.productID">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
        data-testid="product-pagination"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
      data-testid="product-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        data-testid="product-form"
      >
        <el-form-item label="产品编号" v-if="!isEdit">
          <el-input v-model="formData.productCode" disabled data-testid="product-code-input" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="formData.productName" placeholder="请输入产品名称" data-testid="product-name-input" />
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-input v-model="formData.category" placeholder="请输入类别" data-testid="product-category-input" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="formData.unit" placeholder="请输入单位" data-testid="product-unit-input" />
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="formData.spec" placeholder="请输入规格" data-testid="product-spec-input" />
        </el-form-item>
        <el-form-item label="售价" prop="price">
          <el-input-number v-model="formData.price" :min="0" :step="0.01" style="width: 100%" data-testid="product-price-input" />
        </el-form-item>
        <el-form-item label="成本" prop="cost">
          <el-input-number v-model="formData.cost" :min="0" :step="0.01" style="width: 100%" data-testid="product-cost-input" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status" data-testid="product-status-radio-group">
            <el-radio :label="1" data-testid="product-status-enabled">启用</el-radio>
            <el-radio :label="0" data-testid="product-status-disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" data-testid="product-dialog-cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleSubmit" data-testid="product-dialog-submit-btn">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getProductList,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type PageParams,
  type PageResult
} from '@/api/product';

const router = useRouter();

const loading = ref(false);
const tableData = ref<Product[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref('');
const formRef = ref();

const searchForm = reactive({
  productName: '',
  category: ''
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const formData = reactive<Product>({
  productCode: '',
  productName: '',
  category: '',
  unit: '',
  spec: '',
  price: 0,
  cost: 0,
  status: 1
});

const formRules = {
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请输入产品类别', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入产品单位', trigger: 'blur' }],
  price: [{ required: true, message: '请输入产品售价', trigger: 'blur' }]
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    const res = await getProductList(params);
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
  searchForm.category = '';
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
  dialogTitle.value = '新增产品';
  dialogVisible.value = true;
};

const handleEdit = (row: Product) => {
  isEdit.value = true;
  dialogTitle.value = '编辑产品';
  Object.assign(formData, row);
  dialogVisible.value = true;
};

const handleView = (row: Product) => {
  router.push({ name: 'ProductDetail', params: { id: row.productID } });
};

const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm('确定要删除该产品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deleteProduct(row.productID!);
    ElMessage.success('删除成功');
    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  try {
    if (isEdit.value) {
      await updateProduct(formData);
      ElMessage.success('更新成功');
    } else {
      await addProduct(formData);
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
    productCode: '',
    productName: '',
    category: '',
    unit: '',
    spec: '',
    price: 0,
    cost: 0,
    status: 1
  });
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
</style>
