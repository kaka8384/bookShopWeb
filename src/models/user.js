import {
  queryList,
  addService,
  deleteService,
  batchdeleteService,
  updateService,
  queryCurrent,
} from '../services/user';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    list: [],
    currentUser: {},
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
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
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
        case 'add': {
          state.data.list.unshift(action.payload.user); //  把新增数据添加到原列表中
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
          const user = action.payload.user;
          const index = state.data.list.findIndex(value => {
            return value._id === user._id;
          });
          state.data.list.splice(index, 1, user); //  替换数据
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
              list: state.data.list.filter(item => item._id !== action.payload.userId),
              pagination: {
                total: state.data.pagination.total - 1,
              },
              success: true,
            },
          };
          return returnObject;
        }
        case 'batchremove': {
          const userIds = action.payload.userIds; //  批量删除的管理员ID
          const returnObject = {
            ...state,
            data: {
              list: state.data.list.filter(item => userIds.indexOf(item._id) === -1),
              pagination: {
                total: state.data.pagination.total - userIds.length,
              },
              success: true,
            },
          };
          return returnObject;
        }
      }
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
