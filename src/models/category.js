import {
  queryList,
  queryAll,
  querySingle,
  addService,
  deleteService,
  batchdeleteService,
  updateService,
} from '../services/category';

export default {
  namespace: 'category',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    categories: [],
    item: {},
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
    *fetchall({ payload }, { call, put }) {
      const response = yield call(queryAll, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'queryall',
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
      }
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
        case 'queryall': {
          return {
            ...state,
            categories: action.payload.categories,
          };
        }
        case 'querysingle': {
          return {
            ...state,
            item: action.payload.item,
          };
        }
        case 'add': {
          state.data.list.unshift(action.payload.category); //  把新增数据添加到原列表中
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
          const category = action.payload.category;
          const index = state.data.list.findIndex(value => {
            return value._id === category._id;
          });
          state.data.list.splice(index, 1, category); //  替换数据
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
              list: state.data.list.filter(item => item._id !== action.payload.categoryId),
              pagination: {
                total: state.data.pagination.total - 1,
              },
              success: true,
            },
          };
          return returnObject;
        }
        case 'batchremove': {
          const categoryIds = action.payload.categoryIds; //  批量删除的分类ID
          const returnObject = {
            ...state,
            data: {
              list: state.data.list.filter(item => categoryIds.indexOf(item._id) === -1),
              pagination: {
                total: state.data.pagination.total - categoryIds.length,
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
