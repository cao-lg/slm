import request from '@/utils/request';

export interface ProductionPlan {
  planId?: number;
  planNo: string;
  productId: number;
  productName: string;
  plannedQuantity: number;
  completedQuantity?: number;
  startDate: string;
  endDate: string;
  responsible: string;
  status: string;
  remark?: string;
  creator?: string;
  createDate?: string;
  updateDate?: string;
  recipeId?: number;
  recipeName?: string;
}

export interface Recipe {
  recipeId?: number;
  recipeCode: string;
  recipeName: string;
  productId: number;
  productName: string;
  version: string;
  status: number;
  remark?: string;
  createDate?: string;
  updateDate?: string;
}

export interface RecipeMaterial {
  id?: number;
  recipeId: number;
  materialId?: number;
  materialIdRef: number;
  materialName: string;
  unit: string;
  quantity: number;
  wasteRate: number;
  unitPrice?: number;
}

export interface ProductionRecord {
  recordId?: number;
  recordNo: string;
  planId: number;
  planNo: string;
  productId: number;
  productName: string;
  quantity: number;
  qualifiedQuantity: number;
  wasteQuantity: number;
  productionDate: string;
  operator: string;
  status: string;
  remark?: string;
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

export const getProductionPlanList = (params: PageParams) => {
  return request.get<any, { data: PageResult<ProductionPlan> }>('/production/plans', { params });
};

export const getProductionPlan = (id: number) => {
  return request.get<any, { data: ProductionPlan }>(`/production/plans/${id}`);
};

export const addProductionPlan = (data: ProductionPlan) => {
  return request.post('/production/plans', data);
};

export const updateProductionPlan = (data: ProductionPlan) => {
  return request.put(`/production/plans/${data.planId}`, data);
};

export const deleteProductionPlan = (id: number) => {
  return request.delete(`/production/plans/${id}`);
};

export const updateProductionPlanStatus = (id: number, status: string) => {
  return request.put(`/production/plans/${id}/status`, { status });
};

export const getRecipeList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Recipe> }>('/production/recipes', { params });
};

export const getRecipe = (id: number) => {
  return request.get<any, { data: Recipe }>(`/production/recipes/${id}`);
};

export const getRecipeMaterials = (id: number) => {
  return request.get<any, { data: RecipeMaterial[] }>(`/production/recipes/${id}/materials`);
};

export const addRecipe = (data: any) => {
  return request.post('/production/recipes', data);
};

export const updateRecipe = (data: any) => {
  return request.put(`/production/recipes/${data.recipeId}`, data);
};

export const deleteRecipe = (id: number) => {
  return request.delete(`/production/recipes/${id}`);
};

export const saveRecipeMaterials = (recipeId: number, materials: RecipeMaterial[]) => {
  return request.post(`/production/recipes/${recipeId}/materials`, { materials });
};

export const getProductionRecordList = (params: PageParams) => {
  return request.get<any, { data: PageResult<ProductionRecord> }>('/production/records', { params });
};

export const getProductionRecord = (id: number) => {
  return request.get<any, { data: ProductionRecord }>(`/production/records/${id}`);
};

export const addProductionRecord = (data: ProductionRecord) => {
  return request.post('/production/records', data);
};

export const updateProductionRecord = (data: ProductionRecord) => {
  return request.put(`/production/records/${data.recordId}`, data);
};

export const deleteProductionRecord = (id: number) => {
  return request.delete(`/production/records/${id}`);
};
