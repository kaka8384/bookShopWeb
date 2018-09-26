import { stringify } from 'qs';
import request from '../utils/request';

export async function queryList(params) {
  let url = `/api/OrdersByPage?queryType=2`;
  if (params) {
    url = `/api/OrdersByPage??queryType=2&${stringify(params)}`;
  }
  return request(url);
}

export async function updateService(params) {
  return request('/api/UpdateOrder/' + params.orderId, {
    method: 'PUT',
    body: params,
  });
}
