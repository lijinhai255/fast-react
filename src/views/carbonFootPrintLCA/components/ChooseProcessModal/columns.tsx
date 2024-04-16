import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { ChooseProcessLibrary } from './type';

export const columns =
  (): TableRenderProps<ChooseProcessLibrary>['columns'] => {
    return compact([
      {
        title: '序号',
        dataIndex: 'allIndex',
        width: 80,
      },
      {
        title: '过程名称',
        dataIndex: 'processName',
      },
      {
        title: '产品名称',
        dataIndex: 'outputProductName',
      },
      {
        title: '产品单位',
        dataIndex: 'productUnitName',
      },
      {
        title: '时间代表性',
        dataIndex: 'timeRepresent',
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
        dataIndex: 'dataSource',
      },
    ]);
  };
