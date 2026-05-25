<template>
  <div class="supplier-list" data-testid="supplier-list-page">
    <el-card data-testid="supplier-card">
      <template #header>
        <div class="card-header">
          <span data-testid="supplier-page-title">供应商管理</span>
          <el-button type="primary" @click="handleAdd" data-testid="add-supplier-btn">新增供应商</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form" data-testid="supplier-search-form">
        <el-form-item label="供应商名称">
          <el-input v-model="searchForm.supplierName" placeholder="请输入供应商名称" clearable data-testid="supplier-name-search-input" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" data-testid="supplier-search-btn">搜索</el-button>
          <el-button @click="handleReset" data-testid="supplier-reset-btn">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" data-testid="supplier-table">
        <el-table-column prop="supplierCode" label="供应商编号" width="150" data-testid="supplier-code-col" />
        <el-table-column prop="supplierName" label="供应商名称" width="180" data-testid="supplier-name-col" />
        <el-table-column prop="contact" label="联系人" width="100" data-testid="supplier-contact-col" />
        <el-table-column prop="phone" label="电话" width="120" data-testid="supplier-phone-col" />
        <el-table-column prop="fax" label="传真" width="120" data-testid="supplier-fax-col" />
        <el-table-column prop="email" label="邮箱" width="150" data-testid="supplier-email-col" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip data-testid="supplier-address-col" />
        <el-table-column label="状态" width="100" data-testid="supplier-status-col">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" data-testid="supplier-status-tag">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right" data-testid="supplier-actions-col">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)" :data-testid="'view-supplier-btn-' + row.supplierID">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)" :data-testid="'edit-supplier-btn-' + row.supplierID">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)" :data-testid="'delete-supplier-btn-' + row.supplierID">删除</el-button>
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
        data-testid="supplier-pagination"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="resetForm"
      data-testid="supplier-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        data-testid="supplier-form"
      >
        <el-form-item label="供应商编号" v-if="!isEdit" data-testid="supplier-code-form-item">
          <el-input v-model="formData.supplierCode" disabled data-testid="supplier-code-input" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName" data-testid="supplier-name-form-item">
          <el-input v-model="formData.supplierName" placeholder="请输入供应商名称" data-testid="supplier-name-input" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact" data-testid="supplier-contact-form-item">
          <el-input v-model="formData.contact" placeholder="请输入联系人" data-testid="supplier-contact-input" />
        </el-form-item>
        <el-form-item label="电话" prop="phone" data-testid="supplier-phone-form-item">
          <el-input v-model="formData.phone" placeholder="请输入电话" data-testid="supplier-phone-input" />
        </el-form-item>
        <el-form-item label="传真" prop="fax" data-testid="supplier-fax-form-item">
          <el-input v-model="formData.fax" placeholder="请输入传真" data-testid="supplier-fax-input" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email" data-testid="supplier-email-form-item">
          <el-input v-model="formData.email" placeholder="请输入邮箱" data-testid="supplier-email-input" />
        </el-form-item>
        <el-form-item label="地址" prop="address" data-testid="supplier-address-form-item">
          <el-input v-model="formData.address" type="textarea" :rows="3" placeholder="请输入地址" data-testid="supplier-address-input" />
        </el-form-item>
        <el-form-item label="状态" prop="status" data-testid="supplier-status-form-item">
          <el-radio-group v-model="formData.status" data-testid="supplier-status-radio-group">
            <el-radio :label="1" data-testid="supplier-status-active-radio">启用</el-radio>
            <el-radio :label="0" data-testid="supplier-status-inactive-radio">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" data-testid="supplier-cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleSubmit" data-testid="supplier-submit-btn">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getSupplierList,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  type Supplier,
  type PageParams,
  type PageResult
} from '@/api/purchase';

const router = useRouter();

const loading = ref(false);
const tableData = ref<Supplier[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref('');
const formRef = ref();

const searchForm = reactive({
  supplierName: ''
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const formData = reactive<Supplier>({
  supplierCode: '',
  supplierName: '',
  contact: '',
  phone: '',
  fax: '',
  email: '',
  address: '',
  status: 1
});

const formRules = {
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }]
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    const res = await getSupplierList(params);
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
  searchForm.supplierName = '';
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
  dialogTitle.value = '新增供应商';
  dialogVisible.value = true;
};

const handleEdit = (row: Supplier) => {
  isEdit.value = true;
  dialogTitle.value = '编辑供应商';
  Object.assign(formData, row);
  dialogVisible.value = true;
};

const handleView = (row: Supplier) => {
  router.push({ name: 'SupplierDetail', params: { id: row.supplierID } });
};

const handleDelete = async (row: Supplier) => {
  try {
    await ElMessageBox.confirm('确定要删除该供应商吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deleteSupplier(row.supplierID!);
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
      await updateSupplier(formData);
      ElMessage.success('更新成功');
    } else {
      await addSupplier(formData);
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
    supplierCode: '',
    supplierName: '',
    contact: '',
    phone: '',
    fax: '',
    email: '',
    address: '',
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
