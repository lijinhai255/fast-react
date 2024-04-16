/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-27 14:17:33
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 15:14:59
 */
import { DataSourceType } from './types';

/** 数据质量评价-排放因子-弹窗表格内容以及下拉框枚举内容 */
export const onFactorOptionsFn = (key: string, flag?: boolean) => {
  const factorOptionsMap = new Map([
    [
      'timeCorrelation',
      {
        5: flag ? '<5年' : '小于5年',
        3: '5-10年',
        2: '10-15年',
        1: flag ? '>15年（及未知年份）' : '大于15年',
      },
    ],
    [
      'zoneCorrelation',
      {
        5: flag ? '完全符合所评估产品生产地点' : '产品生产地数据',
        3: flag ? '数据为国家层面的数据' : '国家数据',
        1: flag ? '数据为全球平均数据' : '全球平均数据',
      },
    ],
    [
      'technologyCorrelation',
      {
        5: flag ? '完全符合所评估产品生产技术' : '产品生产技术数据',
        3: '行业平均数据',
        1: '替代数据',
      },
    ],
    [
      'dataAccuracy',
      {
        5: '变异性低',
        3: '变异性未量化，考虑为较低',
        2: '变异性未量化，考虑为较高',
        1: '变异性高',
      },
    ],
    [
      'methodology',
      {
        5: 'PAS 2050/补充要求所规定的排放因子',
        3: '政府/国际政府组织/行业发布的排放因子',
        1: '公司/其他机构发布的排放因子',
      },
    ],
  ]);
  return factorOptionsMap.get(key);
};

/** 数据质量评价-排放因子-弹窗表格类型 */
const factorTableType = [
  {
    name: '时间相关性',
    data: onFactorOptionsFn('timeCorrelation', true),
  },
  {
    name: '地域相关性',
    data: onFactorOptionsFn('zoneCorrelation', true),
  },
  {
    name: '技术相关性',
    data: onFactorOptionsFn('technologyCorrelation', true),
  },
  {
    name: '数据准确度',
    data: onFactorOptionsFn('dataAccuracy'),
  },
  {
    name: '方法学',
    data: onFactorOptionsFn('methodology'),
  },
];

/** 数据质量评价-排放因子-弹窗各个类型表格数据处理 */
export const factorDataSource = (obj: DataSourceType) => {
  return Object.keys(obj)
    .reverse()
    .map((key, index) => ({
      score: key,
      label: obj[key],
      value: index + 1,
    }));
};

/** 数据质量评价-排放因子-弹窗表格 */
export const factorData = factorTableType.map(({ name, data }) => ({
  title: `排放因子的质量评级-${name}`,
  columns: [
    {
      title: name === '方法学' ? `${name}的适合性及一致性` : name,
      dataIndex: 'label',
    },
    {
      title: '分值',
      dataIndex: 'score',
      width: 100,
    },
  ],
  dataSource: factorDataSource(data as DataSourceType),
}));
