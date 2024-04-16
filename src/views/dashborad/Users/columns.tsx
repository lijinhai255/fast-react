import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Org,
  postSystemUserDelete,
  postSystemUserStatus,
  Role,
  UserResp,
} from '@/sdks/systemV2ApiDocs';
import {
  modalText,
  returnDelModalStyle,
  returnNoIconModalStyle,
  Toast,
} from '@/utils';

/** 用户状态。0 启用 1 禁用 */
const userStatus = {
  0: '启用',
  1: '禁用',
};

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<UserResp>['columns'] => [
  {
    title: '用户名',
    dataIndex: 'username',
    render(val, row) {
      return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <span title={`${val}${row.adminFlag ? '（负责人）' : ''}`}>
          {val}
          {row.adminFlag && `（负责人）`}
        </span>
      );
    },
  },
  {
    title: '姓名',
    dataIndex: 'realName',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '所属组织',
    dataIndex: 'orgNames',
    ellipsis: true,
  },
  {
    title: '角色',
    dataIndex: 'roleNames',
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    width: 120,
    render(val) {
      return (
        <Tags
          kind='raduis'
          color={val === 0 ? 'green' : 'red'}
          tagText={userStatus[val as keyof typeof userStatus]}
        />
      );
    },
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
    width: 240,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/sys/user/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.usersInfo,
                    [PAGE_TYPE_VAR, ':id', ':adminFlag'],
                    [PageTypeInfo.edit, row.id, Number(row.adminFlag)],
                  ),
                );
              },
            }),
            checkAuth(
              '/sys/user/status',
              !row.adminFlag && {
                label: Number(row.userStatus) !== 0 ? '启用' : '禁用',
                key: '启用',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    content: (
                      <span>
                        确定要{Number(row.userStatus) !== 0 ? '启用' : '禁用'}
                        该用户：
                        <span className={modalText}>{row.username}</span>
                      </span>
                    ),
                    ...returnNoIconModalStyle,
                    onOk: () => {
                      return postSystemUserStatus({
                        req: {
                          id,
                          userStatus: Number(row.userStatus) === 0 ? '1' : '0',
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast(
                            'success',
                            `${
                              Number(row.userStatus) !== 0 ? '启用' : '禁用'
                            }成功`,
                          );
                          refresh?.();
                        }
                      });
                    },
                  });
                },
              },
            ),
            checkAuth(
              '/sys/user/del',
              !row.adminFlag && {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    content: (
                      <span>
                        确定要删除用户：
                        <span className={modalText}>{row.username}</span>
                      </span>
                    ),
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    onOk: async () => {
                      if (row.id)
                        postSystemUserDelete({
                          req: { id: row.id },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            refresh?.();
                            Toast('success', '删除成功');
                          }
                        });
                    },
                  });
                },
              },
            ),
            checkAuth('/sys/user/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.usersInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, row.id],
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

const width = 200;
export const searchSchema = ({
  orgs,
  roles,
}: {
  orgs: Org[];
  roles: Role[];
}): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeUserInfo: xRenderSeachSchema({
        type: 'string',
        placeholder: '用户名/姓名/手机号',
      }),
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: '所属组织',
        enum: orgs.map(org => String(org.id)),
        enumNames: orgs.map(org => org.orgName as string),
        widget: 'select',
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      roleId: xRenderSeachSchema({
        type: 'string',
        width,
        placeholder: '角色',
        enum: roles.map(role => String(role.id)),
        enumNames: roles.map(role => role.roleName as string),
        widget: 'select',
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      userStatus: xRenderSeachSchema({
        type: 'string',
        width,
        placeholder: '状态',
        enum: ['0', '1'],
        enumNames: [userStatus[0], userStatus[1]],
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
