/*
 * @@description:
 */
export enum TypeChangeProManage {
  operationalData, // 运营数据
  operationalIndicators, // 运营指标
}
export enum TypeCurrenModal {
  ADD = 'ADD',
  EDIT = 'EDIT',
  SHOW = 'SHOW',
}
export const CurrentModalObj = {
  ADD: '新增',
  EDIT: '编辑',
  SHOW: '查看',
};
export type PageType = 'ADD' | 'EDIT' | 'SHOW';
