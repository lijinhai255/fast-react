/*
 * @@description: 活动数据记录
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { CaRouteMaps } from '@/router/utils/caEmums';
import { virtualLinkTransform } from '@/router/utils/enums';
import {
  getAccountsystemUserBehavior,
  getAccountsystemUserBehaviorProps as SearchApiProps,
  UserBehavior,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';

import { columns, SearchSchema } from './columns';
import { RevokeModel } from './model';

const ActivityDataRecord = () => {
  // 控制核算模型 新增 编辑 详情
  const [status, setStatus] = useState<'ADD' | 'EDIT'>('ADD');
  // 控制弹窗 显隐
  const [visable, changeVisAble] = useState(false);
  // 弹窗表单赋值
  const [initValue, changeInitValue] = useState({});
  // 弹窗表单赋值

  const { refresh } = useTable();
  const navigate = useNavigate();

  const searchApi: CustomSearchProps<UserBehavior, SearchApiProps> = args => {
    const result = {
      ...args,
      beginDate: args?.beginDate?.[0],
      endDate: args?.beginDate?.[1],
    };
    return getAccountsystemUserBehavior(result).then(({ data }) => {
      return data?.data;
    });
  };

  // 复制、编辑 查看
  const showFn = (record: any) => {
    navigate(
      virtualLinkTransform(
        CaRouteMaps.activityDataRecordShow,
        [':id'],
        [record.id],
      ),
    );
  };
  const revokeFn = (record: any) => {
    changeInitValue({ ...record });
    setStatus('ADD');
    changeVisAble(true);
  };

  return (
    <Page title='活动数据记录'>
      <TableRender<UserBehavior, SearchApiProps>
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({ showFn, revokeFn }),
          scroll: { x: 1500 },
        }}
        autoAddIndexColumn
        autoSaveSearchInfo
        autoFixNoText
      />
      <RevokeModel
        status={status}
        visable={visable}
        onCancelFn={() => {
          changeVisAble(false);
        }}
        onOkFn={() => {
          changeVisAble(false);
          refresh?.();
        }}
        initValue={initValue}
      />
    </Page>
  );
};

export default withTable(ActivityDataRecord);
