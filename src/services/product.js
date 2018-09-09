import { stringify } from 'qs';
import request from '../utils/request';

export async function queryList(params) {
  let url = `/api/ProductByPage?queryType=2`;
  if (params) {
    url = `/api/ProductByPage?queryType=2&${stringify(params)}`;
  }
  return request(url);
}

export async function querySingle(params) {
  let url = `/api/ProductQuery?queryType=2`;
  if (params) {
    url = `/api/ProductQuery?queryType=2&pid=${params}`;
  }
  return request(url);
}

export async function addService(params) {
  return request('/api/AddProduct', {
    method: 'POST',
    body: params,
  });
}

export async function deleteService(params) {
  return request('/api/DeleteProduct/' + params.pid, {
    method: 'DELETE',
  });
}

export async function batchdeleteService(params) {
  return request('/api/BatchDeleteProduct', {
    method: 'DELETE',
    body: { productIds: params.productIds.split(',') },
  });
}

export async function updateService(params) {
  return request('/api/UpdateProduct/' + params.pid, {
    method: 'PUT',
    body: params.product,
  });
}
