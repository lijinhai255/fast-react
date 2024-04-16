/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-27 14:17:33
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 15:17:03
 */

/** 活动数据弹窗表格数据 */
export const activityDataSource = [
  {
    label: '量测值',
    value: 1,
    activeLevel: '好',
    desc: '量测值：实际量测数值，如电表、水表、领用记录、采购单据等记录的实际使用数值或有依据的分配值。',
    score: 5,
  },
  {
    label: '计算值',
    value: 2,
    activeLevel: '较好',
    desc: '计算值：以某合理方法进行计算的数值，如有记录的数据，经数据有关人士计算和分配后的数值。',
    score: 3,
  },
  {
    label: '理论值/经验值',
    value: 3,
    activeLevel: '一般',
    desc: '理论值/经验值：根据理论推导算出的数值或现场操作经验值。',
    score: 2,
  },
  {
    label: '参考文献',
    value: 4,
    activeLevel: '差',
    desc: '参考文献：由其他文献（如学术文献、法规限制值）取得的资料或其他类似工厂评估得到的数值。',
    score: 1,
  },
];

/** 数据质量评价-排放因子下拉选择框类型 */
export const facorSelectTypeWithScore = [
  /** 时间相关性 */
  ['timeCorrelation', 'timeScore'],
  /** 地域相关性 */
  ['zoneCorrelation', 'zoneScore'],
  /** 技术相关性 */
  ['technologyCorrelation', 'technologyScore'],
  /** 数据准确度 */
  ['dataAccuracy', 'accuracyScore'],
  /** 方法学 */
  ['methodology', 'methodScore'],
];
