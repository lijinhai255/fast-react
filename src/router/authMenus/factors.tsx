/*
 * @@description:排放因子路由
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-16 14:24:03
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 17:27:48
 */
import { lazy } from 'react';

import { Routes } from '../config';
import { RouteMaps } from '../utils/enums';
import { routeTypeNameRender } from '../utils/index';

export const factorRoute: Routes[] = [
  {
    path: RouteMaps.factor,
    meta: {
      title: '排放因子库',
      icon: 'icon-icon-wodepaifangyinziku',
    },
    children: [
      {
        path: RouteMaps.factorList,
        meta: {
          title: '排放因子',
        },
        component: lazy(() => import('@views/Factors')),
        children: [
          {
            path: RouteMaps.factorInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('排放因子'),
            },
            component: lazy(() => import('@views/Factors/Info')),
          },
        ],
      },
      {
        path: RouteMaps.factorDefaultValues,
        meta: {
          title: '行业缺省值',
        },
        component: lazy(() => import('@views/Factors/factorDefaultValues')),
        children: [
          {
            path: RouteMaps.factorDefaultValuesManage,
            meta: {
              showInMenu: false,
              title: '缺省值管理',
            },
            component: lazy(
              () => import('@views/Factors/factorDefaultValues/Info'),
            ),
          },
          {
            path: RouteMaps.factorDefaultValuesAdd,
            meta: {
              showInMenu: false,
              title: '新增缺省值',
            },
            component: lazy(
              () => import('@views/Factors/factorDefaultValues/Add'),
            ),
          },
          {
            path: RouteMaps.factorDefaultValuesInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('缺省值'),
            },
            component: lazy(
              () => import('@views/Factors/factorDefaultValues/Info'),
            ),
          },
        ],
      },
    ],
  },
];
