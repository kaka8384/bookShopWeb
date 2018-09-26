import { queryList, updateService } from '../services/order';

export default {
  namespace: 'order',

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

        case 'update': {
          const order = action.payload.order;
          const index = state.data.list.findIndex(value => {
            return value._id === order._id;
          });
          state.data.list.splice(index, 1, order); //  替换数据
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
        //   case 'remove': {
        //     const returnObject = {
        //       ...state,
        //       data: {
        //         list: state.data.list.filter(item => item._id !== action.payload.issueId),
        //         pagination: {
        //           total: state.data.pagination.total - 1,
        //         },
        //         success: true,
        //       },
        //     };
        //     return returnObject;
        //   }
        //   case 'batchremove': {
        //     const issueIds = action.payload.issueIds; //  批量删除的分类ID
        //     const returnObject = {
        //       ...state,
        //       data: {
        //         list: state.data.list.filter(item => issueIds.indexOf(item._id) === -1),
        //         pagination: {
        //           total: state.data.pagination.total - issueIds.length,
        //         },
        //         success: true,
        //       },
        //     };
        //     return returnObject;
        //   }
      }
    },
  },
};
