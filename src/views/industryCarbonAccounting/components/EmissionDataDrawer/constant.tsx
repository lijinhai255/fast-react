/** 字段类型 */
export const FILED_TYPE = {
  /** 生产单元 */
  PRODUCT_CELL: 0,
  /** 物料类型 */
  MATERIAL: 1,
  /** 其他类型 */
  OTHER: 2,
} as const;

/** 取值方式 */
export const DATA_SETTING_TYPE = {
  /** 固定值 */
  FIXED_VALUE: 0,
  /** 录入值 */
  INPUT_VALUE: 1,
  /** 枚举值 */
  ENUM_VALUE: 2,
} as const;

/** 参数类型 */
export const PARAMETER_TYPE = {
  /** 主体参数 */
  MAIN_PARAMETER: 0,
  /** 实体参数 */
  ENTITY_PARAMETER: 1,
} as const;

/** 数据格式 */
export const DATA_FORMAT_TYPE = {
  /** 数值 */
  NUMERICAL_VALUE: 0,
  /** 文本 */
  TEXT: 1,
  /** 文件 */
  FILE: 2,
} as const;
