/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-07 18:02:30
 */
import type { ColumnsType } from 'antd/es/table';

import { ComputationProcess } from '@/sdks_v2/new/supplychainV2ApiDocs';

export type TypeComputation = ComputationProcess & {
  ghgCategory_name?: string;
  isoCategory_name?: string;
};

export const columns = (): ColumnsType<TypeComputation> => [
  {
    title: '排放源名称',
    dataIndex: 'sourceName',
  },
  {
    title: '排放设施/活动',
    dataIndex: 'facility',
  },
  {
    title: '活动数据',
    dataIndex: 'dataValue',
  },
  {
    title: '排放因子',
    dataIndex: 'factorDesc',
  },
  {
    title: '排放量（tCO₂e）',
    dataIndex: 'carbonEmission',
  },
  {
    title: 'GHG分类',
    dataIndex: 'ghgClassify_name',
    render: (text, record) => {
      return `${record?.ghgCategory_name}, ${text}`;
    },
  },
  {
    title: 'ISO分类',
    dataIndex: 'isoClassify_name',
    render: (text: string, record) => {
      return `${record?.isoCategory_name},${text}`;
    },
  },
  {
    title: '排放源ID',
    dataIndex: 'sourceCode',
  },
];
