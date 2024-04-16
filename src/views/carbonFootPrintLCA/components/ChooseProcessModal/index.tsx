/**
 * @description 选择过程弹窗
 */
import { Modal, Button } from 'antd';
import { useState } from 'react';
import { withTable } from 'table-render';

import { TableRender } from '@/components/x-render/TableRender';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getChooseProcessList } from './service';
import { ChooseProcessLibrary, ChooseProcessLibraryRequest } from './type';

interface ChooseProcessModalProps {
  /** 弹窗显隐 */
  open: boolean;
  /** 接口需求传递的额外参数 */
  extraParams?: {
    /** 剔除的过程id */
    notProcessId?: number;
  };
  /** 点击取消按钮的方法 */
  handleCancel: () => void;
  /** 点击确定按钮的方法 */
  handleOk: (data?: {
    selectRows?: ChooseProcessLibrary[];
    selectedRowKeys?: React.Key[];
  }) => void;
}
const ChooseProcessModal = ({
  open,
  extraParams,
  handleCancel,
  handleOk,
}: ChooseProcessModalProps) => {
  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<ChooseProcessLibrary[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 是否禁用 */
  const disabled = selectedRowKeys.length === 0;

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: ChooseProcessLibrary[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const searchApi: CustomSearchProps<
    ChooseProcessLibrary,
    ChooseProcessLibraryRequest
  > = args =>
    getChooseProcessList({
      ...args,
      ...extraParams,
    }).then(({ data }) => {
      return data?.data;
    });

  return (
    <Modal
      wrapClassName={`${style.wrapper}`}
      centered
      title='选择过程'
      open={open}
      width='70%'
      maskClosable={false}
      destroyOnClose
      onCancel={() => {
        /** 关闭弹窗取消弹窗表格选中 */
        setSelectedRowKeys([]);
        handleCancel();
      }}
      footer={[
        <Button
          onClick={() => {
            /** 关闭弹窗取消弹窗表格选中 */
            setSelectedRowKeys([]);
            handleCancel();
          }}
        >
          取消
        </Button>,
        <Button
          disabled={disabled}
          onClick={async () => {
            handleOk({ selectRows, selectedRowKeys });
            /** 关闭弹窗取消弹窗表格选中 */
            setSelectedRowKeys([]);
          }}
          type='primary'
        >
          确定
        </Button>,
      ]}
    >
      <div className={style.tableModalWrapper}>
        <TableRender<ChooseProcessLibrary, ChooseProcessLibraryRequest>
          searchProps={{
            schema: searchSchema(),
            api: searchApi,
            searchOnMount: false,
          }}
          tableProps={{
            columns: columns(),
            rowSelection: {
              type: 'radio',
              columnWidth: 48,
              ...rowSelection,
            },
            scroll: { y: 500 },
            rowKey: 'outputProductId',
          }}
          autoFixNoText
        />
      </div>
    </Modal>
  );
};
export default withTable(ChooseProcessModal);
