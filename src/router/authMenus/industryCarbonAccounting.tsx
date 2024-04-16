/**
 * @description 碳核算行业版路由
 */

import { lazy } from 'react';

import { Routes } from '../config';
import { PageTypeInfo } from '../utils/enums';
import { ICARouteMaps } from '../utils/icaEnums';
import { routeTypeNameRender } from '../utils/index';

export const industryCarbonAccountingRoute: Routes[] = [
  {
    path: ICARouteMaps.ica,
    meta: {
      title: '碳核算行业版',
      icon: 'icon-icon-hangyetanhesuan',
    },
    children: [
      {
        path: ICARouteMaps.icaProductionUnit,
        meta: {
          title: '生产单元',
        },
        component: lazy(
          () => import('@/views/industryCarbonAccounting/ProductionUnit'),
        ),
        children: [
          {
            path: ICARouteMaps.icaProductionUnitInfo,
            meta: {
              title: () => routeTypeNameRender('生产单元'),
            },
            component: lazy(
              () =>
                import('@/views/industryCarbonAccounting/ProductionUnit/Info'),
            ),
          },
        ],
      },
      {
        path: ICARouteMaps.icaAccounting,
        meta: {
          title: '碳排放核算',
        },
        component: lazy(
          () => import('@/views/industryCarbonAccounting/EmissionAccounting'),
        ),
        children: [
          {
            path: ICARouteMaps.icaAccountingInfo,
            meta: {
              title: () => routeTypeNameRender('碳排放核算'),
            },
            component: lazy(
              () =>
                import(
                  '@/views/industryCarbonAccounting/EmissionAccounting/Info'
                ),
            ),
          },
        ],
      },
      {
        path: ICARouteMaps.icaFill,
        meta: {
          title: '排放数据填报',
        },
        component: lazy(
          () => import('@/views/industryCarbonAccounting/EmissionFill'),
        ),
        children: [
          {
            path: ICARouteMaps.icaFillInfo,
            meta: {
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '填报排放数据',
                  [PageTypeInfo.show]: '排放数据填报详情',
                  [PageTypeInfo.edit]: '填报排放数据',
                  [PageTypeInfo.copy]: '填报排放数据',
                }),
            },
            component: lazy(
              () =>
                import('@/views/industryCarbonAccounting/EmissionFill/Info'),
            ),
          },
        ],
      },
      {
        path: ICARouteMaps.icaApproval,
        meta: {
          title: '排放数据审核',
        },
        component: lazy(
          () => import('@/views/industryCarbonAccounting/EmissionApproval'),
        ),
        children: [
          {
            path: ICARouteMaps.icaApprovalInfo,
            meta: {
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '审核排放数据',
                  [PageTypeInfo.show]: '排放数据审核详情',
                  [PageTypeInfo.edit]: '审核排放数据',
                  [PageTypeInfo.copy]: '审核排放数据',
                }),
            },
            component: lazy(
              () =>
                import(
                  '@/views/industryCarbonAccounting/EmissionApproval/Info'
                ),
            ),
          },
        ],
      },
      {
        path: ICARouteMaps.icaReport,
        meta: {
          title: '碳排放报告',
        },
        component: lazy(
          () => import('@/views/industryCarbonAccounting/Report'),
        ),
        children: [
          {
            path: ICARouteMaps.icaReportInfo,
            meta: {
              title: () => routeTypeNameRender('碳排放报告'),
            },
            component: lazy(
              () => import('@/views/industryCarbonAccounting/Report/Info'),
            ),
          },
        ],
      },
    ],
  },
];
