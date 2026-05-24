import request from '@/utils/request'

export interface Customer {
  customerID?: number
  customerCode: string
  customerName: string
  customerShortName?: string
  province?: string
  city?: string
  deliveryDays?: number
  paymentDays?: number
  creditLimit?: number
  usedCredit?: number
  contact?: string
  phone?: string
  fax?: string
  email?: string
  address?: string
  status: number
}

export interface Quotation {
  quotationID?: number
  quotationNo: string
  customerID: number
  customerName?: string
  quotationDate?: string
  validUntil?: string
  totalAmount: number
  status: string
  creator?: string
  createDate?: string
}

export interface QuotationDetail {
  detailID?: number
  quotationID?: number
  productID: number
  productName?: string
  unit?: string
  customerProductCode?: string
  customerProductName?: string
  ourProductCode?: string
  ourProductName?: string
  quantity: number
  originalPrice?: number
  unitPrice: number
  costPrice?: number
  amount: number
  attachment?: string
  remark?: string
}

export interface QuotationRequest {
  quotation: Quotation
  details: QuotationDetail[]
}

export interface SalesOrder {
  soID?: number
  orderNo: string
  customerID: number
  customerName?: string
  orderDate?: string
  deliveryDate?: string
  totalQuantity?: number
  totalAmount: number
  totalCost?: number
  totalProfit?: number
  remark?: string
  status: string
  creator?: string
  createDate?: string
}

export interface SalesOrderDetail {
  detailID?: number
  soID?: number
  productID: number
  productName?: string
  unit?: string
  customerProductCode?: string
  customerProductName?: string
  ourProductCode?: string
  ourProductName?: string
  quantity: number
  originalPrice?: number
  unitPrice: number
  costPrice?: number
  profit?: number
  amount: number
  remark?: string
}

export interface SalesOrderRequest {
  order: SalesOrder
  details: SalesOrderDetail[]
}

export interface PageParams {
  page: number
  pageSize: number
  [key: string]: any
}

export interface PageResult<T> {
  list: T[]
  total: number
}

// 客户管理API
export const getCustomerList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Customer> }>('/sales/customers', { params })
}

export const getCustomer = (id: number) => {
  return request.get<any, { data: Customer }>(`/sales/customers/${id}`)
}

export const addCustomer = (data: Customer) => {
  return request.post('/sales/customers', data)
}

export const updateCustomer = (data: Customer) => {
  return request.put(`/sales/customers/${data.customerID}`, data)
}

export const deleteCustomer = (id: number) => {
  return request.delete(`/sales/customers/${id}`)
}

// 报价单API
export const getQuotationList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Quotation> }>('/sales/quotations', { params })
}

export const getQuotation = (id: number) => {
  return request.get<any, { data: Quotation }>(`/sales/quotations/${id}`)
}

export const getQuotationDetails = (id: number) => {
  return request.get<any, { data: QuotationDetail[] }>(`/sales/quotations/${id}/details`)
}

export const addQuotation = (data: QuotationRequest) => {
  return request.post('/sales/quotations', data)
}

export const updateQuotation = (data: QuotationRequest) => {
  return request.put(`/sales/quotations/${data.quotation.quotationID}`, data)
}

export const deleteQuotation = (id: number) => {
  return request.delete(`/sales/quotations/${id}`)
}

export const updateQuotationStatus = (id: number, status: string) => {
  return request.put(`/sales/quotations/${id}/status`, null, { params: { status } })
}

export const convertQuotationToOrder = (quotationId: number) => {
  return request.post(`/sales/quotations/${quotationId}/convert`)
}

// 销售订单API
export const getSalesOrderList = (params: PageParams) => {
  return request.get<any, { data: PageResult<SalesOrder> }>('/sales/orders', { params })
}

export const getSalesOrder = (id: number) => {
  return request.get<any, { data: SalesOrder }>(`/sales/orders/${id}`)
}

export const getSalesOrderDetails = (id: number) => {
  return request.get<any, { data: SalesOrderDetail[] }>(`/sales/orders/${id}/details`)
}

export const addSalesOrder = (data: SalesOrderRequest) => {
  return request.post('/sales/orders', data)
}

export const updateSalesOrder = (data: SalesOrderRequest) => {
  return request.put(`/sales/orders/${data.order.soID}`, data)
}

export const deleteSalesOrder = (id: number) => {
  return request.delete(`/sales/orders/${id}`)
}

export const updateSalesOrderStatus = (id: number, status: string) => {
  return request.put(`/sales/orders/${id}/status`, null, { params: { status } })
}
