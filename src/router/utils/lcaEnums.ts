/**
 * @description 产品碳足迹LCA升级版路由信息
 */

/** 路由变量 */
export enum LCARouteMaps {
  /** 产品碳足迹LCA升级版 */
  'lca' = '/carbonFootprintLCA',

  /** 产品碳足迹LCA升级版-产品信息管理 */
  'lcaProduction' = '/carbonFootprintLCA/production',

  /** 产品碳足迹LCA升级版-碳足迹模型 */
  'lcaModel' = '/carbonFootprintLCA/model',
  /** 产品碳足迹LCA升级版-碳足迹模型详情 */
  'lcaModelInfo' = '/carbonFootprintLCA/model/:pageTypeInfo',

  /** 产品碳足迹LCA升级版-碳足迹报告 */
  'lcaReport' = '/carbonFootprintLCA/report',

  /** 产品碳足迹LCA升级版-过程库 */
  'lcaProcessLibrary' = '/carbonFootprintLCA/processLibrary',
  /** 产品碳足迹LCA升级版-过程库详情 */
  'lcaProcessLibraryInfo' = '/carbonFootprintLCA/processLibrary/:pageTypeInfo',
}
