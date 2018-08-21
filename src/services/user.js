import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/CurrentUser');
}

export async function UserLogout() {
  return request('/api/UserLogout', {
    method: 'POST'
  });
}

export async function UserLogin(params) {
  return request('/api/UserLogin', {
    method: 'POST',
    body: params,
  });
}
