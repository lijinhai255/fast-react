/** 导航标签类型 */
export const TAB_TYPE = {
  /** 排放数据 */
  EMISSION_DATA: '1',
  /** 审核详情 */
  APPROVAL_INFO: '2',
} as const;

/** 导航标签枚举 */
export const TAB_OPTIONS = [
  {
    label: '排放数据',
    key: TAB_TYPE.EMISSION_DATA,
  },
  {
    label: '审核详情',
    key: TAB_TYPE.APPROVAL_INFO,
  },
];
