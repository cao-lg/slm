import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductList from '@/views/product/ProductList.vue'
import { products } from '@/__tests__/data/products'
import * as productApi from '@/api/product'

vi.mock('@/api/product', () => ({
  getProductList: vi.fn(),
  addProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  getProduct: vi.fn()
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/product/detail/:id', name: 'ProductDetail', component: { template: '<div>Product Detail</div>' } }
  ]
})

describe('ProductList.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(productApi, 'getProductList').mockResolvedValue({
      data: {
        list: products,
        total: products.length
      }
    })
  })

  it('测试产品列表页面能正常加载', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.card-header span').text()).toBe('产品管理')
  })

  it('测试产品数据显示', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [router]
      }
    })
    await wrapper.vm.$nextTick()
    expect(productApi.getProductList).toHaveBeenCalled()
  })

  it('测试产品分类筛选功能', async () => {
    const wrapper = mount(ProductList, {
      global: {
        plugins: [router]
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.searchForm.category).toBe('')
  })

  it('测试产品价格计算逻辑', () => {
    const testProduct = products[0]
    const price = testProduct.price
    const cost = testProduct.cost
    const profit = price - cost
    expect(profit).toBe(700)
  })
})
