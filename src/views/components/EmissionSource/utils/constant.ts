/*
 * @@description:
 */

export const CHOOSE_FACTOR = {
  FORM_VALUES: 'emissionManageValues',
  FACTOR_ID: 'factorId',
  SCREEN_ID: 'screenId',
} as const;

/** 排放因子选择方式 */
export const FACTOR_SELECT_WAY = {
  FACTOR: '1',
  FACTOR_CREATE: '2',
  SUPPLIER: '3',
};

export const FACTOR_SELECT_WAY_TEXT = {
  [FACTOR_SELECT_WAY.FACTOR]: '排放因子',
  [FACTOR_SELECT_WAY.FACTOR_CREATE]: '新建因子',
  [FACTOR_SELECT_WAY.SUPPLIER]: '供应商数据',
};
