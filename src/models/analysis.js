import {
  queryOrdersCount,
  queryProductCount,
  queryCustomerCount,
  queryOrdersGroupByCreateDate,
  queryTopSales,
  queryTopCollect,
  queryTopComment,
} from '../services/analysis';

export default {
  namespace: 'analysis',

  state: {
    orderCount: 0,
    productCount: 0,
    customerCount: 0,
    topSalesdata: {
      list: [],
      pagination: {},
    },
    topCollectdata: {
      list: [],
      pagination: {},
    },
    topCommentdata: {
      list: [],
      pagination: {},
    },
    newOrderGroup: [],
  },

  effects: {
    *fetchOrderCount({ payload }, { call, put }) {
      const response = yield call(queryOrdersCount, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'orderCount',
        });
      }
    },
    *fetchProductCount({ payload }, { call, put }) {
      const response = yield call(queryProductCount, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'productCount',
        });
      }
    },
    *fetchCustomerCount({ payload }, { call, put }) {
      const response = yield call(queryCustomerCount, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'customerCount',
        });
      }
    },
    *fetchTopSales({ payload }, { call, put }) {
      const response = yield call(queryTopSales, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'topSales',
        });
      }
    },
    *fetchTopCollect({ payload }, { call, put }) {
      const response = yield call(queryTopCollect, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'topCollect',
        });
      }
    },
    *fetchTopComment({ payload }, { call, put }) {
      const response = yield call(queryTopComment, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'topComment',
        });
      }
    },
    *fetchOrderByDate({ payload }, { call, put }) {
      const response = yield call(queryOrdersGroupByCreateDate, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'orderByDate',
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      switch (action.tag) {
        case 'orderCount': {
          return {
            ...state,
            orderCount: action.payload.count,
          };
        }
        case 'productCount': {
          return {
            ...state,
            productCount: action.payload.count,
          };
        }
        case 'customerCount': {
          return {
            ...state,
            customerCount: action.payload.count,
          };
        }
        case 'topSales': {
          return {
            ...state,
            topSalesdata: action.payload,
          };
        }
        case 'topCollect': {
          return {
            ...state,
            topCollectdata: action.payload,
          };
        }
        case 'topComment': {
          return {
            ...state,
            topCommentdata: action.payload,
          };
        }
        case 'orderByDate': {
          return {
            ...state,
            newOrderGroup: action.payload.result,
          };
        }
      }
    },
  },
};
