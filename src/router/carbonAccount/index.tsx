/*
 * @@description: 员工碳账户
 * @Author: lichunxiao 1359758885@aa.com
 * @Date: 2023-06-14 09:53:14
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-07-03 09:54:51
 */
import { lazy } from 'react';

import { CaRouteMaps } from '../utils/caEmums';
import { PageTypeInfo } from '../utils/enums';
import { routeTypeNameRender } from '../utils/index';

export const CARoute = [
  {
    path: CaRouteMaps.ca,
    meta: {
      title: '员工碳账户',
      icon: 'icon-icon-yuangongtanzhanghu',
    },
    children: [
      {
        path: CaRouteMaps.userList,
        meta: {
          title: '用户列表',
        },
        component: lazy(() => import('@views/carbonAccount/userList/index')),
        children: [
          {
            path: CaRouteMaps.userListInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '新增用户',
                  [PageTypeInfo.show]: '用户详情',
                  [PageTypeInfo.edit]: '编辑用户',
                  // TODO
                  [PageTypeInfo.copy]: '编辑用户',
                }),
            },
            component: lazy(() => import('@views/carbonAccount/userList/Info')),
          },
          {
            path: CaRouteMaps.userListImport,
            meta: {
              showInMenu: false,
              title: '导入用户',
            },
            component: lazy(
              () => import('@views/carbonAccount/userList/Import'),
            ),
          },
        ],
      },
      {
        path: CaRouteMaps.CADetail,
        meta: {
          title: '碳账户明细',
        },
        component: lazy(() => import('@views/carbonAccount/CADetail/index')),
      },
      {
        path: CaRouteMaps.activityDataRecord,
        meta: {
          title: '活动数据记录',
        },
        component: lazy(
          () => import('@views/carbonAccount/activityDataRecord/index'),
        ),
        children: [
          {
            path: CaRouteMaps.activityDataRecordShow,
            meta: {
              showInMenu: false,
              title: '活动数据记录详情',
            },
            component: lazy(
              () => import('@views/carbonAccount/activityDataRecord/Info'),
            ),
          },
        ],
      },
      {
        path: CaRouteMaps.exchangeRecords,
        meta: {
          title: '兑换记录',
        },
        component: lazy(
          () => import('@views/carbonAccount/exchangeRecords/index'),
        ),
      },
      {
        path: CaRouteMaps.ranking,
        meta: {
          title: '排行榜',
        },
        component: lazy(() => import('@views/carbonAccount/ranking/panelList')),
        children: [
          {
            path: CaRouteMaps.rankList,
            meta: {
              showInMenu: false,
              title: '排行榜列表',
            },
            component: lazy(() => import('@views/carbonAccount/ranking/index')),
          },
        ],
      },
      {
        path: CaRouteMaps.lowCarbonScenario,
        meta: {
          title: '低碳场景',
        },
        component: lazy(
          () => import('@views/carbonAccount/lowCarbonScenario/index'),
        ),
        children: [
          {
            path: CaRouteMaps.lowCarbonScenarioInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '新增场景',
                  [PageTypeInfo.show]: '场景详情',
                  [PageTypeInfo.edit]: '编辑场景',
                  [PageTypeInfo.copy]: '复制场景',
                }),
            },
            component: lazy(
              () => import('@views/carbonAccount/lowCarbonScenario/Info'),
            ),
          },
        ],
      },
      {
        path: CaRouteMaps.lowCarbonQuestionBank,
        meta: {
          title: '低碳题库',
        },
        component: lazy(
          () => import('@views/carbonAccount/lowCarbonQuestionBank/index'),
        ),
        children: [
          {
            path: CaRouteMaps.lowCarbonQuestionBankInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '新增题库',
                  [PageTypeInfo.show]: '题库详情',
                  [PageTypeInfo.edit]: '编辑题库',
                  // TODO
                  [PageTypeInfo.copy]: '编辑题库',
                }),
            },
            component: lazy(
              () => import('@views/carbonAccount/lowCarbonQuestionBank/Info'),
            ),
          },
          {
            path: CaRouteMaps.lowCarbonQuestionBankImport,
            meta: {
              showInMenu: false,
              title: '导入题库',
            },
            component: lazy(
              () => import('@views/carbonAccount/lowCarbonQuestionBank/Import'),
            ),
          },
        ],
      },
      {
        path: CaRouteMaps.pointProducts,
        meta: {
          title: '积分商品',
        },
        component: lazy(
          () => import('@views/carbonAccount/pointProducts/index'),
        ),
        children: [
          {
            path: CaRouteMaps.pointProductsInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '新增商品',
                  [PageTypeInfo.show]: '商品详情',
                  [PageTypeInfo.edit]: '编辑商品',
                  // TODO
                  [PageTypeInfo.copy]: '编辑商品',
                }),
            },
            component: lazy(
              () => import('@views/carbonAccount/pointProducts/Info'),
            ),
          },
        ],
      },
      {
        path: CaRouteMaps.merchandiseInventory,
        meta: {
          title: '商品库存',
        },
        component: lazy(
          () => import('@views/carbonAccount/merchandiseInventory/index'),
        ),
        children: [
          {
            path: CaRouteMaps.inventoryRecords,
            meta: {
              showInMenu: false,
              title: '库存记录',
            },
            component: lazy(
              () =>
                import(
                  '@views/carbonAccount/merchandiseInventory/inventoryRecords'
                ),
            ),
          },
        ],
      },
      {
        path: CaRouteMaps.settings,
        meta: {
          title: '碳账户设置',
        },
        component: lazy(() => import('@views/carbonAccount/settings/index')),
      },
    ],
  },
];
