<template>
  <div class="purchase-order-list" data-testid="purchase-order-list-page">
    <el-card data-testid="purchase-order-card">
      <template #header>
        <div class="card-header">
          <span data-testid="purchase-order-page-title">采购订单管理</span>
          <el-button type="primary" @click="handleAdd" data-testid="add-purchase-order-btn">新增订单</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form" data-testid="purchase-order-search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.poNo" placeholder="请输入订单号" clearable data-testid="purchase-order-no-search-input" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="searchForm.supplierID" placeholder="请选择供应商" clearable style="width: 200px" data-testid="purchase-order-supplier-select">
            <el-option label="深圳材料厂" :value="1" data-testid="purchase-order-supplier-option-1" />
            <el-option label="杭州化工公司" :value="2" data-testid="purchase-order-supplier-option-2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px" data-testid="purchase-order-status-select">
            <el-option label="待审核" value="pending" data-testid="purchase-order-status-option-pending" />
            <el-option label="已审核" value="approved" data-testid="purchase-order-status-option-approved" />
            <el-option label="已收货" value="received" data-testid="purchase-order-status-option-received" />
            <el-option label="已完成" value="completed" data-testid="purchase-order-status-option-completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" data-testid="purchase-order-search-btn">搜索</el-button>
          <el-button @click="handleReset" data-testid="purchase-order-reset-btn">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" data-testid="purchase-order-table">
        <el-table-column prop="poNo" label="订单号" width="180" data-testid="purchase-order-no-col" />
        <el-table-column prop="supplierName" label="供应商" width="200" data-testid="purchase-order-supplier-col" />
        <el-table-column prop="orderDate" label="下单日期" width="120" data-testid="purchase-order-date-col" />
        <el-table-column prop="deliveryDate" label="交货日期" width="120" data-testid="purchase-delivery-date-col" />
        <el-table-column prop="totalAmount" label="订单金额" width="120" data-testid="purchase-amount-col">
          <template #default="{ row }">
            ¥{{ row.totalAmount }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" data-testid="purchase-status-col">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" data-testid="purchase-status-tag">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="制单人" width="100" data-testid="purchase-creator-col" />
        <el-table-column label="操作" width="280" fixed="right" data-testid="purchase-actions-col">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)" :data-testid="'view-purchase-btn-' + row.poID">查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)" :data-testid="'edit-purchase-btn-' + row.poID">编辑</el-button>
            <el-button link type="success" size="small" @click="handleApprove(row)" v-if="row.status === 'pending'" :data-testid="'approve-purchase-btn-' + row.poID">审核</el-button>
            <el-button link type="warning" size="small" @click="handleReceive(row)" v-if="row.status === 'approved'" :data-testid="'receive-purchase-btn-' + row.poID">收货</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)" :data-testid="'delete-purchase-btn-' + row.poID">删除</el-button>
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
        data-testid="purchase-order-pagination"
      />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      @close="resetForm"
      data-testid="purchase-order-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        data-testid="purchase-order-form"
      >
        <el-form-item label="供应商" prop="supplierID" data-testid="purchase-order-supplier-form-item">
          <el-select v-model="formData.supplierID" placeholder="请选择供应商" style="width: 100%" data-testid="purchase-order-supplier-form-select">
            <el-option label="深圳材料厂" :value="1" data-testid="purchase-order-form-supplier-option-1" />
            <el-option label="杭州化工公司" :value="2" data-testid="purchase-order-form-supplier-option-2" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单日期" prop="orderDate" data-testid="purchase-order-date-form-item">
          <el-date-picker
            v-model="formData.orderDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            data-testid="purchase-order-date-picker"
          />
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate" data-testid="purchase-delivery-date-form-item">
          <el-date-picker
            v-model="formData.deliveryDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            data-testid="purchase-delivery-date-picker"
          />
        </el-form-item>
        <el-form-item label="订单金额" prop="totalAmount" data-testid="purchase-amount-form-item">
          <el-input-number v-model="formData.totalAmount" :min="0" :precision="2" style="width: 100%" data-testid="purchase-amount-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" data-testid="purchase-order-cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleSubmit" data-testid="purchase-order-submit-btn">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getPurchaseOrderList,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  receivePurchaseOrder,
  type PurchaseOrder,
  type PageParams
} from '@/api/purchase';
import {
  addPayable,
  type Payable
} from '@/api/finance';

const router = useRouter();
const loading = ref(false);
const tableData = ref<PurchaseOrder[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref('');
const formRef = ref();

const searchForm = reactive({
  poNo: '',
  supplierID: '',
  status: ''
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const formData = reactive<PurchaseOrder>({
  orderNo: '',
  supplierID: 0,
  supplierName: '',
  orderDate: '',
  deliveryDate: '',
  totalAmount: 0,
  status: 'pending',
  creator: ''
});

const formRules = {
  supplierID: [{ required: true, message: '请选择供应商', trigger: 'change' }]
};

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    pending: 'warning',
    approved: 'primary',
    received: 'success',
    completed: 'info'
  };
  return types[status] || 'info';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待审核',
    approved: '已审核',
    received: '已收货',
    completed: '已完成'
  };
  return texts[status] || status;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params: PageParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    const res = await getPurchaseOrderList(params);
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
  searchForm.orderNo = '';
  searchForm.supplierID = '';
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
  dialogTitle.value = '新增采购订单';
  dialogVisible.value = true;
};

const handleEdit = (row: PurchaseOrder) => {
  isEdit.value = true;
  dialogTitle.value = '编辑采购订单';
  Object.assign(formData, row);
  dialogVisible.value = true;
};

const handleView = (row: PurchaseOrder) => {
  router.push(`/purchase/order/${row.poID}`);
};

const handleApprove = async (row: PurchaseOrder) => {
  try {
    await ElMessageBox.confirm('确定要审核该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await updatePurchaseOrderStatus(row.poID!, 'approved');
    ElMessage.success('审核成功');
    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('审核失败');
    }
  }
};

const handleReceive = async (row: PurchaseOrder) => {
  try {
    await ElMessageBox.confirm(
      `确定该订单已收货吗？收货后将自动生成应付款记录。\n\n订单号：${row.poNo}\n供应商：${row.supplierName}\n金额：¥${row.totalAmount}`,
      '收货确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await receivePurchaseOrder(row.poID!);

    const payableData: Payable = {
      payableNo: '',
      supplierID: row.supplierID,
      supplierName: row.supplierName,
      purchaseOrderID: row.poID,
      purchaseOrderNo: row.poNo,
      totalAmount: row.totalAmount,
      paidAmount: 0,
      pendingAmount: row.totalAmount,
      status: 'pending',
      creator: row.creator || '陈立国'
    };

    await addPayable({ payable: payableData });

    ElMessage.success('收货确认成功，已生成应付款记录');
    fetchData();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

const handleDelete = async (row: PurchaseOrder) => {
  try {
    await ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deletePurchaseOrder(row.poID!);
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
      await updatePurchaseOrder(formData);
      ElMessage.success('更新成功');
    } else {
      await addPurchaseOrder(formData);
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
    orderNo: '',
    supplierID: 0,
    supplierName: '',
    orderDate: '',
    deliveryDate: '',
    totalAmount: 0,
    status: 'pending',
    creator: ''
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
