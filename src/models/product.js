import { routerRedux } from 'dva/router';
import {
  queryList,
  addService,
  deleteService,
  batchdeleteService,
  updateService,
  querySingle,
} from '../services/product';

const systemConfig = require('../../system.config');

export default {
  namespace: 'product',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    item: {},
    imagesList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'query',
        });
      }
    },
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(querySingle, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'querysingle',
        });
        yield put(
          routerRedux.push({
            pathname: '/bussiness/productEdit',
            query: { pid: payload },
          })
        );
      }
    },
    *clearItem({ payload }, { put }) {
      yield put({
        type: 'save',
        tag: 'clearItem',
        payload: payload,
      });
      yield put(routerRedux.push('/bussiness/productEdit'));
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'add',
        });
      }
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'update',
        });
      }
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(deleteService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'remove',
        });
      }
      if (callback) callback();
    },
    *batchremove({ payload, callback }, { call, put }) {
      const response = yield call(batchdeleteService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'batchremove',
        });
      }
      if (callback) callback();
    },
    *addfile({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: payload,
        tag: 'addfile',
      });
    },
    *removefile({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: payload,
        tag: 'removefile',
      });
    },
  },

  reducers: {
    save(state, action) {
      switch (action.tag) {
        case 'query': {
          return {
            ...state,
            data: action.payload,
          };
        }
        case 'querysingle': {
          const fileobj = [];
          action.payload.item[0].images.map((item, index) => {
            return fileobj.push({
              uid: index,
              name: item.substr(item.lastIndexOf('/') + 1),
              status: 'done',
              url: item,
              thumbUrl: item,
            });
          });
          return {
            ...state,
            item: action.payload.item,
            imagesList: fileobj,
          };
        }
        case 'clearItem': {
          return {
            ...state,
            item: {},
            imagesList: [],
          };
        }
        case 'addfile': {
          const newfile = action.payload;
          const index = state.imagesList.length + 1;
          const serverUrl = systemConfig.uploadAddress;
          state.imagesList.push({
            uid: index,
            name: newfile.file.name,
            status: 'done',
            url: serverUrl + newfile.file.name,
            thumbUrl: serverUrl + newfile.file.name,
          });
          return {
            ...state,
            imagesList: state.imagesList,
          };
        }
        case 'removefile': {
          const removeIndex = action.payload;
          return {
            ...state,
            imagesList: state.imagesList.filter(item => item.uid !== removeIndex),
          };
        }
        case 'add': {
          state.data.list.unshift(action.payload.product); //  把新增数据添加到原列表中
          const returnObject = {
            ...state,
            data: {
              list: state.data.list,
              pagination: {
                total: state.data.pagination.total + 1,
              },
              success: true,
            },
          };
          return returnObject;
        }
        case 'update': {
          const product = action.payload.product;
          const index = state.data.list.findIndex(value => {
            return value._id === product._id;
          });
          state.data.list.splice(index, 1, product); //  替换数据
          const returnObject = {
            ...state,
            data: {
              list: state.data.list,
              pagination: {
                total: state.data.pagination.total,
              },
              success: true,
            },
          };
          return returnObject;
        }
        case 'remove': {
          const returnObject = {
            ...state,
            data: {
              list: state.data.list.filter(item => item._id !== action.payload.productId),
              pagination: {
                total: state.data.pagination.total - 1,
              },
              success: true,
            },
          };
          return returnObject;
        }
        case 'batchremove': {
          const productIds = action.payload.productIds; //  批量删除的分类ID
          const returnObject = {
            ...state,
            data: {
              list: state.data.list.filter(item => productIds.indexOf(item._id) === -1),
              pagination: {
                total: state.data.pagination.total - productIds.length,
              },
              success: true,
            },
          };
          return returnObject;
        }
      }
    },
  },
};
