<template>
  <div class="inventory-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>库存管理</span>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="车间仓" name="1">
          <WarehouseInventory :warehouse-id="1" warehouse-name="车间仓" />
        </el-tab-pane>
        <el-tab-pane label="成品仓" name="2">
          <WarehouseInventory :warehouse-id="2" warehouse-name="成品仓" />
        </el-tab-pane>
        <el-tab-pane label="材料仓" name="3">
          <WarehouseInventory :warehouse-id="3" warehouse-name="材料仓" />
        </el-tab-pane>
        <el-tab-pane label="外仓" name="4">
          <WarehouseInventory :warehouse-id="4" warehouse-name="外仓" />
        </el-tab-pane>
        <el-tab-pane label="待处理仓" name="5">
          <WarehouseInventory :warehouse-id="5" warehouse-name="待处理仓" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WarehouseInventory from './WarehouseInventory.vue'

const activeTab = ref('1')

const handleTabChange = () => {
  // 切换标签时会重新加载对应的仓库库存
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
