import { stringify } from 'qs';
import request from '../utils/request';

export async function queryList(params) {
  let url = `/api/CatgeoryByPage`;
  if (params) {
    url = `/api/CatgeoryByPage?${stringify(params)}`;
  }
  return request(url);
}
