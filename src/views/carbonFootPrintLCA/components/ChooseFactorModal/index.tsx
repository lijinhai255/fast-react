/**
 * @description 选择因子弹窗
 */
import { Modal, Button } from 'antd';
import { useState } from 'react';
import { withTable } from 'table-render';

import { TableRender } from '@/components/x-render/TableRender';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';

import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getChooseFactorList } from './service';
import { Request, Factor } from './type';

interface ChooseFactorModalProps {
  /** 弹窗显隐 */
  open: boolean;
  /** 点击取消按钮的方法 */
  handleCancel: () => void;
  /** 点击确定按钮的方法 */
  handleOk: (data?: {
    selectRows?: Factor[];
    selectedRowKeys?: React.Key[];
  }) => void;
}

const ChooseFactorModal = ({
  open,
  handleCancel,
  handleOk,
}: ChooseFactorModalProps) => {
  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<Factor[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 是否禁用 */
  const disabled = selectedRowKeys.length === 0;

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: Factor[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const searchApi: CustomSearchProps<Factor, Request> = args =>
    getChooseFactorList({
      ...args,
      status: 0, // 启用的因子
    }).then(({ data }) => {
      return data?.data;
    });

  return (
    <Modal
      wrapClassName={`${style.wrapper}`}
      centered
      title='选择因子'
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
        <TableRender<Factor, Request>
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
          }}
          autoFixNoText
        />
      </div>
    </Modal>
  );
};
export default withTable(ChooseFactorModal);
