/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-28 16:12:09
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Role, postSystemRoleDelete } from '@/sdks/systemV2ApiDocs';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<Role>['columns'] => [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    // copyable: true,
  },
  {
    title: '角色类型',
    dataIndex: 'roleType_name',
  },
  {
    title: '角色描述',
    dataIndex: 'roleInfo',
  },

  {
    title: '更新人',
    dataIndex: 'updateByName',
    render: (value, record) => {
      return Number(record?.roleType) !== 0 ? value || '-' : '-';
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
    render: (value, record) => {
      return Number(record?.roleType) !== 0 ? value || '-' : '-';
    },
  },
  {
    title: '操作',
    width: 240,
    dataIndex: 'id',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            Number(record?.roleType) !== 0 &&
              checkAuth('/sys/role/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      RouteMaps.roleInfo,
                      [PAGE_TYPE_VAR, ':roleId'],
                      [PageTypeInfo.edit, id],
                    ),
                  );
                },
              }),

            Number(record?.roleType) !== 0 &&
              checkAuth('/sys/role/del', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  if (record.linkUser) {
                    Toast('error', '请先取消用户的该角色后再进行删除角色操作');
                  } else {
                    Modal.confirm({
                      title: '提示',
                      content: '确定要删除该角色？',
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      onOk: () => {
                        return postSystemRoleDelete({
                          req: { id },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', '删除成功');
                            refresh?.();
                          }
                        });
                      },
                    });
                  }
                },
              }),
            checkAuth('/sys/role/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.roleInfo,
                    [PAGE_TYPE_VAR, ':roleId'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
export const searchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    likeRoleName: xRenderSeachSchema({
      type: 'string',
      placeholder: '角色名称',
    }),
  },
});
