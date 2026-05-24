import request from '@/utils/request'

export interface Receivable {
  receivableID?: number
  receivableNo: string
  customerID: number
  customerName?: string
  salesOrderID?: number
  salesOrderNo?: string
  totalAmount: number
  receivedAmount: number
  pendingAmount: number
  dueDate?: string
  status: 'unpaid' | 'partial' | 'paid'
  paymentMethod?: string
  lastPaymentDate?: string
  remark?: string
  creator?: string
  createDate?: string
}

export interface Payable {
  payableID?: number
  payableNo: string
  supplierID: number
  supplierName?: string
  purchaseOrderID?: number
  purchaseOrderNo?: string
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  dueDate?: string
  status: string
  paymentMethod?: string
  lastPaymentDate?: string
  remark?: string
  creator?: string
  createDate?: string
}

export interface Expense {
  expenseID?: number
  expenseNo: string
  applicantID: number
  applicantName?: string
  department?: string
  amount: number
  category: string
  description?: string
  status: string
  approverID?: number
  approverName?: string
  approveDate?: string
  approveRemark?: string
  remark?: string
  createDate?: string
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

export interface ReceivableRequest {
  receivable: Receivable
}

export interface PayableRequest {
  payable: Payable
}

export interface ExpenseRequest {
  expense: Expense
}

export interface ApproveRequest {
  approverID: number
  approverName: string
  remark?: string
}

// 应收款API
export const getReceivableList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Receivable> }>('/finance/receivables', { params })
}

export const getReceivable = (id: number) => {
  return request.get<any, { data: Receivable }>(`/finance/receivables/${id}`)
}

export const addReceivable = (data: ReceivableRequest) => {
  return request.post('/finance/receivables', data)
}

export const updateReceivable = (data: ReceivableRequest) => {
  return request.put(`/finance/receivables/${data.receivable.receivableID}`, data.receivable)
}

export const deleteReceivable = (id: number) => {
  return request.delete(`/finance/receivables/${id}`)
}

export const verifyReceivable = (id: number, amount: number, paymentDate: string, paymentMethod: string, remark?: string) => {
  return request.put(`/finance/receivables/${id}/verify`, null, { 
    params: { 
      amount, 
      paymentDate,
      paymentMethod,
      remark 
    } 
  })
}

export const updateReceivableStatus = (id: number, status: string) => {
  return request.put(`/finance/receivables/${id}/status`, null, { params: { status } })
}

// 应付款API
export const getPayableList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Payable> }>('/finance/payables', { params })
}

export const getPayable = (id: number) => {
  return request.get<any, { data: Payable }>(`/finance/payables/${id}`)
}

export const addPayable = (data: PayableRequest) => {
  return request.post('/finance/payables', data)
}

export const updatePayable = (data: PayableRequest) => {
  return request.put(`/finance/payables/${data.payable.payableID}`, data.payable)
}

export const deletePayable = (id: number) => {
  return request.delete(`/finance/payables/${id}`)
}

export const verifyPayable = (id: number, amount: number, paymentDate: string, paymentMethod: string, remark?: string) => {
  return request.put(`/finance/payables/${id}/verify`, null, { params: { amount, paymentDate, paymentMethod, remark } })
}

export const updatePayableStatus = (id: number, status: string) => {
  return request.put(`/finance/payables/${id}/status`, null, { params: { status } })
}

// 报销API
export const getExpenseList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Expense> }>('/finance/expenses', { params })
}

export const getExpense = (id: number) => {
  return request.get<any, { data: Expense }>(`/finance/expenses/${id}`)
}

export const addExpense = (data: ExpenseRequest) => {
  return request.post('/finance/expenses', data)
}

export const updateExpense = (data: ExpenseRequest) => {
  return request.put(`/finance/expenses/${data.expense.expenseID}`, data.expense)
}

export const deleteExpense = (id: number) => {
  return request.delete(`/finance/expenses/${id}`)
}

export const approveExpense = (id: number, data: ApproveRequest) => {
  return request.put(`/finance/expenses/${id}/approve`, data)
}

export const rejectExpense = (id: number, data: ApproveRequest) => {
  return request.put(`/finance/expenses/${id}/reject`, data)
}
