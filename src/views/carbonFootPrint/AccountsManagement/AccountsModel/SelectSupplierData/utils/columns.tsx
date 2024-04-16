/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 22:25:48
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 14:47:34
 */

import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { ProductDto } from '@/sdks_v2/new/computationV2ApiDocs';

/** 选择供应商数据-表头 */
export const columns = ({
  onDetail,
}: {
  onDetail?: (data: ProductDto) => void;
}): TableRenderProps<ProductDto>['columns'] => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    title: '核算单位',
    dataIndex: 'productUnit',
  },
  {
    title: '系统边界',
    dataIndex: 'periodType_name',
  },
  {
    title: '单位产品排放量（kgCO₂e/核算单位）',
    dataIndex: 'dischargeRate',
  },
  {
    title: '核算周期',
    dataIndex: 'beginDate',
    render: (value, record) => {
      const { endTime } = record;
      return value && endTime ? `${value} 至 ${endTime}` : '-';
    },
  },
  {
    title: '获取时间',
    dataIndex: 'submitTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    fixed: 'right',
    render: (_, row) => {
      return (
        <TableActions
          menus={compact([
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                onDetail?.(row);
              },
            },
          ])}
        />
      );
    },
  },
];
