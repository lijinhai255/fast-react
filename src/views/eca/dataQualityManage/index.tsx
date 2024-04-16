/*
 * @@description:
 */
/**
 * @description 数据质量管理列表
 */

import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import {
  ControlPlan,
  getComputationControlPlanPage,
  getComputationControlPlanPageProps as SearchApiProps,
} from '@/sdks/computation/computationV2ApiDocs';

import { columns, SearchSchema } from './utils/columns';
import { DataQualityModel } from './utils/model';

export enum Status {
  'ADD',
  'SHOW',
  'EDIT',
  'COPY',
  'DEL',
}
export enum StatusText {
  'ADD' = '新增',
  'SHOW' = '显示',
  'EDIT' = '编辑',
  'COPY' = '复制',
  'DEL' = '删除',
}

const DataQualityManage = () => {
  const navigage = useNavigate();

  /** 用于缓存record**/
  const [cathRecord, getCathRecord] = useState<ControlPlan>({});

  // 控制计划弹窗显隐
  const [visable, changeVisAble] = useState(false);
  // 控制计划 当前状态  ADD SHOW COPY
  const [status, setStatus] = useState<
    'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL'
  >('ADD');
  const { refresh } = useTable();

  const searchApi: CustomSearchProps<ControlPlan, SearchApiProps> = args => {
    return getComputationControlPlanPage(args).then(({ data }) => {
      return data?.data || {};
    });
  };

  // 编辑
  const editFn = (record: ControlPlan) => {
    changeVisAble(true);
    setStatus('EDIT');
    getCathRecord({
      ...record,
    });
  };
  // 复制
  const copyDataFn = (record: ControlPlan) => {
    changeVisAble(true);
    setStatus('COPY');
    getCathRecord({
      ...record,
      version: '',
      planDate: dayjs().format('YYYY-MM-DD'),
    });
  };

  return (
    <Page
      title='数据质量控制'
      onBtnClick={async () => {
        setStatus('ADD');
        changeVisAble(true);
        getCathRecord({
          planDate: dayjs().format('YYYY-MM-DD'),
        });
      }}
      actionBtnChild={checkAuth(
        '/editDataQualityManage/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<ControlPlan, SearchApiProps>
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({
            navigage,
            editFn,
            copyDataFn,
            refresh,
          }),
          scroll: { x: 1200 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      <DataQualityModel
        status={status}
        visable={visable}
        onCancelFn={() => {
          changeVisAble(false);
        }}
        onOkFn={() => {
          changeVisAble(false);
          refresh?.();
        }}
        initValue={cathRecord}
      />
    </Page>
  );
};

export default withTable(DataQualityManage);
