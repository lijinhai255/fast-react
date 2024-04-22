import { ComponentType, lazy } from 'react';

import { ECARoute } from './ECAccount/index';
import { basicRoute } from './authMenus/basic-route';
import { carbonDataRoute } from './authMenus/carbonData';
import { carbonFootPrintRoute } from './authMenus/carbonFootPrint';
import { factorRoute } from './authMenus/factors';
import { industryCarbonAccountingRoute } from './authMenus/industryCarbonAccounting';
import { supplyChainCarbonManagementRoute } from './authMenus/supplyChainCarbonManagement';
import { CARoute } from './carbonAccount/index';
import { carbonFootprintLCARoute } from './carbonFootprintLCA';
import { RouteMaps } from './utils/enums';

export interface RouteBase {
  // 路由路径
  path: string;
  // 路由组件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: ComponentType<any>;
  // 路由信息
  meta: RouteMeta;
  orderNum?: number;
}

export interface RouteMeta {
  title: string | ((location?: Location) => string);
  icon?: string;
  // 是否校验权限, false 为不校验, 不存在该属性或者为true 为校验, 子路由会继承父路由的 auth 属性
  auth?: boolean;
  // 302 跳转
  redirect?: string;
  /** 是否在菜单栏展示 undefined 也会视为 true，只有false 视为 false */
  showInMenu?: boolean;
}

export interface Routes extends RouteBase {
  children?: Routes[];
}

/**
 * routes 第一级路由负责最外层的路由渲染，比如 userLayout 和 Layout 的区分
 * 所有系统内部存在的页面路由都要在此地申明引入，而菜单栏的控制是支持异步请求控制的
 * 有权限控制的路由
 */
export const menuRoutes: Routes[] = [
  {
    path: RouteMaps.home,
    component: lazy(() => import('@views/dashborad/intro')),
    meta: {
      title: '工作台',
      icon: 'icon-icon-gongzuotai',
    },
    children: [
      {
        path: RouteMaps.profile,
        component: lazy(() => import('@views/dashborad/AccountManage')),
        meta: {
          title: '账号管理',
          showInMenu: false,
        },
      },
      {
        path: RouteMaps.message,
        component: lazy(() => import('@views/dashborad/Message')),
        meta: {
          title: '消息中心',
          showInMenu: false,
        },
      },
    ],
  },
  /** 产品碳足迹LCA升级版 */
  ...carbonFootprintLCARoute,
  /** 碳数据 */
  ...carbonDataRoute,
  /** 碳核算行业版 */
  ...industryCarbonAccountingRoute,
  /** 供应链碳管理 */
  ...supplyChainCarbonManagementRoute,
  /** 产品碳足迹路由 */
  ...carbonFootPrintRoute,
  // 因子路由
  ...factorRoute,
  // 基础框架路由
  ...basicRoute,
  ...ECARoute,
  // 员工碳账户
  ...CARoute,
];

/** 没有layout子集 的路由 */
export const baseRoute: Routes[] = [
  {
    path: RouteMaps.layout,
    component: lazy(() => import('@src/layout/index')),
    meta: {
      title: '系统',
      auth: false,
      redirect: RouteMaps.dashborad,
    },
    // children: [...menuRoutes],
  },
  {
    path: RouteMaps.login,
    component: lazy(() => import('@views/base/Login')),
    meta: {
      title: '登录',
      auth: false,
    },
  },
  {
    path: RouteMaps.reactDiagrams,
    component: lazy(() => import('@views/base/ReactDiagrams')),
    meta: {
      title: '登录',
      auth: false,
    },
  },
  {
    path: RouteMaps.reactAntvX6,
    component: lazy(() => import('@views/base/ReactAntvX6')),
    meta: {
      title: '登录',
      auth: false,
    },
  },
  {
    path: RouteMaps.ocrImage,
    component: lazy(() => import('@views/base/OcrImage')),
    meta: {
      title: '图片识别',
      auth: false,
    },
  },
  {
    path: RouteMaps.changePWD,
    component: lazy(() => import('@views/base/ChangePWD')),
    meta: {
      title: '密码修改',
      auth: true,
    },
  },
  {
    path: RouteMaps.error,
    meta: {
      title: '错误页面',
      auth: false,
      redirect: RouteMaps.error404,
    },
    children: [
      {
        path: RouteMaps.error404,
        component: lazy(() => import('@views/error/404')),
        meta: {
          auth: false,
          title: '页面不存在',
        },
      },
      {
        path: RouteMaps.error403,
        component: lazy(() => import('@views/error/403')),
        meta: {
          auth: false,
          title: '暂无权限',
        },
      },
    ],
  },
  {
    path: '/',
    meta: {
      title: '',
      auth: false,
      redirect: RouteMaps.home,
    },
  },
  {
    path: '*',
    meta: {
      title: '错误页面',
      auth: false,
      redirect: RouteMaps.error404,
    },
  },
];

/**
 * 所有的路由
 */
const routes = baseRoute.map(r => {
  if (r.path === RouteMaps.layout) {
    // layout 路由添加子路由
    return {
      ...r,
      children: [...menuRoutes],
    };
  }
  return r;
});

export default routes;
