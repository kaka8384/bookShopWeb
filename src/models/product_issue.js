import {
  queryList,
  deleteService,
  batchdeleteService,
  answerService,
} from '../services/product_issue';

export default {
  namespace: 'product_issue',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    // categories:[]
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
    // *fetchall({ payload }, { call, put }) {
    // const response = yield call(queryAll, payload);
    // if(response.success)
    // {
    //     yield put({
    //         type: 'save',
    //         payload: response,
    //         tag:'queryall'
    //     });
    // }
    // },
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
    *answer({ payload, callback }, { call, put }) {
      const response = yield call(answerService, payload);
      if (response.success) {
        yield put({
          type: 'save',
          payload: response,
          tag: 'answer',
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
        // case 'queryall':
        // {
        //     return {
        //         ...state,
        //         categories: action.payload.categories
        //     };
        // }
        // case 'add':
        // {
        //     state.data.list.unshift(action.payload.category);  //把新增数据添加到原列表中
        //     let returnObject={
        //         ...state,
        //         data: {
        //             list:state.data.list,
        //             pagination: {
        //                 total:state.data.pagination.total+1
        //             },
        //             success:true
        //           }
        //     };
        //     return returnObject;
        // }
        case 'answer': {
          const issue = action.payload.issue;
          const index = state.data.list.findIndex(value => {
            return value._id === issue._id;
          });
          state.data.list.splice(index, 1, issue); //  替换数据
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
              list: state.data.list.filter(item => item._id !== action.payload.issueId),
              pagination: {
                total: state.data.pagination.total - 1,
              },
              success: true,
            },
          };
          return returnObject;
        }
        case 'batchremove': {
          const issueIds = action.payload.issueIds; //  批量删除的分类ID
          const returnObject = {
            ...state,
            data: {
              list: state.data.list.filter(item => issueIds.indexOf(item._id) === -1),
              pagination: {
                total: state.data.pagination.total - issueIds.length,
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
