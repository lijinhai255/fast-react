/** 生命周期阶段 */
export const LIFE_CYCLE_TYPE = {
  /** 原材料获取及预加工 */
  RAW_MATERIAL: 1,
  /** 生产制造 */
  PRODUCTION_MANUFACTURING: 2,
  /** 分销和储存 */
  DISTRIBUTION_STORAGE: 3,
  /** 产品使用 */
  PRODUCT_USE: 4,
  /** 废弃处置 */
  WASTE_DISPOSAL: 5,
} as const;

const {
  RAW_MATERIAL,
  PRODUCTION_MANUFACTURING,
  DISTRIBUTION_STORAGE,
  PRODUCT_USE,
  WASTE_DISPOSAL,
} = LIFE_CYCLE_TYPE;

/** 生命周期阶段对应的输入名称 */
export const LIFE_CYCLE_LABLE = {
  [RAW_MATERIAL]: '原材料',
  [PRODUCTION_MANUFACTURING]: '输入',
  [DISTRIBUTION_STORAGE]: '分销场景',
  [PRODUCT_USE]: '使用场景',
  [WASTE_DISPOSAL]: '输入',
} as const;

/** 过程管理的类别  */
export const PROCESS_CATATYPE = {
  /** 输入  */
  INPUT: 1,
  /** 输出 */
  OUTPUT: 2,
  /** 产品 */
  PRODUCTION: 3,
} as const;

const { INPUT, OUTPUT, PRODUCTION } = PROCESS_CATATYPE;

/** 过程管理的类别名称 */
export const PROCESS_CATATYPE_LABEL = {
  [INPUT]: '输入',
  [OUTPUT]: '输出',
  [PRODUCTION]: '产品',
};

/** 可再生输出物类型关联的输入 带的标签 */
export const RENEWING_TYPE = {
  REGENERATION: '再生',
  RECOVERY: '回收',
};
