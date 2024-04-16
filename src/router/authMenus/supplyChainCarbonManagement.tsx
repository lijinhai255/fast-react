/*
 * @@description: 供应链碳管理路由
 */
import { lazy } from 'react';

import { Routes } from '../config';
import { PageTypeInfo } from '../utils/enums';
import { routeTypeNameRender, sccmRouteTypeNameRender } from '../utils/index';
import { SccmRouteMaps } from '../utils/sccmEnums';

export const supplyChainCarbonManagementRoute: Routes[] = [
  {
    path: SccmRouteMaps.sccm,
    meta: {
      title: '供应链碳管理',
      icon: 'icon-icon_gongzuotai',
    },
    children: [
      {
        path: SccmRouteMaps.sccmManagement,
        meta: {
          title: '供应商管理',
        },
        component: lazy(
          () =>
            import('@/views/supplyChainCarbonManagement/SupplierManagement'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmManagementImport,
            meta: {
              title: '导入供应商',
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierManagement/Import'
                ),
            ),
          },
          {
            path: SccmRouteMaps.sccmManagementInfo,
            meta: {
              title: () => routeTypeNameRender('供应商'),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierManagement/Info'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmManagementInfoCarbonAccountingInfo,
                meta: {
                  title: () => routeTypeNameRender('企业碳核算'),
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/SupplierManagement/components/CarbonAccountingList/Info'
                    ),
                ),
                children: [
                  {
                    path: SccmRouteMaps.sccmManagementInfoCarbonAccountingInfoEmissionSourceInfo,
                    meta: {
                      title: '排放源详情',
                    },
                    component: lazy(
                      () =>
                        import(
                          '@/views/supplyChainCarbonManagement/components/CarbonAccountingEmissionSource'
                        ),
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: SccmRouteMaps.sccmManagementApply,
            meta: {
              title: '申请企业碳核算',
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierManagement/Apply'
                ),
            ),
          },
          {
            path: SccmRouteMaps.sccmManagementPurchaseProduct,
            meta: {
              title: '采购产品管理',
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierManagement/PurchaseProduct'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmManagementPurchaseProductInfo,
                meta: {
                  title: () => routeTypeNameRender('采购产品'),
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/SupplierManagement/PurchaseProduct/Info'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmManagementPurchaseProductSelect,
                meta: {
                  title: '选择采购产品',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/SupplierManagement/PurchaseProduct/Select'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmManagementPurchaseProductApply,
                meta: {
                  title: '申请产品碳足迹',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/SupplierManagement/PurchaseProduct/Apply'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmProdct,
        meta: {
          title: '采购产品管理',
        },
        component: lazy(
          () =>
            import(
              '@/views/supplyChainCarbonManagement/PurchaseProductManagement'
            ),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmProdctImport,
            meta: {
              title: '导入采购产品',
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/PurchaseProductManagement/Import'
                ),
            ),
          },
          {
            path: SccmRouteMaps.sccmProdctInfo,
            meta: {
              title: () => routeTypeNameRender('采购产品'),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/PurchaseProductManagement/Info'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmProdctInfoCarbonFootPrintInfo,
                meta: {
                  title: () => routeTypeNameRender('产品碳足迹'),
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/components/CarbonFootPrintList/Info'
                    ),
                ),
                children: [
                  {
                    path: SccmRouteMaps.sccmProdctInfoCarbonFootPrintInfoEmissionSourceInfo,
                    meta: {
                      title: '排放源详情',
                    },
                    component: lazy(
                      () =>
                        import(
                          '@/views/supplyChainCarbonManagement/components/CarbonFootPrintEmissionSource'
                        ),
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: SccmRouteMaps.sccmProdctSupplierManagement,
            meta: {
              title: '供应商管理',
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmProdctSupplierManagementInfo,
                meta: {
                  title: () => routeTypeNameRender('供应商'),
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement/Info'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmProdctSupplierManagementSelect,
                meta: {
                  title: '选择供应商',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement/Select'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmProdctSupplierManagementApply,
                meta: {
                  title: '申请产品碳足迹',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/PurchaseProductManagement/SupplierManagement/Apply'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmQuestionnaire,
        meta: {
          title: '低碳问卷',
        },
        component: lazy(
          () =>
            import(
              '@/views/supplyChainCarbonManagement/LowCarbonQuestionnaire'
            ),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmQuestionnaireInfo,
            meta: {
              title: () => routeTypeNameRender('问卷'),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/LowCarbonQuestionnaire/Info'
                ),
            ),
          },
          {
            path: SccmRouteMaps.sccmQuestionnairePreview,
            meta: {
              title: '问卷预览',
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/LowCarbonQuestionnaire/preview'
                ),
            ),
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmCarbonData,
        meta: {
          title: '供应商碳数据',
        },
        component: lazy(
          () =>
            import('@/views/supplyChainCarbonManagement/SupplierCarbonData'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmCarbonDataInfo,
            meta: {
              title: () => routeTypeNameRender('供应商碳数据'),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/SupplierCarbonData/Info'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmCarbonDataInfoEnterpriseEmissonSourceInfo,
                meta: {
                  title: '排放源详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonAccountingEmissionSource'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmCarbonDataInfoProductEmissonSourceInfo,
                meta: {
                  title: '排放因子详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonFootPrintEmissionSource'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmApproval,
        meta: {
          title: '碳数据审核',
        },
        component: lazy(
          () =>
            import('@/views/supplyChainCarbonManagement/CarbonDataApproval'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmApprovalInfo,
            meta: {
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '审核碳数据',
                  [PageTypeInfo.show]: '碳数据详情',
                  [PageTypeInfo.edit]: '审核碳数据',
                  [PageTypeInfo.copy]: '复制碳数据',
                }),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/CarbonDataApproval/Info'
                ),
            ),
            children: [
              {
                path: SccmRouteMaps.sccmApprovalInfoEnterpriseEmissonSourceInfo,
                meta: {
                  title: '排放源详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonAccountingEmissionSource'
                    ),
                ),
              },
              {
                path: SccmRouteMaps.sccmApprovalInfoProductEmissonSourceInfo,
                meta: {
                  title: '排放源详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/components/CarbonFootPrintEmissionSource'
                    ),
                ),
              },
            ],
          },
        ],
      },
      {
        path: SccmRouteMaps.sccmFill,
        meta: {
          title: '碳数据填报',
        },
        component: lazy(
          () => import('@/views/supplyChainCarbonManagement/CarbonDataFill'),
        ),
        children: [
          {
            path: SccmRouteMaps.sccmFillInfo,
            meta: {
              title: () =>
                routeTypeNameRender({
                  [PageTypeInfo.add]: '填报碳数据',
                  [PageTypeInfo.show]: '碳数据详情',
                  [PageTypeInfo.edit]: '填报碳数据',
                  [PageTypeInfo.copy]: '复制碳数据',
                }),
            },
            component: lazy(
              () =>
                import(
                  '@/views/supplyChainCarbonManagement/CarbonDataFill/Info'
                ),
            ),
            children: [
              /** 产品碳足迹相关 */
              /** 选择核算产品相关 */
              {
                path: SccmRouteMaps.sccmFillInfoProductSelect,
                meta: {
                  title: '选择核算产品',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonFootPrint/Select'
                    ),
                ),
                children: [
                  {
                    path: SccmRouteMaps.sccmFillInfoProductSelectInfo,
                    meta: {
                      title: '核算产品详情',
                    },
                    component: lazy(
                      () =>
                        import(
                          '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonFootPrint/Info'
                        ),
                    ),
                    children: [
                      {
                        path: SccmRouteMaps.sccmFillInfoProductSelectInfoEmissionSourceInfo,
                        meta: {
                          title: '排放源详情',
                        },
                        component: lazy(
                          () =>
                            import(
                              '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonFootPrint/EmissionSourceFactorInfo'
                            ),
                        ),
                      },
                    ],
                  },
                ],
              },
              {
                path: SccmRouteMaps.sccmFillInfoProductInfo,
                meta: {
                  title: '核算产品详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonFootPrint/Info'
                    ),
                ),
                children: [
                  {
                    path: SccmRouteMaps.sccmFillInfoProductInfo,
                    meta: {
                      title: '核算产品详情',
                    },
                    component: lazy(
                      () =>
                        import(
                          '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonFootPrint/Info'
                        ),
                    ),
                    children: [
                      {
                        path: SccmRouteMaps.sccmFillInfoProductInfoEmissionSourceInfo,
                        meta: {
                          title: '排放源详情',
                        },
                        component: lazy(
                          () =>
                            import(
                              '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonFootPrint/EmissionSourceFactorInfo'
                            ),
                        ),
                      },
                    ],
                  },
                ],
              },
              /** 企业碳核算填报相关 */
              /** 选择碳排放核算 */
              {
                path: SccmRouteMaps.sccmFillInfoEnterpriseSelect,
                meta: {
                  title: '选择碳排放核算',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonAccounting/Select'
                    ),
                ),
                children: [
                  {
                    path: SccmRouteMaps.sccmFillInfoEnterpriseSelectInfo,
                    meta: {
                      title: '核算记录详情',
                    },
                    component: lazy(
                      () =>
                        import(
                          '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonAccounting/Info'
                        ),
                    ),
                    children: [
                      {
                        path: SccmRouteMaps.sccmFillInfoEnterpriseSelectInfoEmissonSourceInfo,
                        meta: {
                          title: () =>
                            sccmRouteTypeNameRender('排放源', 'emissionSource'),
                        },
                        component: lazy(
                          () =>
                            import(
                              '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonAccounting/EmissionSourceInfo'
                            ),
                        ),
                      },
                    ],
                  },
                ],
              },
              /** 企业碳核算 */
              {
                path: SccmRouteMaps.sccmFillInfoEnterpriseInfo,
                meta: {
                  title: '核算记录详情',
                },
                component: lazy(
                  () =>
                    import(
                      '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonAccounting/Info'
                    ),
                ),
                children: [
                  {
                    path: SccmRouteMaps.sccmFillInfoEnterpriseInfoEmissionSourceInfo,
                    meta: {
                      title: () =>
                        sccmRouteTypeNameRender('排放源', 'emissionSource'),
                    },
                    component: lazy(
                      () =>
                        import(
                          '@/views/supplyChainCarbonManagement/CarbonDataFill/Info/CarbonAccounting/EmissionSourceInfo'
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
];
