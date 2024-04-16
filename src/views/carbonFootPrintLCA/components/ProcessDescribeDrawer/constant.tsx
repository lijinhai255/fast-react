import { PageTypeInfo } from '@/router/utils/enums';

const { add, edit, copy, show } = PageTypeInfo;

/** 抽屉标题 */
export const DRAWER_TITLE = {
  [add]: '新增过程',
  [edit]: '编辑过程描述',
  [copy]: '复制过程',
  [show]: '过程描述详情',
};

/** 多输出分配 枚举 */
export const OUTPUT_ALLOCATION_OPTIONS = [
  {
    label: '无',
    value: 1,
  },
  {
    label: '物理分配',
    value: 2,
  },
  {
    label: '经济分配',
    value: 3,
  },
  {
    label: '其他方法',
    value: 4,
  },
];

/** 数据类型 枚举 */
export const DATA_TYPE_OPTIONS = [
  {
    label: '实景数据',
    value: 1,
  },
  {
    label: '背景数据',
    value: 2,
  },
];
