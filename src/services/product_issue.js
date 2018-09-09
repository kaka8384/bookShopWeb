import { stringify } from 'qs';
import request from '../utils/request';

export async function queryList(params) {
  let url = `/api/Product_IssueByPage`;
  if (params) {
    url = `/api/ProductByPage?${stringify(params)}`;
  }
  return request(url);
}

// export async function querySingle(params) {
//   let url = `/api/ProductQuery?queryType=2`;
//   if (params) {
//     url = `/api/ProductQuery?queryType=2&pid=${params}`;
//   }
//   return request(url);
// }

export async function addService(params) {
  return request('/api/AddProductIssue', {
    method: 'POST',
    body: params,
  });
}

export async function deleteService(params) {
  return request('/api/DeleteProductIssue/' + params.issueId, {
    method: 'DELETE',
  });
}

export async function batchdeleteService(params) {
  return request('/api/BatchDeleteProductIssue', {
    method: 'DELETE',
    body: { issueIds: params.issueIds.split(',') },
  });
}

export async function updateService(params) {
  return request('/api/UpdateProductIssue/' + params.issueId, {
    method: 'PUT',
    body: params.issue,
  });
}

export async function answerService(params) {
  return request('/api/AnswerProductIssue/' + params.issueId, {
    method: 'PUT',
    body: params.issue,
  });
}
