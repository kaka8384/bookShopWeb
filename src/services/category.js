import { stringify } from 'qs';
import request from '../utils/request';

export async function queryList(params) {
  let url = `/api/CatgeoryByPage`;
  if (params) {
    url = `/api/CatgeoryByPage?${stringify(params)}`;
  }
  return request(url);
}

export async function AddCatgeory(params) {
    return request('/api/AddCatgeory', {
      method: 'POST',
      body: params,
    });
  }

  export async function DeleteCatgeory(params) {
    return request('/api/DeleteCatgeory/'+params.cid, {
      method: 'DELETE'
    });
  }

  export async function BatchDeleteCatgeory(params) {
    return request('/api/BatchDeleteCatgeory', {
      method: 'DELETE',
      body:{categoryIds:params.categoryIds.split(",")} 
    });
  }

  export async function UpdateCatgeory(params) {
    return request('/api/UpdateCatgeory/'+params.cid, {
      method: 'PUT',
      body: params
    });
  }
