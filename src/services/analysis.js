// import { stringify } from 'qs';
import request from '../utils/request';

//  订单数统计
export async function queryOrdersCount() {
  return request(`/api/OrdersCount`);
}

//    商品数统计
export async function queryProductCount() {
  return request(`/api/ProductCount`);
}

//  用户数统计
export async function queryCustomerCount() {
  return request(`/api/CustomerCount`);
}

//  近7日订单数统计
export async function queryOrdersGroupByCreateDate() {
  return request(`/api/OrdersGroupByCreateDate`);
}

//  销量前10商品
export async function queryTopSales() {
  const url = `/api/ProductByPage?queryType=2&currentPage=1&pageSize=10&sorter=salesCount_descend`;
  return request(url);
}

//  收藏前10商品
export async function queryTopCollect() {
  const url = `/api/ProductByPage?queryType=2&currentPage=1&pageSize=10&sorter=collectCount_descend`;
  return request(url);
}

//  评论前10商品
export async function queryTopComment() {
  const url = `/api/ProductByPage?queryType=2&currentPage=1&pageSize=10&sorter=commentCount_descend`;
  return request(url);
}
