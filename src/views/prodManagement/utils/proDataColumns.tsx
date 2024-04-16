/*
 * @@description: 运营数据Colums
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { ProRouteMaps } from '@/router/utils/prodEmums';
import {
  OperationMetrics,
  postComputationOperationDataDelete,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

export const prodColumns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<OperationMetrics>['columns'] => [
  {
    title: '年份',
    dataIndex: 'year',
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
    title: '操作 ',
    width: 240,
    dataIndex: 'id',
    render(id, record: OperationMetrics & { orgName?: string; year?: string }) {
      return (
        <TableActions
          menus={compact([
            checkAuth('prodManagementOperationalData/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    ProRouteMaps.prodManagementOperationalData,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),
            checkAuth('prodManagementOperationalData/show', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    ProRouteMaps.prodManagementOperationalData,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),

            checkAuth('prodManagementOperationalData/del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: (
                    <span>
                      确认删除<span>{record?.orgName}</span> : {record?.year}
                      的运营数据？
                    </span>
                  ),
                  onOk: async () => {
                    const { data } = await postComputationOperationDataDelete({
                      req: { id },
                    });
                    if (data.code === 200) {
                      Toast('success', '删除成功');
                      refresh?.();
                    }
                  },
                });
              },
            }),
          ])}
        />
      );
    },
  },
];
