/**
 * @description 选择输入
 */
import { Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useTable, withTable } from 'table-render';

import { TableRender } from '@/components/x-render/TableRender';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { ChooseInputOutputLibrary } from '@/views/carbonFootPrintLCA/components/ProcessManageDrawer/type';

import { columns } from './columns';
import style from './index.module.less';
import { searchSchema } from './schemas';
import { getChooseInputList } from '../../../service';
import { ChooseInputRequest } from '../../../type';

interface ChooseInputModalProps {
  /** 弹窗显隐 */
  open: boolean;
  /** 过程id */
  processId?: number;
  /** 输入名称 */
  inputName?: string;
  /** 点击取消按钮的方法 */
  handleCancel: () => void;
  /** 点击确定按钮的方法 */
  handleOk: (data?: {
    selectRows?: ChooseInputOutputLibrary[];
    selectedRowKeys?: React.Key[];
  }) => void;
}

const ChooseInputModal = ({
  open,
  processId = 0,
  inputName,
  handleCancel,
  handleOk,
}: ChooseInputModalProps) => {
  const { form } = useTable();

  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<ChooseInputOutputLibrary[]>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 是否禁用 */
  const disabled = selectedRowKeys.length === 0;

  useEffect(() => {
    form.setValues({
      inputName,
    });
  }, [inputName]);

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: ChooseInputOutputLibrary[],
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
    ChooseInputOutputLibrary,
    ChooseInputRequest
  > = args =>
    getChooseInputList({
      ...args,
      modelId: processId,
    }).then(({ data }) => {
      return data?.data;
    });

  return (
    <Modal
      wrapClassName={`${style.wrapper}`}
      centered
      title='选择输入'
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
        <TableRender<ChooseInputOutputLibrary, ChooseInputRequest>
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
export default withTable(ChooseInputModal);
