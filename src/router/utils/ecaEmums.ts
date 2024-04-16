/*
 * @@description: 企业碳核算的路由信息
 */
export enum EcaRouteMaps {
  /** 企业碳核算 */
  'eca' = '/carbonAccounting',
  /** 数据质量控制**/
  'dataQualityManage' = '/carbonAccounting/dataQualityManage',
  /** 数据质量控制详情 **/
  'editDataQualityManage' = '/carbonAccounting/dataQualityManage/:pageTypeInfo/:id',
  /** 标准详情***/
  'editDataQualityManageEditDetail' = '/carbonAccounting/dataQualityManage/:pageTypeInfo/:id/edit/:controlPlanId/:standardType',
  'editDataQualityManageDetail' = '/carbonAccounting/dataQualityManage/:pageTypeInfo/:id/show/:controlPlanId/:standardType',

  /** 排放源库**/
  'emissionManage' = '/carbonAccounting/emissionManage',
  'emissionManagInfo' = '/carbonAccounting/emissionManage/:pageTypeInfo/:id',
  'emissionManagInfoChoose' = '/carbonAccounting/emissionManage/:pageTypeInfo/:id/chooseFactor',
  'emissionManagInfoChooseDetail' = '/carbonAccounting/emissionManage/:pageTypeInfo/:id/chooseFactor/:factorPageInfo/:factorId',
  /** 排放源库-详情-选择供应商数据 */
  'emissionManagInfoChooseSupplierData' = '/carbonAccounting/emissionManage/:pageTypeInfo/:id/chooseSupplierData',
  /** 排放源库-详情-选择供应商数据-详情 */
  'emissionManagInfoChooseSupplierDataInfo' = '/carbonAccounting/emissionManage/:pageTypeInfo/:id/chooseSupplierData/:applyInfoId',

  /** 核算模型**/
  'accountingModel' = '/carbonAccounting/accountingModel',
  /** *排放源管理**/
  'accountingModelEmissionSource' = '/carbonAccounting/accountingModel/emissionSource/:pageTypeInfo/:id',
  /** **选择排放源***/
  'accountingModelEmissionSourceInfo' = '/carbonAccounting/accountingModel/emissionSource/:pageTypeInfo/:id/chooseEmissionSource/:SourcefactorId',
  /** *排放源详情**/
  'accountingModelEmissionSourceInfoShow' = '/carbonAccounting/accountingModel/emissionSource/:pageTypeInfo/:id/detailfactor/:factorPageInfo/:SourcefactorId',

  /** 碳排放核算**/
  'carbonMissionAccounting' = '/carbonAccounting/carbonMissionAccounting',
  /* 碳排放核算- 核算详情 emissionSource**/
  'carbonMission' = '/carbonAccounting/carbonMissionAccounting/carbonMission',
  'carbonMissionAccountingInfo' = '/carbonAccounting/carbonMissionAccounting/carbonMission/:pageTypeInfo/:id',
  /** 碳排放管理-详情-排放源列表-查看 */
  'carbonMissionAccountingInfoEmissionSourceInfo' = '/carbonAccounting/carbonMissionAccounting/carbonMission/:pageTypeInfo/:id/emissionSource/:factorPageInfo/:sourcefactorId/:computationDataId',
  'carbonMissionAccountingSourceInfo' = '/carbonAccounting/carbonMissionAccounting/emissionSource/:pageTypeInfo/:id',
  'carbonMissionAccountingSourceInfofactorDetail' = '/carbonAccounting/carbonMissionAccounting/emissionSource/:pageTypeInfo/:id/detailfactor/:factorPageInfo/:SourcefactorId',
  /** *排放源详情**/
  'carbonMissionAccountingSourceInfoDetail' = '/carbonAccounting/carbonMissionAccounting/carbonMission/:pageTypeInfo/:id/detailfactor/:factorPageInfo/:SourcefactorId/:computationDataId',
  /** 选择排放源**/
  'carbonMissionAccountingSource' = '/carbonAccounting/carbonMissionAccounting/emissionSource/:pageTypeInfo/:id/chooseEmissionSource/:SourcefactorId',

  /** 数据填报**/
  'fillData' = '/carbonAccounting/fillData',
  /** 数据填报-新增 编辑 详情***/
  'fillDataInfo' = '/carbonAccounting/fillData/:pageTypeInfo/:id',
  'fillDataInfoScreen' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId',
  /** 数据填报-选择排放源因子 */
  'fillDataInfoScreenSelectEmissionSource' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectEmissionSource',
  /** 数据填报-选择排放源因子-详情 */
  'fillDataInfoScreenSelectEmissionSourceDetail' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectEmissionSource/:factorPageInfo/:factorId',
  /** 数据填报-选择供应商数据 */
  'fillDataInfoScreenSelectSupplier' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectSupplier',
  /** 数据填报-选择供应商数据-详情 */
  'fillDataInfoScreenSelectSupplierDetail' = '/carbonAccounting/fillData/:pageTypeInfo/:id/detailfactor/:sourcePageInfo/:SourcefactorId/selectSupplier/:applyInfoId',
  /** 排放数据审核**/
  'approvalManage' = '/carbonAccounting/approvalManage',
  /** 排放数据审核-详情**/
  'approvalManageInfo' = '/carbonAccounting/approvalManage/:pageTypeInfo/:id/:dataId/:auditStatus',
  'approvalManageInfoDetail' = '/carbonAccounting/approvalManage/:pageTypeInfo/:id/:dataId',
  /** 审核-排放数据详情**/
  'approvalManageInfoSourceDetail' = '/carbonAccounting/approvalManage/:pageTypeInfo/:id/:dataId/:auditStatus/detailfactor/:factorPageInfo/:SourcefactorId',

  /** 基准年**/
  'baseYear' = '/carbonAccounting/baseYear',
  'baseYearInfo' = '/carbonAccounting/baseYear/:pageTypeInfo/:id',
  /** 基准年 新增 编辑 查看**/
  /** 减排场景**/
  'reductionScene' = '/carbonAccounting/reductionScene',
  /** *减排场景 新增 编辑 查看**/
  'reductionSceneInfo' = '/carbonAccounting/reductionScene/:pageTypeInfo/:id',
  /** 核算报告**/
  'accountingReport' = '/carbonAccounting/accountingReport',
  /** 核算报告 新增 编辑 查看****/
  'accountingReportInfo' = '/carbonAccounting/accountingReport/:pageTypeInfo/:id',
  /** *核算报告 -  选择减排场景***/

  'accountingReportInfoChooseScreen' = '/carbonAccounting/accountingReport/:pageTypeInfo/:id/:chooseType/',
  'accountingReportInfoChooseScreenDetail' = '/carbonAccounting/accountingReport/:pageTypeInfo/:id/:chooseType/:serenPageTypeInfo/:sercenId',
}
