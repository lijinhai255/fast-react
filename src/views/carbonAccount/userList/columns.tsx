/*
 * @@description: 表头、筛选项
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { IconFont } from '@/components/IconFont';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import {
  User,
  getAccountsystemUserId,
  getAccountsystemUserUpdateStatusId,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast, listShowMobile, modalText } from '@/utils';

import { UseGroup } from '../hooks';

/** 用户状态。0 启用 1 禁用 */
const userStatus = {
  0: '启用',
  1: '禁用',
};
export const columns = ({
  refresh,
  editFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  editFn?: (record: User) => void;
}): TableRenderProps<any>['columns'] => [
  {
    title: '姓名',
    dataIndex: 'realName',
    fixed: 'left',
  },
  {
    title: '手机号',
    dataIndex: 'mobileMask',
    width: 125,
    render: (t, row) => {
      return (
        <div>
          <span>{t}</span>
          <span
            className={listShowMobile}
            onClick={() => {
              return getAccountsystemUserId({
                id: row.id,
              }).then(({ data }) => {
                if (data.code === 200) {
                  return Modal.success({
                    title: '提示',
                    content: (
                      <span>
                        手机号：
                        <span className={modalText}>{data?.data?.mobile}</span>
                      </span>
                    ),
                    onOk: () => {},
                  });
                }
                return data?.msg;
              });
            }}
          >
            {checkAuth(
              '/carbonAccount/userList/show',
              t && <IconFont className='' icon='icon-icon-xianshi' />,
            )}
          </span>
        </div>
      );
    },
  },
  {
    title: '可用积分',
    dataIndex: 'currScore',
  },
  {
    title: '累计积分',
    dataIndex: 'totalScore',
  },
  {
    title: '可用减排量（g）',
    dataIndex: 'currReduction',
  },
  {
    title: '累积减排量（g）',
    dataIndex: 'totalReduction',
  },
  {
    title: '所属分组',
    dataIndex: 'deptName',
  },
  {
    title: '状态',
    dataIndex: 'userStatus_name',
  },
  {
    title: '用户ID',
    dataIndex: 'userNumber',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonAccount/userList/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                editFn?.(row);
              },
            }),
            checkAuth('/carbonAccount/userList/status', {
              label: Number(row.userStatus) !== 0 ? '启用' : '禁用',
              key: '启用',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  content: (
                    <span>
                      确定要{Number(row.userStatus) !== 0 ? '启用' : '禁用'}
                      该用户：
                      <span className={modalText}>{row.realName}</span>
                    </span>
                  ),
                  onOk: () => {
                    return getAccountsystemUserUpdateStatusId({
                      id: row.id,
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
            }),
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const depOption = UseGroup();
  return {
    type: 'object',
    properties: {
      userInfo: xRenderSeachSchema({
        type: 'string',
        placeholder: '用户信息',
      }),
      deptId: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '所属分组',
        widget: 'select',
        enum: depOption?.map(item => `${item?.value}` as string),
        enumNames: depOption?.map(item => item?.label as string),
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      userStatus: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '状态',
        enum: ['0', '1'],
        enumNames: [userStatus[0], userStatus[1]],
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
      userNumber: xRenderSeachSchema({
        type: 'string',
        placeholder: '用户ID',
      }),
    },
  };
};
