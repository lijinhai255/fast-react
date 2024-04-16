/** 缺省值类型 */
export const DEFAULTVALUE_TYPE = {
  /** 输入框 */
  INPUT: 0,
  /** 表格 */
  TABLE: 1,
} as const;

/** 取值方式 */
export const DATASETTING = {
  /** 固定值 */
  FIXED_VALUE: 0,
  /** 录入值 */
  INPUT_VALUE: 1,
  /** 枚举值 */
  ENUMERATED_VALUE: 2,
} as const;
