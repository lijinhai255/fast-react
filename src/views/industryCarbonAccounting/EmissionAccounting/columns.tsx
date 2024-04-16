import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import {
  postEnterprisesystemSysBusinessDelete,
  postEnterprisesystemSysBusinessVerify,
  SysBusiness,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils';

import { pageTo } from '../utils/index';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<SysBusiness>['columns'] => {
  return [
    {
      title: '组织名称',
      dataIndex: 'orgName',
    },
    {
      title: '核算年度',
      dataIndex: 'accountYear',
    },
    {
      title: '排放量（tCO₂e）',
      dataIndex: 'discharge',
    },
    {
      title: '数据收集周期',
      dataIndex: 'collectCycle_name',
    },
    {
      title: '更新人',
      dataIndex: 'updateName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 160,
      render(_, row) {
        const { id, orgName, accountYear } = row || {};
        return (
          <TableActions
            menus={compact([
              checkAuth('/industryCarbonAccounting/accounting/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  if (id)
                    pageTo(
                      navigate,
                      ICARouteMaps.icaAccountingInfo,
                      PageTypeInfo.edit,
                      id,
                    );
                },
              }),
              checkAuth('/industryCarbonAccounting/accounting/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  /** 校验是否被核算报告引用 */
                  await postEnterprisesystemSysBusinessVerify({
                    req: {
                      id: Number(id),
                    },
                  });
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该组织的碳排放核算：
                        <span className={modalText}>
                          {orgName}, {accountYear}?
                        </span>
                      </>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      if (id) {
                        await postEnterprisesystemSysBusinessDelete({
                          req: { id },
                        });
                        Toast('success', '删除成功');
                        refresh?.();
                      }
                    },
                  });
                },
              }),
              checkAuth('/industryCarbonAccounting/accounting/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  if (id)
                    pageTo(
                      navigate,
                      ICARouteMaps.icaAccountingInfo,
                      PageTypeInfo.show,
                      id,
                    );
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
