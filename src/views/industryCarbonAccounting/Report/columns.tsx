import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import {
  postEnterprisesystemSysReportDelete,
  SysReport,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import {
  Toast,
  modalText,
  returnDelModalStyle,
  returnNoIconModalStyle,
} from '@/utils';

import { pageTo } from '../utils/index';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<SysReport>['columns'] => {
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
      title: '排放总量（tCO₂e）',
      dataIndex: 'discharge',
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
      width: 230,
      render(_, row) {
        const { id, orgName, accountYear } = row || {};
        return (
          <TableActions
            menus={compact([
              // 本期不做
              // checkAuth('/industryCarbonAccounting/accounting/add', {
              //   label: '生成报告',
              //   key: '生成报告',
              //   onClick: () => {},
              // }),
              checkAuth('/industryCarbonAccounting/report/edit', {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  if (id) {
                    pageTo(
                      navigate,
                      ICARouteMaps.icaReportInfo,
                      PageTypeInfo.edit,
                      id,
                    );
                  }
                },
              }),
              checkAuth('/industryCarbonAccounting/report/delete', {
                label: '删除',
                key: '删除',
                onClick: () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该排放报告：
                        <span className={modalText}>
                          {orgName}，{accountYear}？
                        </span>
                      </>
                    ),
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    onOk: async () => {
                      if (id) {
                        await postEnterprisesystemSysReportDelete({
                          req: { id },
                        });
                        refresh?.();
                        Toast('success', '删除成功');
                      }
                    },
                  });
                },
              }),
              checkAuth('/industryCarbonAccounting/report/detail', {
                label: '查看',
                key: '查看',
                onClick: () => {
                  if (row.id) {
                    pageTo(
                      navigate,
                      ICARouteMaps.icaReportInfo,
                      PageTypeInfo.show,
                      id,
                    );
                  }
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
