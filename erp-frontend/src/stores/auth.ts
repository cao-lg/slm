import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, login as loginApi, logout as logoutApi } from '@/api/auth'
import { setToken, removeToken, getToken } from '@/utils/storage'

export interface UserInfo {
  userId: number
  username: string
  realName: string
  role: string
  department?: string
  email?: string
  phone?: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(getToken() || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = ref<boolean>(!!token.value)

  const login = async (username: string, password: string) => {
    const res = await loginApi({ username, password })
    token.value = res.data.token
    userInfo.value = res.data.userInfo
    setToken(res.data.token)
    isLoggedIn.value = true
  }

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      userInfo.value = res.data
    } catch (error) {
      logout()
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('logout error:', error)
    } finally {
      token.value = ''
      userInfo.value = null
      removeToken()
      isLoggedIn.value = false
    }
  }

  if (token.value && !userInfo.value) {
    fetchUserInfo()
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    fetchUserInfo
  }
})
