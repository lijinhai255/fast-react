/** 系统边界类型 */
export const SYSTEM_BOUNDARY_TYPE = {
  /** 半生命周期 */
  HALF_LIFE_CYCLE: 1,
  /** 全生命周期 */
  COMPLETE_LIFE_CYCLE: 2,
  /** 产品生产周期 */
  PRODUCT_LIFE_CYCLE: 3,
  /** 自定义生命周期 */
  CUSTOM_LIFE_CYCLE: 4,
} as const;

const {
  HALF_LIFE_CYCLE,
  COMPLETE_LIFE_CYCLE,
  PRODUCT_LIFE_CYCLE,
  CUSTOM_LIFE_CYCLE,
} = SYSTEM_BOUNDARY_TYPE;

/** 系统边界的列表 */
export const options = [
  {
    label: '半生命周期',
    describe: '（摇篮到大门：从资源开采到产品出厂）',
    value: HALF_LIFE_CYCLE,
    selectedChildren: [
      {
        label: '原材料获取及预加工',
        value: 1,
        checked: true,
      },
      {
        label: '生产制造',
        value: 2,
        checked: true,
      },
    ],
    children: [
      {
        label: '分销和储存',
        value: 3,
      },
    ],
  },
  {
    label: '全生命周期',
    describe: '（摇篮到坟墓：从资源开采到产品废弃）',
    value: COMPLETE_LIFE_CYCLE,
    selectedChildren: [
      {
        label: '原材料获取及预加工',
        value: 1,
        checked: true,
      },
      {
        label: '生产制造',
        value: 2,
        checked: true,
      },
      {
        label: '分销和储存',
        value: 3,
        checked: true,
      },
      {
        label: '产品使用',
        value: 4,
        checked: true,
      },
      {
        label: '废弃处置',
        value: 5,
        checked: true,
      },
    ],
    children: undefined,
  },
  {
    label: '产品生产周期',
    describe: '（大门到大门：从原材料进厂到产品出厂）',
    value: PRODUCT_LIFE_CYCLE,
    selectedChildren: [
      {
        label: '生产制造',
        value: 2,
        checked: true,
      },
    ],
    children: [
      {
        label: '分销和储存',
        value: 3,
      },
    ],
  },
  {
    label: '自定义生命周期',
    value: CUSTOM_LIFE_CYCLE,
    selectedChildren: undefined,
    children: [
      {
        label: '原材料获取及预加工',
        value: 1,
      },
      {
        label: '生产制造',
        value: 2,
      },
      {
        label: '分销和储存',
        value: 3,
      },
      {
        label: '产品使用',
        value: 4,
      },
      {
        label: '废弃处置',
        value: 5,
      },
    ],
  },
];
