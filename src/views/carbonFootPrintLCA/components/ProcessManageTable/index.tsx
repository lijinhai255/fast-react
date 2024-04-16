/**
 * @description 过程管理表格（产品、输入、输出）
 */

import { ProTable } from '@ant-design/pro-components';
import type {
  ActionType,
  ProColumns,
  ProTableProps,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import { keyBy } from 'lodash-es';
import { useEffect, useMemo, useRef } from 'react';

import { PageTypeInfo } from '@/router/utils/enums';

import { ColumnsProps } from './columns';
import { PROCESS_CATATYPE_LABEL } from './constant';
import style from './index.module.less';
import { InputOutput } from './type';

interface ParamsType {
  category: number;
  processId: number;
}

interface ProcessManageTableProps {
  /** 过程管理表格类别: 1 输入; 2 输出; 3 产品 */
  categoryType: number;
  /** 列表表头数据 */
  columns: (props: ColumnsProps) => ProColumns<InputOutput>[];
  /** 是否展示操作按钮 */
  showActionBtn: boolean;
  /** 是否展示完整的过程表格 */
  showWholeProcess: boolean;
  /** 刷新标识 */
  refreshFlag: boolean;
  /** 表格属性 */
  proTableProps: ProTableProps<InputOutput, ParamsType>;
  /** 过程管理点击操作按钮的方法 */
  onActionBtnClick: (type?: string, id?: number) => void;
  /** 点击过程上下游数据的方法 */
  onProcessDataClick?: (columnId: number) => void;
  /** 点击删除按钮的方法 */
  onProcessManageDeleteClick?: (
    id: number,
    successCallBack: () => void,
  ) => void;
  /** 类型：产品-更新分配系数 */
  onUpdateCoefficientFn?: (
    data: InputOutput,
    successCallBack: () => void,
  ) => void;
}

const ProcessManageTable = ({
  categoryType,
  columns,
  showActionBtn,
  showWholeProcess = false,
  refreshFlag,
  proTableProps,
  onActionBtnClick,
  onProcessDataClick,
  onProcessManageDeleteClick,
  onUpdateCoefficientFn,
}: ProcessManageTableProps) => {
  const tableRef = useRef<ActionType>();

  const columnsStateDefault = useMemo(() => {
    return keyBy(columns, 'dataIndex');
  }, []);

  /** 过程管理表格的类别名称 */
  const categoryName =
    PROCESS_CATATYPE_LABEL[categoryType as keyof typeof PROCESS_CATATYPE_LABEL];

  /** 表格刷新操作 */
  useEffect(() => {
    tableRef?.current?.reload();
  }, [refreshFlag]);

  return (
    <div className={style.productionWrapper}>
      <div className={style.headerWrapper}>
        <span>{showWholeProcess ? categoryName : ''}</span>
        {showActionBtn && (
          <Button
            type='primary'
            onClick={() => {
              onActionBtnClick(PageTypeInfo.add);
            }}
          >
            新增
          </Button>
        )}
      </div>
      <ProTable
        {...proTableProps}
        actionRef={tableRef}
        columns={columns({
          showActionBtn,
          onActionBtnClick,
          onProcessDataClick,
          onProcessManageDeleteClick,
          onUpdateCoefficientFn,
        })}
        pagination={
          showWholeProcess ? false : { pageSize: 10, showTotal: undefined }
        }
        scroll={{ x: 1200 }}
        search={false}
        columnsState={{
          persistenceKey: 'ProcessManageTable',
          persistenceType: 'localStorage',
          defaultValue: columnsStateDefault,
        }}
        toolBarRender={false}
      />
    </div>
  );
};
export default ProcessManageTable;
