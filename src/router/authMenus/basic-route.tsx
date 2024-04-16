/*
 * @@description: 基础框架路由
 */
import { lazy } from 'react';

import { PageTypeInfo, RouteMaps } from '../utils/enums';
import { routeTypeNameRender } from '../utils/index';

export const basicRoute = [
  {
    path: RouteMaps.orgs,
    meta: {
      title: '组织架构',
      icon: 'icon-icon-zuzhiguanli',
    },
    children: [
      {
        path: RouteMaps.orgsManage,
        meta: {
          title: '组织管理',
        },
        component: lazy(
          () => import('@views/dashborad/organizations/OrgManage'),
        ),
        children: [
          {
            path: RouteMaps.orgsAdd,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '新增子组织',
                  [PageTypeInfo.show]: '组织详情',
                  [PageTypeInfo.edit]: '编辑组织',
                  [PageTypeInfo.copy]: '复制组织',
                }),
            },
            component: lazy(
              () => import('@views/dashborad/organizations/OrgInfo'),
            ),
          },
        ],
      },
      {
        path: RouteMaps.users,
        meta: {
          title: '用户管理',
        },
        component: lazy(() => import('@views/dashborad/Users')),
        children: [
          {
            path: RouteMaps.usersInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('用户'),
            },
            component: lazy(() => import('@views/dashborad/Profile')),
          },
        ],
      },
      {
        path: RouteMaps.roles,
        meta: {
          title: '角色管理',
        },
        component: lazy(() => import('@views/dashborad/Role')),
        children: [
          {
            path: RouteMaps.roleInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('角色'),
            },
            component: lazy(() => import('@views/dashborad/Role/Info')),
          },
        ],
      },
    ],
  },
  {
    path: RouteMaps.systemDownload,
    meta: {
      title: '下载管理',
      icon: 'icon-icon-xiazaiguanli',
    },
    component: lazy(() => import('@views/dashborad/Download')),
  },
  // 以下菜单为系统权限管理
  {
    path: RouteMaps.system,
    meta: {
      title: '系统管理',
      icon: 'icon-icon-xitongguanli',
    },
    children: [
      {
        path: RouteMaps.systemSetting,
        meta: {
          title: '系统设置',
        },
        component: lazy(() => import('@views/dashborad/SysSetting')),
      },
      {
        path: RouteMaps.systemApproval,
        meta: {
          title: '审批设置',
        },
        component: lazy(() => import('@views/dashborad/Approval')),
        children: [
          {
            path: RouteMaps.systemApprovalInfo,

            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('审批'),
            },
            component: lazy(() => import('@views/dashborad/Approval/Info')),
          },
        ],
      },
      {
        path: RouteMaps.systemDict,
        meta: {
          title: '数据字典',
        },
        component: lazy(() => import('@views/dashborad/Dicts')),
        children: [
          {
            path: RouteMaps.systemDictCategory,
            meta: {
              title: '分类管理',
            },
            component: lazy(() => import('@views/dashborad/Dicts/Category')),
          },
          {
            path: RouteMaps.systemDictInfo,
            meta: {
              title: '枚举值管理',
            },
            component: lazy(() => import('@views/dashborad/Dicts/Enums')),
          },
        ],
      },
      {
        path: RouteMaps.systemUnits,
        meta: {
          title: '单位换算',
        },
        component: lazy(() => import('@views/dashborad/Units')),
      },
      {
        path: RouteMaps.systemActionLog,
        meta: {
          title: '操作日志',
        },
        component: lazy(() => import('@views/dashborad/ActionsLog')),
      },
      // {
      //   path: RouteMaps.systemAuths,
      //   meta: {
      //     title: '权限管理',
      //   },
      //   component: lazy(() => import('@views/dashborad/routeAuth')),
      // },
    ],
  },
];
