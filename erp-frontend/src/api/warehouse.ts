import request from '@/utils/request'

export interface Warehouse {
  warehouseID?: number
  warehouseCode: string
  warehouseName: string
  type: string
  location?: string
  manager?: string
  status: number
  createDate?: string
}

export interface InventoryVO {
  inventoryID?: number
  warehouseID: number
  productID: number
  productName?: string
  productCode?: string
  unit?: string
  spec?: string
  quantity: number
  unitCost: number
  location?: string
  updateDate?: string
}

export interface TransferNote {
  transferID?: number
  transferNo: string
  fromWarehouseID: number
  fromWarehouseName?: string
  toWarehouseID: number
  toWarehouseName?: string
  transferDate?: string
  status: string
  creator?: string
  createDate?: string
  updateDate?: string
  remark?: string
}

export interface TransferNoteDetail {
  detailID?: number
  transferID?: number
  productID: number
  productName?: string
  unit?: string
  quantity: number
  remark?: string
  availableQuantity?: number
}

export interface TransferNoteRequest {
  note: TransferNote
  details: TransferNoteDetail[]
}

export interface DeliveryNote {
  deliveryID?: number
  deliveryNo: string
  soID?: number
  orderNo?: string
  customerID?: number
  customerName?: string
  deliveryDate?: string
  status: string
  carrier?: string
  trackingNo?: string
  totalAmount: number
  creator?: string
  createDate?: string
  updateDate?: string
  remark?: string
}

export interface DeliveryNoteDetail {
  detailID?: number
  deliveryID?: number
  productID: number
  productName?: string
  unit?: string
  orderQuantity?: number
  deliveredQuantity?: number
  remainingQuantity?: number
  quantity: number
  price: number
  amount: number
  remark?: string
}

export interface DeliveryNoteRequest {
  note: DeliveryNote
  details: DeliveryNoteDetail[]
}

export interface PickNote {
  pickID?: number
  pickNo: string
  productionPlanID?: number
  planNo?: string
  warehouseID?: number
  warehouseName?: string
  pickDate?: string
  status: string
  picker?: string
  createDate?: string
  updateDate?: string
  remark?: string
}

export interface PickNoteDetail {
  detailID?: number
  pickID?: number
  productID: number
  productName?: string
  unit?: string
  quantity: number
  remark?: string
}

export interface PickNoteRequest {
  note: PickNote
  details: PickNoteDetail[]
}

export interface ReturnNote {
  returnID?: number
  returnNo: string
  sourceType?: number
  sourceID?: number
  sourceNo?: string
  customerID?: number
  customerName?: string
  warehouseID?: number
  warehouseName?: string
  returnDate?: string
  status: string
  totalAmount: number
  creator?: string
  createDate?: string
  updateDate?: string
  remark?: string
}

export interface ReturnNoteDetail {
  detailID?: number
  returnID?: number
  productID: number
  productName?: string
  unit?: string
  quantity: number
  price: number
  amount: number
  remark?: string
}

export interface ReturnNoteRequest {
  note: ReturnNote
  details: ReturnNoteDetail[]
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

export interface InventoryInRequest {
  warehouseID: number
  productID: number
  quantity: number
  unitCost: number
  location?: string
}

export interface InventoryOutRequest {
  warehouseID: number
  productID: number
  quantity: number
}

export interface PickInventoryOutRequest {
  warehouseID: number
  materials: {
    materialID: number
    materialName: string
    quantity: number
  }[]
}

export interface SalesOrder {
  soID?: number
  orderNo: string
  customerID: number
  customerName?: string
  orderDate?: string
  deliveryDate?: string
  totalAmount: number
  status: string
}

export interface SalesOrderDetail {
  detailID?: number
  soID?: number
  productID: number
  productName?: string
  unit?: string
  quantity: number
  deliveredQuantity?: number
  price: number
  amount: number
}

export interface ProductionPlan {
  productionPlanID?: number
  planNo: string
  productID?: number
  productName?: string
  plannedQuantity?: number
  recipeID?: number
  recipeName?: string
  status: string
  plannedStartDate?: string
  plannedEndDate?: string
}

export interface RecipeMaterial {
  materialID: number
  materialName: string
  materialCode?: string
  unit: string
  recipeQuantity: number
  wasteRate?: number
}

export interface PickQuantityInfo {
  materialID: number
  totalRequired: number
  totalPicked: number
  remainingQuantity: number
}

export const getWarehouseList = () => {
  return request.get<any, { data: Warehouse[] }>('/warehouse/list')
}

export const getWarehouseInventory = (warehouseId: number, params: PageParams) => {
  return request.get<any, { data: PageResult<InventoryVO> }>(`/warehouse/${warehouseId}/inventory`, { params })
}

export const inventoryIn = (data: InventoryInRequest) => {
  return request.post('/warehouse/inventory/in', data)
}

export const inventoryOut = (data: InventoryOutRequest) => {
  return request.post('/warehouse/inventory/out', data)
}

export const getTransferNoteList = (params: PageParams) => {
  return request.get<any, { data: PageResult<TransferNote> }>('/warehouse/transfers', { params })
}

export const getTransferNote = (id: number) => {
  return request.get<any, { data: TransferNote }>(`/warehouse/transfers/${id}`)
}

export const getTransferNoteDetails = (id: number) => {
  return request.get<any, { data: TransferNoteDetail[] }>(`/warehouse/transfers/${id}/details`)
}

export const addTransferNote = (data: TransferNoteRequest) => {
  return request.post('/warehouse/transfers', data)
}

export const updateTransferNote = (data: TransferNoteRequest) => {
  return request.put(`/warehouse/transfers/${data.note.transferID}`, data)
}

export const deleteTransferNote = (id: number) => {
  return request.delete(`/warehouse/transfers/${id}`)
}

export const approveTransferNote = (id: number) => {
  return request.put(`/warehouse/transfers/${id}/approve`)
}

export const getTransferInventory = (warehouseId: number, productId: number) => {
  return request.get<any, { data: number }>(`/warehouse/transfers/inventory/${warehouseId}/${productId}`)
}

export const getDeliveryNoteList = (params: PageParams) => {
  return request.get<any, { data: PageResult<DeliveryNote> }>('/warehouse/deliveries', { params })
}

export const getDeliveryNote = (id: number) => {
  return request.get<any, { data: DeliveryNote }>(`/warehouse/deliveries/${id}`)
}

export const getDeliveryNoteDetails = (id: number) => {
  return request.get<any, { data: DeliveryNoteDetail[] }>(`/warehouse/deliveries/${id}/details`)
}

export const addDeliveryNote = (data: DeliveryNoteRequest) => {
  return request.post('/warehouse/deliveries', data)
}

export const updateDeliveryNote = (data: DeliveryNoteRequest) => {
  return request.put(`/warehouse/deliveries/${data.note.deliveryID}`, data)
}

export const deleteDeliveryNote = (id: number) => {
  return request.delete(`/warehouse/deliveries/${id}`)
}

export const shipDeliveryNote = (id: number) => {
  return request.put(`/warehouse/deliveries/${id}/ship`)
}

export const getSalesOrdersForDelivery = () => {
  return request.get<any, { data: SalesOrder[] }>('/warehouse/deliveries/sales-orders')
}

export const getSalesOrderDetailsForDelivery = (id: number) => {
  return request.get<any, { data: SalesOrderDetail[] }>(`/warehouse/deliveries/sales-orders/${id}/details`)
}

export const getPickNoteList = (params: PageParams) => {
  return request.get<any, { data: PageResult<PickNote> }>('/warehouse/picks', { params })
}

export const getPickNote = (id: number) => {
  return request.get<any, { data: PickNote }>(`/warehouse/picks/${id}`)
}

export const getPickNoteDetails = (id: number) => {
  return request.get<any, { data: PickNoteDetail[] }>(`/warehouse/picks/${id}/details`)
}

export const addPickNote = (data: PickNoteRequest) => {
  return request.post('/warehouse/picks', data)
}

export const updatePickNote = (data: PickNoteRequest) => {
  return request.put(`/warehouse/picks/${data.note.pickID}`, data)
}

export const deletePickNote = (id: number) => {
  return request.delete(`/warehouse/picks/${id}`)
}

export const approvePickNote = (id: number) => {
  return request.put(`/warehouse/picks/${id}/approve`)
}

export const getProductionPlansForPick = () => {
  return request.get<any, { data: ProductionPlan[] }>('/warehouse/picks/production-plans')
}

export const getRecipeMaterialsByPlan = (planID: number) => {
  return request.get<any, { data: RecipeMaterial[] }>(`/warehouse/picks/production-plans/${planID}/recipe-materials`)
}

export const getPickQuantitiesByPlan = (planID: number) => {
  return request.get<any, { data: PickQuantityInfo[] }>(`/warehouse/picks/production-plans/${planID}/pick-quantities`)
}

export const pickInventoryOut = (data: PickInventoryOutRequest) => {
  return request.post('/warehouse/picks/inventory-out', data)
}

export const getReturnNoteList = (params: PageParams) => {
  return request.get<any, { data: PageResult<ReturnNote> }>('/warehouse/returns', { params })
}

export const getReturnNote = (id: number) => {
  return request.get<any, { data: ReturnNote }>(`/warehouse/returns/${id}`)
}

export const getReturnNoteDetails = (id: number) => {
  return request.get<any, { data: ReturnNoteDetail[] }>(`/warehouse/returns/${id}/details`)
}

export const addReturnNote = (data: ReturnNoteRequest) => {
  return request.post('/warehouse/returns', data)
}

export const updateReturnNote = (data: ReturnNoteRequest) => {
  return request.put(`/warehouse/returns/${data.note.returnID}`, data)
}

export const deleteReturnNote = (id: number) => {
  return request.delete(`/warehouse/returns/${id}`)
}

export const approveReturnNote = (id: number) => {
  return request.put(`/warehouse/returns/${id}/approve`)
}

export const returnInventoryIn = (data: ReturnNoteRequest) => {
  return request.post('/warehouse/returns/inventory-in', data)
}

export const getSalesOrdersForReturn = () => {
  return request.get<any, { data: SalesOrder[] }>('/warehouse/returns/sales-orders')
}

export const getSalesOrderDetailsForReturn = (id: number) => {
  return request.get<any, { data: SalesOrderDetail[] }>(`/warehouse/returns/sales-orders/${id}/details`)
}
