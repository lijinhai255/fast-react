/*
 * @@description: 碳账户设置
 */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { Model } from '@/sdks/computation/computationV2ApiDocs';
import { Org, OrgTree } from '@/sdks/systemV2ApiDocs';
import { getAccountsystemDeptSelectTree } from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { RootState } from '@/store/types';
import { changeTableColumsNoText } from '@/utils';

import { columns, dictSearchSchema } from './columns';
import style from './index.module.less';
import { SettingsModel } from './model';

const Settings = () => {
  // 控制核算模型 新增 编辑 详情
  const [status, setStatus] = useState<'ADD' | 'EDIT'>('ADD');
  // 控制弹窗 显隐
  const [visable, changeVisAble] = useState(false);
  // 弹窗表单赋值
  const [initValue, changeInitValue] = useState<Model>({});
  const { refresh } = useTable();

  const userInfo = useSelector<RootState, RootState['userInfo']>(
    s => s.userInfo,
  );

  const searchApi: SearchProps<Org>['api'] = () => {
    return getAccountsystemDeptSelectTree({
      userId: userInfo.userId,
    }).then(({ data }) => {
      const result = data?.data || {};
      return {
        rows: result || [],
        total: result?.length || 0,
      };
    });
  };

  // 复制、编辑 查看
  const addFn = (record: Model) => {
    changeInitValue({ ...record });
    setStatus('ADD');
    changeVisAble(true);
  };
  const editFn = (record: Model) => {
    changeInitValue({ ...record });
    setStatus('EDIT');
    changeVisAble(true);
  };

  return (
    <Page title='碳账户设置-分组设置' wrapperClass={style.wrapper}>
      <TableRender<OrgTree>
        searchProps={{
          hidden: true,
          schema: dictSearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...columns({ refresh, addFn, editFn })],
            '-',
          ),
          expandable: {
            rowExpandable: record => !!record.children?.length,
          },
          // expandable: {
          //   expandRowByClick: true,
          //   rowExpandable: record => {
          //     console.log(record, ' record');
          //     return !!record.children?.length;
          //   },
          //   // eslint-disable-next-line react/no-unstable-nested-components
          //   expandIcon: ({ expanded, record }) => {
          //     return record.children ? (
          //       expanded ? (
          //         <DownOutlined className={style.orgGroupIcon} />
          //       ) : (
          //         <RightOutlined className={style.orgGroupIcon} />
          //       )
          //     ) : (
          //       ''
          //     );
          //   },
          // },

          rowKey: 'id',
          pagination: false,
        }}
      />
      <SettingsModel
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

export default withTable(Settings);
