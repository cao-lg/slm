import request from '@/utils/request';

export interface Product {
  productID?: number;
  productCode: string;
  productName: string;
  category?: string;
  unit?: string;
  spec?: string;
  price?: number;
  cost?: number;
  status: number;
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

export const getProductList = (params: PageParams) => {
  return request.get<any, { data: PageResult<Product> }>('/product/products', { params });
};

export const getProduct = (id: number) => {
  return request.get<any, { data: Product }>(`/product/products/${id}`);
};

export const addProduct = (data: Product) => {
  return request.post('/product/products', data);
};

export const updateProduct = (data: Product) => {
  return request.put(`/product/products/${data.productID}`, data);
};

export const deleteProduct = (id: number) => {
  return request.delete(`/product/products/${id}`);
};
