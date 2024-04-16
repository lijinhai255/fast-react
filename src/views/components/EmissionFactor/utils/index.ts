/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 16:10:36
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-16 19:27:55
 */

/**
 * @description 类型枚举值
 * stage：生命周期阶段 1:原材料获取 2:生产制造 3:分销与存储 4:产品使用 5:废弃使用
 */
export const materialsTypeList = (stage: string) => {
  const list = ['主料', '辅料', '包装材料', '再生材料', '能耗', '水耗', '运输'];
  switch (Number(stage)) {
    case 2:
      list.push('加工');
      break;
    case 4:
      list.push('使用');
      break;
    case 5:
      list.push('废弃处置');
      break;
    default:
      list.push();
      break;
  }
  return list;
};

/** 根据表单路径 赋予表单title/label值 */
export const emissionDataFieldState = new Map([
  [
    'factorName',
    {
      factor: '排放因子名称',
      supplier: '采购产品',
    },
  ],
  [
    'factorValue',
    {
      factor: '排放因子数值',
      supplier: '单位产品排放量',
    },
  ],
  [
    'factorUnit',
    {
      factor: '排放因子单位',
      supplier: '单位',
    },
  ],
  [
    'percentMeasure',
    {
      factor: '单位换算比例（数量单位/排放因子分母单位）',
      supplier: '单位换算比例（数量单位/核算单位）',
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
    'factorYear',
    {
      factor: '发布年份',
      supplier: '核算年份',
    },
  ],
]);
