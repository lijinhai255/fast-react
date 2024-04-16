/**
 * @description 产品碳足迹LCA升级版路由
 */
import { lazy } from 'react';

import { Routes } from '../config';
import { routeTypeNameRender } from '../utils/index';
import { LCARouteMaps } from '../utils/lcaEnums';

export const carbonFootprintLCARoute: Routes[] = [
  {
    path: LCARouteMaps.lca,
    meta: {
      title: '产品环境足迹',
      icon: 'icon-icon_foot2',
    },
    children: [
      {
        path: LCARouteMaps.lcaProduction,
        meta: {
          title: '产品信息管理',
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/ProductManagement'),
        ),
      },
      {
        path: LCARouteMaps.lcaModel,
        meta: {
          title: '碳足迹模型',
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/CarbonFootprintModel'),
        ),
        children: [
          {
            path: LCARouteMaps.lcaModelInfo,
            meta: {
              title: () => routeTypeNameRender('碳足迹模型'),
            },
            component: lazy(
              () =>
                import('@/views/carbonFootPrintLCA/CarbonFootprintModel/Info'),
            ),
          },
        ],
      },
      {
        path: LCARouteMaps.lcaReport,
        meta: {
          title: '碳足迹报告',
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/CarbonFootprintReport'),
        ),
      },
      {
        path: LCARouteMaps.lcaProcessLibrary,
        meta: {
          title: '过程库',
        },
        component: lazy(
          () => import('@/views/carbonFootPrintLCA/ProcessesLibrary'),
        ),
        children: [
          {
            path: LCARouteMaps.lcaProcessLibraryInfo,
            meta: {
              title: () => routeTypeNameRender('过程库'),
            },
            component: lazy(
              () => import('@/views/carbonFootPrintLCA/ProcessesLibrary/Info'),
            ),
          },
        ],
      },
    ],
  },
];
