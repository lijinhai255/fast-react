/*
 * @@description: 选择列表
 */
import { compact } from 'lodash-es';
import { Key, useEffect, useState } from 'react';
import { useTable, withTable } from 'table-render';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { TableRender } from '@/components/x-render/TableRender';

interface SelectTableRenderProps<RecordType extends object> {
  searchProps: SearchProps<RecordType>;
  /** api接口：获取列表数据 */
  searchApi: SearchProps<RecordType>['api'];
  /** 带过来的名称搜索值 */
  likeName?: string;
  /** 表头配置项 */
  columns: TableRenderProps<RecordType>['columns'];
  /** 确定按钮的事件 */
  onComfirm?: (id: Key) => void;
  /** 取消按钮的事件 */
  onCancel?: () => void;
}

export const SelectTable = <RecordType extends object = any>({
  searchProps,
  searchApi,
  likeName,
  columns,
  onComfirm,
  onCancel,
}: SelectTableRenderProps<RecordType>) => {
  const { form } = useTable();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 选中表格 */
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  useEffect(() => {
    form.setValues({
      likeProductName: likeName,
    });
  }, []);

  return (
    <div>
      <TableRender
        searchProps={{
          ...searchProps,
          searchOnMount: false,
          api: searchApi,
        }}
        tableProps={{
          rowSelection: {
            type: 'radio',
            ...rowSelection,
          },
          rowKey: 'applyInfoId',
          columns,
          scroll: { x: 1400 },
        }}
        autoAddIndexColumn
        autoFixNoText
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '确定',
            type: 'primary',
            disabled: selectedRowKeys.length === 0,
            onClick: async () => {
              onComfirm?.(selectedRowKeys[0]);
            },
          },
          {
            title: '取消',
            onClick: async () => {
              onCancel?.();
            },
          },
        ])}
      />
    </div>
  );
};
export default withTable(SelectTable);
