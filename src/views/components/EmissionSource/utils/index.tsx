/** 根据表单路径 赋予表单title/label值 */
export const emissionDataFieldState = new Map([
  [
    'unitConver',
    {
      factor: '单位换算比例（活动数据单位/排放因子分母单位）',
      supplier: '单位换算比例（活动数据单位/单位）',
    },
  ],
  [
    'factorSource',
    {
      factor: '排放因子来源',
      supplier: '供应商名称',
    },
  ],
  [
    'year',
    {
      factor: '发布年份',
      supplier: '核算年份',
    },
  ],
]);
