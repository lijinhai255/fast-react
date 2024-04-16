/*
 * @@description: 企业碳核算
 */
import { lazy } from 'react';

import { ProdManagementRoutes } from '../prodManagement';
import { EcaRouteMaps } from '../utils/ecaEmums';
import { PageTypeInfo } from '../utils/enums';
import { routeTypeNameRender, sccmRouteTypeNameRender } from '../utils/index';

export const ECARoute = [
  {
    path: EcaRouteMaps.eca,
    meta: {
      title: '企业碳核算',
      icon: 'icon-icon-qiyetanhesuan',
    },
    children: [
      {
        path: EcaRouteMaps.dataQualityManage,
        meta: {
          title: '数据质量控制',
        },
        component: lazy(() => import('@views/eca/dataQualityManage/index')),
        children: [
          {
            path: EcaRouteMaps.editDataQualityManage,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('数据质量控制'),
            },
            component: lazy(
              () => import('@views/eca/dataQualityManage/controlPlan/index'),
            ),
            children: [
              {
                path: EcaRouteMaps.editDataQualityManageEditDetail,
                meta: {
                  showInMenu: false,
                  title: '编辑数据质量计划',
                },
                component: lazy(
                  () =>
                    import('@views/eca/dataQualityManage/controlPlan/detail'),
                ),
              },
              {
                path: EcaRouteMaps.editDataQualityManageDetail,
                meta: {
                  showInMenu: false,
                  title: '查看数据质量计划',
                },
                component: lazy(
                  () =>
                    import('@views/eca/dataQualityManage/controlPlan/detail'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: EcaRouteMaps.emissionManage,
        meta: {
          title: '排放源库',
        },
        component: lazy(() => import('@views/eca/emissionManage')),
        children: [
          {
            path: EcaRouteMaps.emissionManagInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('排放源'),
            },
            component: lazy(() => import('@views/eca/emissionManage/Info')),
            children: [
              {
                path: EcaRouteMaps.emissionManagInfoChoose,
                meta: {
                  showInMenu: false,
                  title: '选择排放因子',
                },
                component: lazy(
                  () => import('@views/eca/emissionManage/Info/chooseFactor'),
                ),
                children: [
                  {
                    path: EcaRouteMaps.emissionManagInfoChooseDetail,
                    meta: {
                      showInMenu: false,
                      title: '排放因子详情',
                    },
                    component: lazy(() => import('@views/Factors/Info/index')),
                  },
                ],
              },
              {
                path: EcaRouteMaps.emissionManagInfoChooseSupplierData,
                meta: {
                  title: '选择供应商数据',
                },
                component: lazy(
                  () =>
                    import('@views/eca/emissionManage/Info/chooseSupplierData'),
                ),
                children: [
                  {
                    path: EcaRouteMaps.emissionManagInfoChooseSupplierDataInfo,
                    meta: {
                      title: '供应商数据详情',
                    },
                    component: lazy(
                      () =>
                        import(
                          '@views/eca/emissionManage/Info/supplierDataIDetail'
                        ),
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: EcaRouteMaps.accountingModel,
        meta: {
          title: '核算模型',
        },
        component: lazy(() => import('@views/eca/accountingModel')),
        children: [
          {
            path: EcaRouteMaps.accountingModelEmissionSource,
            meta: {
              showInMenu: false,
              title: () => '排放源管理',
            },
            component: lazy(
              () => import('@views/eca/accountingModel/emissionSource'),
            ),
            children: [
              {
                path: EcaRouteMaps.accountingModelEmissionSourceInfo,
                meta: {
                  showInMenu: false,
                  title: () => '选择排放源',
                },
                component: lazy(() => import('@views/eca/emissionManage')),
              },
              {
                path: EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                meta: {
                  showInMenu: false,
                  title: () => '排放源详情',
                },
                component: lazy(
                  () => import('@views/eca/component/emissionSourceDetail'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: EcaRouteMaps.carbonMissionAccounting,
        meta: {
          title: '碳排放核算',
        },
        component: lazy(() => import('@views/eca/carbonMissionAccounting')),
        children: [
          {
            path: EcaRouteMaps.carbonMissionAccountingInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('核算'),
            },
            component: lazy(
              () => import('@views/eca/carbonMissionAccounting/Info'),
            ),
            children: [
              {
                path: EcaRouteMaps.carbonMissionAccountingInfoEmissionSourceInfo,
                meta: {
                  showInMenu: false,
                  title: '排放源详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/eca/carbonMissionAccounting/Info/sourceInfo'
                    ),
                ),
              },
            ],
          },
          {
            path: EcaRouteMaps.carbonMissionAccountingSourceInfo,
            meta: {
              showInMenu: false,
              title: '排放源管理',
            },
            component: lazy(
              () => import('@views/eca/carbonMissionAccounting/Info/source'),
            ),
            children: [
              {
                path: EcaRouteMaps.carbonMissionAccountingSource,
                meta: {
                  showInMenu: false,
                  title: '选择排放源',
                },
                component: lazy(() => import('@views/eca/emissionManage')),
              },
              {
                path: EcaRouteMaps.carbonMissionAccountingSourceInfoDetail,
                meta: {
                  showInMenu: false,
                  title: '排放源详情',
                },
                component: lazy(() => import('@views/eca/emissionManage/Info')),
              },
              {
                path: EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                meta: {
                  showInMenu: false,
                  title: '排放源详情',
                },
                component: lazy(
                  () => import('@views/eca/component/emissionSourceDetail'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: EcaRouteMaps.fillData,
        meta: {
          title: '排放数据填报',
        },
        component: lazy(() => import('@views/eca/fillData')),
        children: [
          {
            path: EcaRouteMaps.fillDataInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '填报数据',
                  [PageTypeInfo.show]: '填报数据详情',
                  [PageTypeInfo.edit]: '填报数据编辑',
                  [PageTypeInfo.copy]: '填报数据编辑',
                }),
            },
            component: lazy(() => import('@views/eca/fillData/Info')),
            children: [
              {
                path: EcaRouteMaps.fillDataInfoScreen,
                meta: {
                  showInMenu: false,
                  title: () =>
                    sccmRouteTypeNameRender('排放源', 'detailfactor'),
                },
                component: lazy(
                  () => import('@views/eca/fillData/Info/emissionSourceInfo'),
                ),
                children: [
                  {
                    path: EcaRouteMaps.fillDataInfoScreenSelectEmissionSource,
                    meta: {
                      showInMenu: false,
                      title: '选择排放源',
                    },
                    component: lazy(
                      () => import('@views/eca/fillData/Info/chooseFactor'),
                    ),
                    children: [
                      {
                        path: EcaRouteMaps.fillDataInfoScreenSelectEmissionSourceDetail,
                        meta: {
                          showInMenu: false,
                          title: '排放因子详情',
                        },
                        component: lazy(
                          () => import('@views/Factors/Info/index'),
                        ),
                      },
                    ],
                  },
                  {
                    path: EcaRouteMaps.fillDataInfoScreenSelectSupplier,
                    meta: {
                      showInMenu: false,
                      title: '选择供应商数据',
                    },
                    component: lazy(
                      () => import('@views/eca/fillData/Info/chooseSupplier'),
                    ),
                    children: [
                      {
                        path: EcaRouteMaps.fillDataInfoScreenSelectSupplierDetail,
                        meta: {
                          title: '供应商数据详情',
                        },
                        component: lazy(
                          () =>
                            import(
                              '@views/eca/emissionManage/Info/supplierDataIDetail'
                            ),
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: EcaRouteMaps.approvalManage,
        meta: {
          title: '排放数据审核',
        },
        component: lazy(() => import('@/views/eca/approvalManage')),
        children: [
          {
            path: EcaRouteMaps.approvalManageInfo,
            meta: {
              showInMenu: false,
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '审核排放数据',
                  [PageTypeInfo.show]: '排放数据审核详情',
                  [PageTypeInfo.edit]: '审核排放数据',
                  [PageTypeInfo.copy]: '审核排放数据',
                }),
            },
            component: lazy(() => import('@views/eca/approvalManage/Info')),
            children: [
              {
                path: EcaRouteMaps.approvalManageInfoSourceDetail,
                meta: {
                  showInMenu: false,
                  title: () => '排放源详情',
                },
                component: lazy(
                  () => import('@views/eca/fillData/Info/emissionSourceInfo'),
                ),
              },
            ],
          },
        ],
      },
      {
        path: EcaRouteMaps.baseYear,
        meta: {
          title: '基准年',
        },
        component: lazy(() => import('@views/eca/baseYear')),
        children: [
          {
            path: EcaRouteMaps.baseYearInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('基准年'),
            },
            component: lazy(() => import('@views/eca/baseYear/Info')),
          },
        ],
      },
      {
        path: EcaRouteMaps.reductionScene,
        meta: {
          title: '减排场景',
        },
        component: lazy(() => import('@views/eca/reductionScene')),
        children: [
          {
            path: EcaRouteMaps.reductionSceneInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('减排场景'),
            },
            component: lazy(() => import('@views/eca/reductionScene/Info')),
          },
        ],
      },
      ...ProdManagementRoutes,
      {
        path: EcaRouteMaps.accountingReport,
        meta: {
          title: '核算报告',
        },
        component: lazy(() => import('@views/eca/accountingReport')),
        children: [
          {
            path: EcaRouteMaps.accountingReportInfo,
            meta: {
              showInMenu: false,
              title: () => routeTypeNameRender('报告'),
            },
            component: lazy(() => import('@views/eca/accountingReport/Info')),
            children: [
              {
                path: EcaRouteMaps.accountingReportInfoChooseScreen,
                meta: {
                  showInMenu: false,
                  title: '选择减排场景',
                },
                component: lazy(() => import('@views/eca/reductionScene')),
                children: [
                  {
                    path: EcaRouteMaps.accountingReportInfoChooseScreenDetail,
                    meta: {
                      showInMenu: false,
                      title: '减排场景详情',
                    },
                    component: lazy(
                      () => import('@views/eca/reductionScene/Info'),
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
