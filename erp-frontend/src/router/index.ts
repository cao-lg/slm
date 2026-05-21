import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/components/Layout/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/sales/customer',
        name: 'Customer',
        component: () => import('@/views/sales/CustomerList.vue'),
        meta: { title: '客户管理' }
      },
      {
        path: '/sales/customer/:id',
        name: 'CustomerDetail',
        component: () => import('@/views/sales/CustomerDetail.vue'),
        meta: { title: '客户详情' }
      },
      {
        path: '/sales/quotation',
        name: 'Quotation',
        component: () => import('@/views/sales/QuotationList.vue'),
        meta: { title: '报价单' }
      },
      {
        path: '/sales/quotation/:id',
        name: 'QuotationDetail',
        component: () => import('@/views/sales/QuotationDetail.vue'),
        meta: { title: '报价单详情' }
      },
      {
        path: '/sales/order',
        name: 'SalesOrder',
        component: () => import('@/views/sales/SalesOrderList.vue'),
        meta: { title: '销售订单' }
      },
      {
        path: '/sales/order/:id',
        name: 'SalesOrderDetail',
        component: () => import('@/views/sales/SalesOrderDetail.vue'),
        meta: { title: '销售订单详情' }
      },
      {
        path: '/sales/summary',
        name: 'ProductSummary',
        component: () => import('@/views/sales/ProductSummary.vue'),
        meta: { title: '产品汇总' }
      },
      {
        path: '/sales/statistics',
        name: 'OrderStatistics',
        component: () => import('@/views/sales/OrderStatistics.vue'),
        meta: { title: '订单统计' }
      },
      {
        path: '/purchase/order',
        name: 'PurchaseOrder',
        component: () => import('@/views/purchase/PurchaseOrderList.vue'),
        meta: { title: '采购订单' }
      },
      {
        path: '/purchase/order/:id',
        name: 'PurchaseOrderDetail',
        component: () => import('@/views/purchase/PurchaseOrderDetail.vue'),
        meta: { title: '采购订单详情' }
      },
      {
        path: '/purchase/material',
        name: 'MaterialList',
        component: () => import('@/views/purchase/MaterialList.vue'),
        meta: { title: '原材料' }
      },
      {
        path: '/purchase/supplier',
        name: 'Supplier',
        component: () => import('@/views/purchase/SupplierList.vue'),
        meta: { title: '供应商管理' }
      },
      {
        path: '/purchase/supplier/:id',
        name: 'SupplierDetail',
        component: () => import('@/views/purchase/SupplierDetail.vue'),
        meta: { title: '供应商详情' }
      },
      {
        path: '/production/plan',
        name: 'ProductionPlan',
        component: () => import('@/views/production/ProductionPlanList.vue'),
        meta: { title: '生产计划' }
      },
      {
        path: '/production/recipe',
        name: 'RecipeList',
        component: () => import('@/views/production/RecipeList.vue'),
        meta: { title: '配方单' }
      },
      {
        path: '/production/statistics',
        name: 'ProductionStatistics',
        component: () => import('@/views/production/ProductionStatistics.vue'),
        meta: { title: '生产统计' }
      },
      {
        path: '/warehouse/inventory',
        name: 'InventoryList',
        component: () => import('@/views/warehouse/InventoryList.vue'),
        meta: { title: '库存管理' }
      },
      {
        path: '/warehouse/workshop',
        name: 'WorkshopInventory',
        component: () => import('@/views/warehouse/WorkshopInventory.vue'),
        meta: { title: '车间仓' }
      },
      {
        path: '/warehouse/product',
        name: 'ProductInventory',
        component: () => import('@/views/warehouse/ProductInventory.vue'),
        meta: { title: '成品仓' }
      },
      {
        path: '/warehouse/material',
        name: 'MaterialInventory',
        component: () => import('@/views/warehouse/MaterialInventory.vue'),
        meta: { title: '材料仓' }
      },
      {
        path: '/warehouse/external',
        name: 'ExternalInventory',
        component: () => import('@/views/warehouse/ExternalInventory.vue'),
        meta: { title: '外仓' }
      },
      {
        path: '/warehouse/pending',
        name: 'PendingInventory',
        component: () => import('@/views/warehouse/PendingInventory.vue'),
        meta: { title: '待处理仓' }
      },
      {
        path: '/warehouse/transfer',
        name: 'TransferNote',
        component: () => import('@/views/warehouse/TransferNoteList.vue'),
        meta: { title: '调拨单' }
      },
      {
        path: '/warehouse/delivery',
        name: 'DeliveryNote',
        component: () => import('@/views/warehouse/DeliveryNoteList.vue'),
        meta: { title: '发货单' }
      },
      {
        path: '/warehouse/pick',
        name: 'PickNote',
        component: () => import('@/views/warehouse/PickNoteList.vue'),
        meta: { title: '领料单' }
      },
      {
        path: '/warehouse/return',
        name: 'ReturnNote',
        component: () => import('@/views/warehouse/ReturnNoteList.vue'),
        meta: { title: '退货单' }
      },
      {
        path: '/product',
        name: 'Product',
        component: () => import('@/views/product/ProductList.vue'),
        meta: { title: '产品管理' }
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/product/ProductDetail.vue'),
        meta: { title: '产品详情' }
      },
      {
        path: '/finance/receivable',
        name: 'Receivable',
        component: () => import('@/views/finance/ReceivableList.vue'),
        meta: { title: '应收管理' }
      },
      {
        path: '/finance/payable',
        name: 'Payable',
        component: () => import('@/views/finance/PayableList.vue'),
        meta: { title: '应付管理' }
      },
      {
        path: '/finance/expense',
        name: 'Expense',
        component: () => import('@/views/finance/ExpenseList.vue'),
        meta: { title: '报销管理' }
      },
      {
        path: '/system/user',
        name: 'User',
        component: () => import('@/views/system/UserList.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/system/message',
        name: 'Message',
        component: () => import('@/views/system/MessageList.vue'),
        meta: { title: '站内通知' }
      },
      {
        path: '/system/password',
        name: 'PasswordChange',
        component: () => import('@/views/system/PasswordChange.vue'),
        meta: { title: '修改密码' }
      },
      {
        path: '/system/interface',
        name: 'InterfaceConfig',
        component: () => import('@/views/system/InterfaceConfig.vue'),
        meta: { title: '界面配置' }
      },
      {
        path: '/system/log',
        name: 'OperationLog',
        component: () => import('@/views/system/OperationLogList.vue'),
        meta: { title: '操作日志' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.path !== '/login' && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/home')
  } else {
    next()
  }
})

export default router
