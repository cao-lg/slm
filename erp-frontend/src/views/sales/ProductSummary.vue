<template>
  <div class="product-summary">
    <div class="page-header">
      <h2>产品汇总</h2>
    </div>
    
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索产品名称"
        style="width: 300px"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-button type="primary" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>
    
    <div class="content-area">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="productCode" label="产品编码" width="120" />
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="totalSales" label="总销售数量" width="120" align="right" />
        <el-table-column prop="totalAmount" label="总销售金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.totalAmount?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="stockQuantity" label="库存数量" width="120" align="right" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleView(row)">
              查看详情
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const tableData = ref([
  {
    productCode: 'CP202505200001',
    productName: 'A型配件',
    spec: '直径10mm',
    unit: '个',
    totalSales: 500,
    totalAmount: 50000,
    stockQuantity: 200
  },
  {
    productCode: 'CP202505200002',
    productName: 'B型组件',
    spec: '尺寸20x30cm',
    unit: '套',
    totalSales: 300,
    totalAmount: 60000,
    stockQuantity: 100
  },
  {
    productCode: 'CP202505200003',
    productName: 'C型零件',
    spec: '长度5cm',
    unit: '件',
    totalSales: 1000,
    totalAmount: 50000,
    stockQuantity: 500
  }
])

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleView = (row: any) => {
  ElMessageBox.confirm(
    `产品详情\n\n产品编码：${row.productCode}\n产品名称：${row.productName}\n规格：${row.spec}\n单位：${row.unit}\n总销售数量：${row.totalSales}\n总销售金额：¥${row.totalAmount?.toFixed(2) || '0.00'}\n库存数量：${row.stockQuantity}`,
    '产品详情',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).catch(() => {})
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

onMounted(() => {
  total.value = tableData.value.length
})
</script>

<style scoped lang="scss">
.product-summary {
  padding: 20px;
  
  .page-header {
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      color: #333;
    }
  }
  
  .search-bar {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    align-items: center;
  }
  
  .content-area {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    
    .pagination-area {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
