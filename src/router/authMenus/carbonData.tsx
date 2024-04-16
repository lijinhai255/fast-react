/**
 * @description 碳数据路由
 */
import { lazy } from 'react';

import { Routes } from '../config';
import { DataRouteMaps } from '../utils/carbonDataEnums';

export const carbonDataRoute: Routes[] = [
  {
    path: DataRouteMaps.carbonData,
    meta: {
      title: '碳数据',
      icon: 'icon-icon_zhibiaoguanli',
    },
    children: [
      {
        path: DataRouteMaps.enterpriseCarbonAccounting,
        meta: {
          title: '企业碳核算',
        },
        component: lazy(
          () => import('@views/carbonData/enterpriseCarbonAccounting'),
        ),
      },
    ],
  },
];
