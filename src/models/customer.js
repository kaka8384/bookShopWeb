import {
  queryList,
  cancelService,
  batchcancelService,
  openService,
  batchopenService,
} from '../services/customer';

export default {
  namespace: 'customer',

  state: {
    data: {
      list: [],
      pagination: {},
    },
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
    *cancel({ payload, callback }, { call, put }) {
      const response = yield call(cancelService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'cancel',
        });
      }
      if (callback) callback();
    },
    *open({ payload, callback }, { call, put }) {
      const response = yield call(openService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'open',
        });
      }
      if (callback) callback();
    },
    *batchcancel({ payload, callback }, { call, put }) {
      const response = yield call(batchcancelService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'batchcancel',
          param: { isActive: false },
        });
      }
      if (callback) callback();
    },
    *batchopen({ payload, callback }, { call, put }) {
      const response = yield call(batchopenService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'batchopen',
          param: { isActive: true },
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
        case 'cancel':
        case 'open': {
          const customer = action.payload.customer;
          const index = state.data.list.findIndex(value => {
            return value._id === customer._id;
          });
          state.data.list.splice(index, 1, customer); //  替换数据
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

        case 'batchopen':
        case 'batchcancel': {
          const customerIds = action.payload.customerIds; //  批量注销的客户ID
          state.data.list.map(item => {
            if (customerIds.indexOf(item._id) !== -1) {
              item.isActive = action.param.isActive;
            }
            return item;
          });
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
      }
    },
  },
};
