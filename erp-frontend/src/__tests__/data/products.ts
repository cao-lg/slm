import type { Product } from '@/api/product'

export const products: Product[] = [
  {
    productID: 1,
    productCode: 'PROD001',
    productName: '智能控制器A系列',
    category: '控制器',
    unit: '台',
    spec: 'AC220V/50Hz',
    price: 1500,
    cost: 800,
    status: 1
  },
  {
    productID: 2,
    productCode: 'PROD002',
    productName: '智能控制器B系列',
    category: '控制器',
    unit: '台',
    spec: 'DC24V',
    price: 1200,
    cost: 650,
    status: 1
  },
  {
    productID: 3,
    productCode: 'PROD003',
    productName: '传感器模块',
    category: '传感器',
    unit: '个',
    spec: '工业级',
    price: 500,
    cost: 250,
    status: 1
  },
  {
    productID: 4,
    productCode: 'PROD004',
    productName: '电源适配器',
    category: '配件',
    unit: '个',
    spec: '12V/5A',
    price: 120,
    cost: 60,
    status: 1
  },
  {
    productID: 5,
    productCode: 'PROD005',
    productName: '通讯模块',
    category: '通讯',
    unit: '个',
    spec: 'RS485',
    price: 300,
    cost: 150,
    status: 1
  },
  {
    productID: 6,
    productCode: 'PROD006',
    productName: '显示屏HMI',
    category: '显示',
    unit: '台',
    spec: '7英寸',
    price: 800,
    cost: 400,
    status: 1
  },
  {
    productID: 7,
    productCode: 'PROD007',
    productName: '继电器模块',
    category: '继电器',
    unit: '个',
    spec: '8路',
    price: 200,
    cost: 100,
    status: 0
  }
]
