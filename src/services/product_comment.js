import { stringify } from 'qs';
import request from '../utils/request';

export async function queryList(params) {
  let url = `/api/Product_CommentByPage`;
  if (params) {
    url = `/api/Product_CommentByPage?${stringify(params)}`;
  }
  return request(url);
}

// export async function addService(params) {
//   return request('/api/AddProductIssue', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function deleteService(params) {
  return request('/api/DeleteProductComment/' + params.commentId, {
    method: 'DELETE',
    body: params,
  });
}

export async function batchdeleteService(params) {
  return request('/api/BatchDeleteProductComment', {
    method: 'DELETE',
    body: { commentIds: params.commentIds.split(',') },
  });
}

// export async function updateService(params) {
//   return request('/api/UpdateProductIssue/' + params.issueId, {
//     method: 'PUT',
//     body: params,
//   });
// }

// export async function answerService(params) {
//   console.log(params);
//   return request('/api/AnswerProductIssue/' + params.issueId, {
//     method: 'PUT',
//     body: params,
//   });
// }
