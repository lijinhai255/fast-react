/*
 * @@description: 表头、筛选项
 */

import { Modal } from 'antd';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { IconFont } from '@/components/IconFont';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { getAccountsystemUserId } from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { listShowMobile, modalText } from '@/utils';

/** 积分类型:0 活动累计、1 兑换消耗 2 审核扣除 */
const type = {
  0: '活动累计',
  1: '兑换消耗',
  2: '审核扣除',
};
export const columns = (): TableRenderProps<any>['columns'] => [
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
              '/carbonAccount/CADetail/show',
              t && <IconFont className='' icon='icon-icon-xianshi' />,
            )}
          </span>
        </div>
      );
    },
  },
  {
    title: '变更类型',
    dataIndex: 'scoreType_name',
  },
  {
    title: '积分变动',
    dataIndex: 'changeScore',
  },
  {
    title: '减排量变动（g）',
    dataIndex: 'changeCers',
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
    dataIndex: 'currCers',
  },
  {
    title: '累积减排量（g）',
    dataIndex: 'totalCers',
  },
  {
    title: '变更时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '用户ID',
    dataIndex: 'userNumber',
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      userInfo: xRenderSeachSchema({
        type: 'string',
        placeholder: '用户信息',
      }),
      scoreType: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '变更类型',
        widget: 'select',
        enum: ['0', '1', '2'],
        enumNames: [type[0], type[1], type[2]],
        props: {
          allowClear: true,
        },
      }),
      beginDate: xRenderSeachSchema({
        width: 360 + 80,
        title: '变更日期',
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
