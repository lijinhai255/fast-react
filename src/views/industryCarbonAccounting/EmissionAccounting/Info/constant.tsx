/** 数据收集周期类别 */
export const COLLECT_CTCLE_TYPE = {
  /** 按年 */
  YEAR: 0,
  /** 按季度 */
  QUARTER: 1,
  /** 按月 */
  MONTH: 2,
} as const;

/** 数据收集周期枚举 */
export const COLLECT_CTCLE_OPTIONS = [
  {
    label: '按年',
    value: COLLECT_CTCLE_TYPE.YEAR,
  },
  {
    label: '按季度',
    value: COLLECT_CTCLE_TYPE.QUARTER,
  },
  {
    label: '按月',
    value: COLLECT_CTCLE_TYPE.MONTH,
  },
];
