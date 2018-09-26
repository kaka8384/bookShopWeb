import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/CurrentUser');
}

export async function UserLogout() {
  return request('/api/UserLogout', {
    method: 'POST',
  });
}

export async function UserLogin(params) {
  return request('/api/UserLogin', {
    method: 'POST',
    body: params,
  });
}

export async function queryList(params) {
  let url = `/api/UsersByPage`;
  if (params) {
    url = `/api/UsersByPage?${stringify(params)}`;
  }
  return request(url);
}

export async function addService(params) {
  return request('/api/AddUser', {
    method: 'POST',
    body: params,
  });
}

export async function deleteService(params) {
  return request('/api/DeleteUser/' + params.userId, {
    method: 'DELETE',
  });
}

export async function batchdeleteService(params) {
  return request('/api/BatchDeleteUser', {
    method: 'DELETE',
    body: { userIds: params.userIds.split(',') },
  });
}

export async function updateService(params) {
  return request('/api/UpdateUser/' + params.userId, {
    method: 'PUT',
    body: params.user,
  });
}
