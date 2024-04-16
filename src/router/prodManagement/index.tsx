/*
 * @@description: 企业碳核算
 */
import { lazy } from 'react';

import { routeTypeNameRender } from '../utils/index';
import { ProRouteMaps } from '../utils/prodEmums';

export const ProdManagementRoutes = [
  {
    path: ProRouteMaps.prodManagement,
    meta: {
      title: '生产运营数据',
    },
    component: lazy(() => import('@views/prodManagement/index')),
    children: [
      {
        path: ProRouteMaps.prodManagementOperationalData,
        meta: {
          title: () => routeTypeNameRender('生产运营数据'),
        },
        component: lazy(() => import('@views/prodManagement/Info/index')),
      },
    ],
  },
];
