import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';

import { AuditResp } from './type';

export const columns = (
  navigate: NavigateFunction,
): TableRenderProps<AuditResp>['columns'] => [
  {
    title: '审批内容',
    dataIndex: 'auditType_name',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'content',
    width: 160,
    render(_, row) {
      const { orgId, auditType } = row || {};
      return (
        <TableActions
          menus={compact([
            checkAuth('/sys/approval/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                if (orgId && auditType)
                  navigate({
                    pathname: RouteMaps.systemApprovalInfo.replace(
                      ':pageTypeInfo',
                      `${PageTypeInfo.edit}`,
                    ),
                    search: `orgId=${orgId}&auditType=${auditType}`,
                  });
              },
            }),
            checkAuth('/sys/approval/info', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                if (orgId && auditType)
                  navigate({
                    pathname: RouteMaps.systemApprovalInfo.replace(
                      ':pageTypeInfo',
                      `${PageTypeInfo.show}`,
                    ),
                    search: `orgId=${orgId}&auditType=${auditType}`,
                  });
              },
            }),
          ])}
        />
      );
    },
  },
];
