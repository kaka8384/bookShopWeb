import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '工作台',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '数据统计',
        path: 'analysis',
      },
    ],
  },
  {
    name: '业务管理',
    icon: 'table',
    path: 'bussiness',
    children: [
      {
        name: '分类管理',
        path: 'category',
      },
      {
        name: '商品管理',
        path: 'product',
      },
      {
        name: '订单管理',
        path: 'order',
      },
      {
        name: '评论管理',
        path: 'product_comment',
      },
      {
        name: '问答管理',
        path: 'product_issue',
      },
      {
        name: '客户管理',
        path: 'customer',
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'table',
    path: 'system',
    children: [
      {
        name: '用户管理',
        path: 'user',
      },
      // {
      //   name: '日志管理',
      //   path: 'log',
      // },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      // {
      //   name: '注册',
      //   path: 'register',
      // },
      // {
      //   name: '注册结果',
      //   path: 'register-result',
      // },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
