import { queryList } from '../services/category';

export default {
    namespace: 'category',

    state: {
      data: {
        list: [],
        pagination: {},
      },
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {
        const response = yield call(queryList, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      },
    //   *add({ payload, callback }, { call, put }) {
    //     const response = yield call(addRule, payload);
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //     if (callback) callback();
    //   },
    //   *remove({ payload, callback }, { call, put }) {
    //     const response = yield call(removeRule, payload);
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //     if (callback) callback();
    //   },
    },
  
    reducers: {
      save(state, action) {
        return {
          ...state,
          data: action.payload,
        };
      },
    },
};