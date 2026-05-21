import request from '@/utils/request';

export interface Supplier {
  supplierID?: number;
  supplierCode: string;
  supplierName: string;
  contact?: string;
  phone?: string;
  fax?: string;
  email?: string;
  address?: string;
  status: number;
}

export interface PurchaseOrder {
  poID?: number;
  poNo: string;
  supplierID: number;
  supplierName?: string;
  orderDate?: string;
  requestedDate?: string;
  receivedDate?: string;
  deliveryDate?: string;
  totalQuantity?: number;
  receivedQuantity?: number;
  remainingQuantity?: number;
  totalAmount: number;
  remark?: string;
  status: string;
  creator?: string;
  createDate?: string;
}

export interface PurchaseOrderDetail {
  detailID?: number;
  poID: number;
  materialID: number;
  materialName?: string;
  unit?: string;
  supplierProductCode?: string;
  supplierProductName?: string;
  ourMaterialCode?: string;
  ourMaterialName?: string;
  quantity: number;
  receivedQuantity?: number;
  remainingQuantity?: number;
  unitPrice: number;
  amount: number;
  remark?: string;
}

export interface Material {
  materialID?: number;
  materialCode: string;
  materialName: string;
  category?: string;
  unit?: string;
  spec?: string;
  cost?: number;
  status?: number;
  createDate?: string;
  updateDate?: string;
  suppliers?: MaterialSupplier[];
}

export interface MaterialSupplier {
  id?: number;
  materialID: number;
  supplierID: number;
  supplierCode?: string;
  supplierName?: string;
  supplierProductCode?: string;
  supplierProductName?: string;
  purchasePrice: number;
  status?: number;
  createDate?: string;
  updateDate?: string;
}

export interface PageParams {
  page: number;
  pageSize: number;
  [key: string]: any;
}

export interface PageResult<T> {
  list: T[];
  total: number;
}

// 供应商管理接口
export const getSupplierList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Supplier> }>('/purchase/suppliers', { params });
};

export const getSupplier = (id: number) => {
  return request.get<any, { data: Supplier }>(`/purchase/suppliers/${id}`);
};

export const addSupplier = (data: Supplier) => {
  return request.post('/purchase/suppliers', data);
};

export const updateSupplier = (data: Supplier) => {
  return request.put(`/purchase/suppliers/${data.supplierID}`, data);
};

export const deleteSupplier = (id: number) => {
  return request.delete(`/purchase/suppliers/${id}`);
};

// 采购订单管理接口
export const getPurchaseOrderList = (params: PageParams) => {
  return request.get<any, { data: PageResult<PurchaseOrder> }>('/purchase/orders', { params });
};

export const getPurchaseOrder = (id: number) => {
  return request.get<any, { data: PurchaseOrder }>(`/purchase/orders/${id}`);
};

export const addPurchaseOrder = (data: PurchaseOrder) => {
  return request.post('/purchase/orders', data);
};

export const updatePurchaseOrder = (data: PurchaseOrder) => {
  return request.put(`/purchase/orders/${data.poID}`, data);
};

export const deletePurchaseOrder = (id: number) => {
  return request.delete(`/purchase/orders/${id}`);
};

export const updatePurchaseOrderStatus = (id: number, status: string) => {
  return request.put(`/purchase/orders/${id}/status`, null, { params: { status } });
};

export const receivePurchaseOrder = (id: number) => {
  return request.put(`/purchase/orders/${id}/receive`);
};

// 原材料管理接口
export const getMaterialList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Material> }>('/purchase/materials', { params });
};

export const getMaterial = (id: number) => {
  return request.get<any, { data: Material }>(`/purchase/materials/${id}`);
};

export const addMaterial = (data: Material) => {
  return request.post('/purchase/materials', data);
};

export const updateMaterial = (data: Material) => {
  return request.put(`/purchase/materials/${data.materialID}`, data);
};

export const deleteMaterial = (id: number) => {
  return request.delete(`/purchase/materials/${id}`);
};

// 原材料供应商关联接口
export const getMaterialSuppliers = (materialId: number) => {
  return request.get<any, { data: MaterialSupplier[] }>(`/purchase/materials/${materialId}/suppliers`);
};

export const addMaterialSupplier = (data: MaterialSupplier) => {
  return request.post('/purchase/material-suppliers', data);
};

export const updateMaterialSupplier = (data: MaterialSupplier) => {
  return request.put(`/purchase/material-suppliers/${data.id}`, data);
};

export const deleteMaterialSupplier = (id: number) => {
  return request.delete(`/purchase/material-suppliers/${id}`);
};
