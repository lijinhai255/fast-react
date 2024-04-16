/*
 * @@description: 产品碳足迹路由
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 11:25:51
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-18 16:40:13
 */
import { lazy } from 'react';

import { Routes } from '../config';
import { RouteMaps } from '../utils/enums';
import { routeTypeNameRender } from '../utils/index';

export const carbonFootPrintRoute: Routes[] = [
  {
    path: RouteMaps.carbonFootPrint,
    meta: {
      title: '产品碳足迹',
      icon: 'icon-icon-chanpintanzuji',
    },
    children: [
      {
        path: RouteMaps.carbonFootPrintProduct,
        meta: {
          title: '产品管理',
        },
        component: lazy(
          () => import('@/views/carbonFootPrint/ProductManagement'),
        ),
        children: [
          {
            path: RouteMaps.carbonFootPrintProductInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('产品'),
            },
            component: lazy(
              () => import('@views/carbonFootPrint/ProductManagement/Info'),
            ),
          },
          {
            path: RouteMaps.carbonFootPrintProductImport,
            meta: {
              showInMenu: false,
              title: '导入产品',
            },
            component: lazy(
              () => import('@/views/carbonFootPrint/ProductManagement/Import'),
            ),
          },
        ],
      },
      {
        path: RouteMaps.carbonFootPrintAccounts,
        meta: {
          title: '碳足迹核算',
        },
        component: lazy(
          () => import('@/views/carbonFootPrint/AccountsManagement'),
        ),
        children: [
          {
            path: RouteMaps.carbonFootPrintAccountsDetail,
            meta: {
              showInMenu: false,
              title: () => '碳足迹核算详情',
            },
            component: lazy(
              () =>
                import(
                  '@views/carbonFootPrint/AccountsManagement/AccountsModel'
                ),
            ),
          },
          {
            path: RouteMaps.carbonFootPrintAccountsInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('核算'),
            },
            component: lazy(
              () => import('@/views/carbonFootPrint/AccountsManagement/Info'),
            ),
          },

          {
            path: RouteMaps.carbonFootPrintAccountsModel,
            meta: {
              showInMenu: false,
              title: '核算模型',
            },
            component: lazy(
              () =>
                import(
                  '@views/carbonFootPrint/AccountsManagement/AccountsModel'
                ),
            ),
          },
          {
            path: RouteMaps.carbonFootPrintAccountsModelDetail,
            meta: {
              showInMenu: false,
              title: '核算模型详情',
            },
            component: lazy(
              () =>
                import(
                  '@views/carbonFootPrint/AccountsManagement/AccountsModel'
                ),
            ),
          },
          {
            path: RouteMaps.carbonFootPrintAccountsModelInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('排放源'),
            },
            component: lazy(
              () =>
                import(
                  '@/views/carbonFootPrint/AccountsManagement/AccountsModel/Info'
                ),
            ),
          },
          {
            path: RouteMaps.carbonFootPrintAccountsModelImport,
            meta: {
              showInMenu: false,
              title: '导入排放源',
            },
            component: lazy(
              () =>
                import(
                  '@/views/carbonFootPrint/AccountsManagement/AccountsModel/Import'
                ),
            ),
          },
          {
            path: RouteMaps.carbonFootPrintAccountsSelectEmissionFactor,
            meta: {
              showInMenu: false,
              title: '选择排放因子',
            },
            component: lazy(
              () =>
                import(
                  '@/views/carbonFootPrint/AccountsManagement/AccountsModel/SelectEmissionFactor'
                ),
            ),
          },
          {
            path: RouteMaps.carbonFootPrintAccountsSelectSupplierData,
            meta: {
              showInMenu: false,
              title: '选择供应商数据',
            },
            component: lazy(
              () =>
                import(
                  '@/views/carbonFootPrint/AccountsManagement/AccountsModel/SelectSupplierData'
                ),
            ),
            children: [
              {
                path: RouteMaps.carbonFootPrintAccountsSelectSupplierDataInfo,
                meta: {
                  showInMenu: false,
                  title: '供应商数据详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/carbonFootPrint/AccountsManagement/AccountsModel/SelectSupplierData/Info'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: RouteMaps.carbonFootPrintReport,
        meta: {
          title: '碳足迹报告',
        },
        component: lazy(
          () => import('@/views/carbonFootPrint/ReportManagement'),
        ),
        children: [
          {
            path: RouteMaps.carbonFootPrintReportInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('报告'),
            },
            component: lazy(
              () => import('@views/carbonFootPrint/ReportManagement/Info'),
            ),
          },
        ],
      },
    ],
  },
];
