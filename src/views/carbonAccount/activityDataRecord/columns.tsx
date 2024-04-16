/*
 * @@description: 表头、筛选项
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { IconFont } from '@/components/IconFont';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { getAccountsystemUserId } from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { listShowMobile, modalText } from '@/utils';

import { UseScene } from '../hooks';

/** 状态:0已领取 1撤销 2待领取 */
const status = {
  0: '已领取',
  1: '已撤销',
  2: '待领取',
};
export const columns = ({
  showFn,
  revokeFn,
}: {
  showFn?: (record: any) => void;
  revokeFn?: (record: any) => void;
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
                id: row.userId,
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
              '/carbonAccount/activityDataRecord/show',
              t && <IconFont className='' icon='icon-icon-xianshi' />,
            )}
          </span>
        </div>
      );
    },
  },
  {
    title: '低碳场景',
    dataIndex: 'sceneName',
  },
  {
    title: '活动数据',
    dataIndex: 'changeValue',
  },
  {
    title: '活动数据单位',
    dataIndex: 'sceneUnitName',
  },
  {
    title: '完成时间',
    dataIndex: 'behaviorTime',
    width: 200,
  },
  {
    title: '积分状态',
    dataIndex: 'behaviorStatus_name',
  },
  {
    title: '用户ID',
    dataIndex: 'userNumber',
  },
  {
    title: '操作',
    width: 120,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonAccount/activityDataRecord/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                showFn?.(row);
              },
            }),
            row.behaviorStatus !== 1 &&
              checkAuth('/carbonAccount/activityDataRecord/revoke', {
                label: '撤销',
                key: '撤销',
                onClick: async () => {
                  revokeFn?.(row);
                },
              }),
          ])}
        />
      );
    },
  },
];

export const SearchSchema = (): SearchProps<any>['schema'] => {
  const sence = UseScene();
  return {
    type: 'object',
    properties: {
      userInfo: xRenderSeachSchema({
        type: 'string',
        placeholder: '用户信息',
      }),
      sceneId: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '低碳场景',
        widget: 'select',
        enum: sence?.map(item => `${item?.value}` as string),
        enumNames: sence?.map(item => item?.label as string),
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      behaviorStatus: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '积分状态',
        widget: 'select',
        enum: ['0', '1', '2'],
        enumNames: [status[0], status[1], status[2]],
        props: {
          allowClear: true,
        },
      }),
      beginDate: xRenderSeachSchema({
        width: 360 + 80,
        title: '完成日期',
        labelWidth: 80,
        type: 'array',
        format: 'string',
        props: {
          format: 'YYYY-MM-DD',
          showTime: true,
        },
        widget: 'dateRange',
      }),
      userNumber: xRenderSeachSchema({
        type: 'string',
        placeholder: '用户ID',
      }),
    },
  };
};
