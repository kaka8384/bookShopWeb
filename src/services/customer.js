import { stringify } from 'qs';
import request from '../utils/request';

export async function queryList(params) {
  let url = `/api/CustomerByPage`;
  if (params) {
    url = `/api/CustomerByPage?${stringify(params)}`;
  }
  return request(url);
}

export async function cancelService(params) {
  return request('/api/CancelCustomer/' + params.customerId, {
    method: 'PUT',
    body: params,
  });
}

export async function openService(params) {
  return request('/api/OpenCustomer/' + params.customerId, {
    method: 'PUT',
    body: params,
  });
}

export async function batchcancelService(params) {
  return request('/api/BatchCancelCustomer', {
    method: 'PUT',
    body: { customerIds: params.customerIds.split(',') },
  });
}

export async function batchopenService(params) {
  return request('/api/BatchOpenCustomer', {
    method: 'PUT',
    body: { customerIds: params.customerIds.split(',') },
  });
}
