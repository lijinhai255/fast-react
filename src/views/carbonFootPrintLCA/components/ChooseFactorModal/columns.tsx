import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { Factor } from './type';

export const columns = (): TableRenderProps<Factor>['columns'] => {
  return compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
    },
    {
      title: '因子名称',
      dataIndex: 'name',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '产品单位',
      dataIndex: 'unit',
    },
    {
      title: '时间代表性',
      dataIndex: 'year',
    },
    {
      title: '地理代表性',
      dataIndex: 'areaRepresentName',
    },
    {
      title: '技术代表性',
      dataIndex: 'techRepresent',
    },
    {
      title: '数据来源',
      dataIndex: 'institution',
    },
  ]);
};
