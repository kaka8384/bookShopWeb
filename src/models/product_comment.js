import { queryList, deleteService, batchdeleteService } from '../services/product_comment';

export default {
  namespace: 'product_comment',

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
    // *add({ payload, callback }, { call, put }) {
    // const response = yield call(addService, payload);
    // if(response.success)
    // {
    //     yield put({
    //         type: 'save',
    //         payload: response,
    //         tag:'add'
    //     });
    // }
    // if (callback) callback();
    // },

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

        //   case 'answer': {
        //     const issue = action.payload.issue;
        //     const index = state.data.list.findIndex(value => {
        //       return value._id === issue._id;
        //     });
        //     state.data.list.splice(index, 1, issue); //  替换数据
        //     const returnObject = {
        //       ...state,
        //       data: {
        //         list: state.data.list,
        //         pagination: {
        //           total: state.data.pagination.total,
        //         },
        //         success: true,
        //       },
        //     };
        //     return returnObject;
        //   }
        case 'remove': {
          const returnObject = {
            ...state,
            data: {
              list: state.data.list.filter(item => item._id !== action.payload.commentId),
              pagination: {
                total: state.data.pagination.total - 1,
              },
              success: true,
            },
          };
          return returnObject;
        }
        case 'batchremove': {
          const commentIds = action.payload.commentIds; //  批量删除的评论ID
          const returnObject = {
            ...state,
            data: {
              list: state.data.list.filter(item => commentIds.indexOf(item._id) === -1),
              pagination: {
                total: state.data.pagination.total - commentIds.length,
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
