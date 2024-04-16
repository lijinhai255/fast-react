/**
 * @description 排放源清单columns
 */
import { ColumnsType } from 'antd/lib/table';

import { EmissionSourceResp } from '@/sdks_v2/new/computationV2ApiDocs';

export type EmissionListType = EmissionSourceResp & {
  categoryNameRowSpan?: number;
  classifyNameRowSpan?: number;
};

export const columns = (): ColumnsType<EmissionListType> => {
  return [
    {
      title: '排放分类',
      dataIndex: 'categoryName',
      onCell: record => {
        return { rowSpan: record.categoryNameRowSpan };
      },
    },
    {
      title: '排放类别',
      dataIndex: 'classifyName',
      onCell: record => {
        return { rowSpan: record.classifyNameRowSpan };
      },
    },
    {
      title: '排放源',
      dataIndex: 'sourceName',
    },
    {
      title: '排放量（tCO₂e）',
      dataIndex: 'emission',
    },
    {
      title: '排放量占比（%）',
      dataIndex: 'emissionProportion',
    },
  ];
};
