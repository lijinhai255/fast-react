import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { ChooseInputOutputLibrary } from '@/views/carbonFootPrintLCA/components/ProcessManageDrawer/type';

export const columns =
  (): TableRenderProps<ChooseInputOutputLibrary>['columns'] => {
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
        title: '输入名称',
        dataIndex: 'name',
      },
      {
        title: '输入类型',
        dataIndex: 'inputOutputType_name',
      },
      {
        title: '输入数量',
        dataIndex: 'count',
      },
      {
        title: '输入单位',
        dataIndex: 'unitName',
      },
    ]);
  };
