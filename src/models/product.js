import { queryList,addService,deleteService,batchdeleteService,updateService } from '../services/product';


export default {
  namespace: 'product',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      if(response.success)
      {
        yield put({
            type: 'save',
            payload: response,
            tag:'query'
          });
      }
    },
    *add({ payload, callback }, { call, put }) {
    const response = yield call(addService, payload);
    if(response.success)
    {
        yield put({
            type: 'save',
            payload: response,
            tag:'add'
        });
    }
    if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
        const response = yield call(updateService, payload);
        if(response.success)
        {
            yield put({
                type: 'save',
                payload: response,
                tag:'update'
            });
        }
        if (callback) callback();
        },
    *remove({ payload, callback }, { call, put }) {
    const response = yield call(deleteService, payload);
    if(response.success)
    {
        yield put({
            type: 'save',
            payload: response,
            tag:'remove'
        });
    }
    if (callback) callback();
    },
    *batchremove({ payload, callback }, { call, put }) {
        const response = yield call(batchdeleteService, payload);
        if(response.success)
        {
            yield put({
                type: 'save',
                payload: response,
                tag:'batchremove'
            });
        }
        if (callback) callback();
        },
  },

  reducers: {
    save(state, action) {
        switch (action.tag)
        {
            case 'query':
            {
                return {
                    ...state,
                    data: action.payload,
                };
            }
            case 'add':
            {
                state.data.list.unshift(action.payload.product);  //把新增数据添加到原列表中
                let returnObject={
                    ...state,
                    data: {
                        list:state.data.list,
                        pagination: {
                            total:state.data.pagination.total+1
                        },
                        success:true
                      }
                };
                return returnObject;
            }
            case 'update':
            {
                let product=action.payload.product;
                let index=state.data.list.findIndex(function(value, index, arr) {
                    return value._id===product._id;
                  });
                state.data.list.splice(index,1,product); //替换数据
                let returnObject={
                    ...state,
                    data: {
                        list:state.data.list,
                        pagination: {
                            total:state.data.pagination.total
                        },
                        success:true
                      }
                };
                return returnObject;
            }
            case 'remove':
            {
                let returnObject={
                    ...state,
                    data: {
                        list:state.data.list.filter(item => item._id!=action.payload.productId),
                        pagination: {
                            total:state.data.pagination.total-1
                        },
                        success:true
                      }
                };
                return returnObject;
            }
            case 'batchremove':
            {
                let productIds=action.payload.productIds; //批量删除的分类ID
                let returnObject={
                    ...state,
                    data: {
                        list:state.data.list.filter(item => productIds.indexOf(item._id)===-1),
                        pagination: {
                            total:state.data.pagination.total-productIds.length
                        },
                        success:true
                      }
                };
                return returnObject;
            }
        }      
    },
  },
};
