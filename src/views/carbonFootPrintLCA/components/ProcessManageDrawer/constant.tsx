import { LIFE_CYCLE_TYPE } from '../ProcessManageTable/constant';

/** 产品类型 */
export const PRODUCTION_TYPE = {
  /** 主产品 */
  MAIN_PRODUCT: 1,
  /** 副产品 */
  SIDE_PRODUCT: 2,
  /** 避免产品 */
  AVOID_PRODUCT: 3,
} as const;

const { MAIN_PRODUCT, SIDE_PRODUCT, AVOID_PRODUCT } = PRODUCTION_TYPE;

/** 产品类型的枚举值 */
export const PRODUCTION_TYPE_OPTIONS = [
  {
    label: '主产品',
    value: MAIN_PRODUCT,
  },
  {
    label: '副产品',
    value: SIDE_PRODUCT,
  },
  {
    label: '避免产品',
    value: AVOID_PRODUCT,
  },
];

/** 输入类型 */
export const INPUT_TYPE = {
  /** 原材料 */
  RAW_MATERIAL: 1,
  /** 耗材 */
  CONSUMABLES: 2,
  /** 包装材料 */
  PACKAGING: 3,
  /** 能耗 */
  ENERGY_CONSUMPTION: 4,
  /** 水耗 */
  WATER_CONSUMPTION: 5,
  /** 运输 */
  TRANSPORT: 6,
  /** 资本货物 **/
  CAPITAL_GOODS: 7,
  /** 处置产品 */
  DISPOSAL_PRODUCTS: 8,
} as const;

const {
  RAW_MATERIAL,
  CONSUMABLES,
  PACKAGING,
  ENERGY_CONSUMPTION,
  WATER_CONSUMPTION,
  TRANSPORT,
  CAPITAL_GOODS,
  DISPOSAL_PRODUCTS,
} = INPUT_TYPE;

/** 输入类型的枚举值 */
export const INPUT_TYPE_OPTIONS = [
  {
    label: '原材料',
    value: RAW_MATERIAL,
  },
  {
    label: '耗材',
    value: CONSUMABLES,
  },
  {
    label: '包装材料',
    value: PACKAGING,
  },
  {
    label: '能耗',
    value: ENERGY_CONSUMPTION,
  },
  {
    label: '水耗',
    value: WATER_CONSUMPTION,
  },
  {
    label: '运输',
    value: TRANSPORT,
  },
  {
    label: '资本货物',
    value: CAPITAL_GOODS,
  },
  {
    label: '处置产品',
    value: DISPOSAL_PRODUCTS,
  },
];

/** 生命周期阶段的枚举 */
export const LIFE_CYCLE_OPTIONS = [
  {
    label: '原材料获取及预加工',
    value: LIFE_CYCLE_TYPE.RAW_MATERIAL,
  },
  {
    label: '生产制造',
    value: LIFE_CYCLE_TYPE.PRODUCTION_MANUFACTURING,
  },
];

/** 运输类型 */
export const TRANSPORT_TYPE = {
  /** 按里程 */
  MILEAGE: 1,
  /** 按能耗 */
  ENERGY: 2,
};

const { MILEAGE, ENERGY } = TRANSPORT_TYPE;

/** 运输枚举  */
export const TRANSPORT_TYPE_OPTIONS = [
  {
    label: '按里程',
    value: MILEAGE,
  },
  {
    label: '按能耗',
    value: ENERGY,
  },
];

/** 输出类型 */
export const OUTPUT_TYPE = {
  /** 废气 */
  WASTE_GAS: 9,
  /** 废水 */
  WASTE_WATER: 10,
  /** 固体废弃物 */
  WASTE: 11,
  /** 可再生输出物 */
  RENEWABLE_OUTPUTS: 12,
  /** 待处理输出物 */
  PROCESSED_OUTPUTS: 13,
} as const;

const { WASTE_GAS, WASTE_WATER, WASTE, RENEWABLE_OUTPUTS, PROCESSED_OUTPUTS } =
  OUTPUT_TYPE;

/** 输出类型的枚举值 */
export const OUTPUT_TYPE_OPTIONS = [
  {
    label: '废气',
    value: WASTE_GAS,
  },
  {
    label: '废水',
    value: WASTE_WATER,
  },
  {
    label: '固体废弃物',
    value: WASTE,
  },
  {
    label: '可再生输出物',
    value: RENEWABLE_OUTPUTS,
  },
  {
    label: '待处理输出物',
    value: PROCESSED_OUTPUTS,
  },
];

/** 上下游数据选择按钮的类型 */
export const SELECT_BUTTON_TYPE = {
  /** 过程数据 */
  PROCESS_DATA: 1,
  /** 因子数据库 */
  FACTOR_DATA: 2,
} as const;

const { PROCESS_DATA, FACTOR_DATA } = SELECT_BUTTON_TYPE;

/** 选择按钮的枚举 */
export const SELECT_BUTTON_OPTIONS = [
  {
    label: '过程数据',
    value: PROCESS_DATA,
  },
  {
    label: '因子数据',
    value: FACTOR_DATA,
  },
];
