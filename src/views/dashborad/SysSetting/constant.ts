/** 是否可以 */
export const ISCAN = {
  /** 可以 */
  CAN: 1,
  /** 不可以 */
  CANNOT: 0,
} as const;

/** 是否可以撤回枚举 */
export const WITHDRAW_ENUM = [
  { label: '可以撤回', value: ISCAN.CAN },
  { label: '不可以撤回', value: ISCAN.CANNOT },
];

/** 是否可以编辑枚举 */
export const EDIT_ENUM = [
  { label: '可以编辑', value: ISCAN.CAN },
  { label: '不可以编辑', value: ISCAN.CANNOT },
];

/** 左侧tab */
export const TABS = [
  {
    id: 1,
    modelName: '企业碳核算',
  },
  {
    id: 2,
    modelName: '碳核算行业版',
  },
];

/** 类型标识 */
export const TYPES = {
  /** 企业碳核算 */
  ENTERPRISE_CARBON_ACCOUNTING: 0,
  /** 碳核算行业版 */
  CARBON_ACCOUNTING_INDUSTRY_EDITION: 1,
};

/** 接口字段枚举 */
export const REQ_ENUM = {
  /** 排放数据审核通过后，是否可以撤回 */
  DATAAUDIOLLBACK: 'dataAuditRollback',
  /** 基准年设定时，查询的核算数据，是否可以编辑 */
  EMISSIONSTANDARDEDIT: 'emissionStandardEdit',
};
