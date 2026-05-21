<template>
  <div class="header">
    <div class="left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="route.meta.title !== '首页'">
          {{ route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-icon><UserFilled /></el-icon>
          <span>{{ authStore.userInfo?.realName || authStore.userInfo?.username }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const handleCommand = (command: string) => {
  switch (command) {
    case 'logout':
      authStore.logout()
      router.push('/login')
      break
    case 'password':
      break
    case 'profile':
      break
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    flex: 1;
  }
  
  .right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 10px;
      
      span {
        margin-left: 5px;
      }
    }
  }
}
</style>
