import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Factor } from '@/sdks/systemV2ApiDocs';

/** 状态。0 启用 1 禁用 */
export const status = {
  0: '启用',
  1: '禁用',
};

export const columns = ({
  onDetailClick,
}: {
  onDetailClick?: (row: Factor) => void;
}): TableRenderProps<Factor>['columns'] => [
  {
    title: '名称',
    dataIndex: 'name',
    // copyable: true,
    fixed: 'left',
  },
  {
    title: '因子数值',
    dataIndex: 'factorValue',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '发布年份',
    dataIndex: 'year',
  },
  {
    title: '发布机构',
    dataIndex: 'institution',
  },
  {
    title: '适用场景',
    dataIndex: 'description',
  },
  {
    title: '操作',
    dataIndex: 'content',
    fixed: 'right',
    width: 140,
    render(_, row) {
      return (
        <TableActions
          menus={compact([
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                onDetailClick?.(row);
              },
            },
          ])}
        />
      );
    },
  },
];
