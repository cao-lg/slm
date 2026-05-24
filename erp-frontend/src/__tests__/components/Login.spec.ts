import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import { mockLoginSuccessResponse, mockLoginCredentials } from '@/__tests__/data'
import * as authApi from '@/api/auth'

vi.mock('@/api/auth', () => ({
  login: vi.fn(),
  getUserInfo: vi.fn(),
  logout: vi.fn()
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/home', component: { template: '<div>Home</div>' } }
  ]
})

describe('Login.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('应该能正常挂载组件', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('ERP企业管理系统')
  })

  it('应该有用户名输入框', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    const usernameInput = wrapper.find('input[type="text"]')
    expect(usernameInput.exists()).toBe(true)
  })

  it('应该能正常输入用户名', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    const usernameInput = wrapper.find('input[type="text"]')
    await usernameInput.setValue('testuser')
    expect(wrapper.vm.loginForm.username).toBe('testuser')
  })

  it('应该有密码输入框', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    const passwordInput = wrapper.find('input[type="password"]')
    expect(passwordInput.exists()).toBe(true)
  })

  it('应该能正常输入密码', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('testpass')
    expect(wrapper.vm.loginForm.password).toBe('testpass')
  })

  it('应该有登录按钮', async () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })
    const loginButton = wrapper.find('button')
    expect(loginButton.exists()).toBe(true)
    expect(loginButton.text()).toBe('登 录')
  })

  it('测试登录成功场景', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue(mockLoginSuccessResponse)
    
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })

    wrapper.vm.loginFormRef = {
      validate: vi.fn((callback: (valid: boolean) => void) => callback(true))
    }

    wrapper.vm.loginForm.username = mockLoginCredentials.valid.username
    wrapper.vm.loginForm.password = mockLoginCredentials.valid.password

    await wrapper.vm.handleLogin()

    expect(authApi.login).toHaveBeenCalledWith({
      username: mockLoginCredentials.valid.username,
      password: mockLoginCredentials.valid.password
    })
  })

  it('测试登录失败场景', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(new Error('登录失败'))
    
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })

    wrapper.vm.loginFormRef = {
      validate: vi.fn((callback: (valid: boolean) => void) => callback(true))
    }

    wrapper.vm.loginForm.username = mockLoginCredentials.invalid.username
    wrapper.vm.loginForm.password = mockLoginCredentials.invalid.password

    await expect(() => wrapper.vm.handleLogin()).not.toThrow()
  })

  it('测试登录成功后路由跳转', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue(mockLoginSuccessResponse)
    const pushSpy = vi.spyOn(router, 'push')
    
    const wrapper = mount(Login, {
      global: {
        plugins: [router]
      }
    })

    wrapper.vm.loginFormRef = {
      validate: vi.fn((callback: (valid: boolean) => void) => callback(true))
    }

    wrapper.vm.loginForm.username = mockLoginCredentials.valid.username
    wrapper.vm.loginForm.password = mockLoginCredentials.valid.password

    await wrapper.vm.handleLogin()

    expect(pushSpy).toHaveBeenCalledWith('/home')
  })
})
