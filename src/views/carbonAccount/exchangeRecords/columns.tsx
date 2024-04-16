/*
 * @@description: 表头、筛选项
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
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
  getAccountsystemOrdersSendGoodsId,
  getAccountsystemUserId,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast, listShowMobile, modalText } from '@/utils';

/** 领取状态。1 未领取 0 已领取 */
const claimStatus = {
  0: '已领取',
  1: '未领取 ',
};
export const columns = ({
  refresh,
}: {
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<any>['columns'] => [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    fixed: 'left',
  },
  {
    title: '姓名',
    dataIndex: 'realName',
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
              '/carbonAccount/exchangeRecords/show',
              t && <IconFont className='' icon='icon-icon-xianshi' />,
            )}
          </span>
        </div>
      );
    },
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
  },
  {
    title: '兑换数量',
    dataIndex: 'goodsCount',
  },
  {
    title: '消耗积分',
    dataIndex: 'payScore',
  },
  {
    title: '兑换时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '领取状态',
    dataIndex: 'orderStatus_name',
  },
  {
    title: '领取时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '用户ID',
    dataIndex: 'userNumber',
  },
  {
    title: '操作',
    width: 70,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            row.orderStatus === 1
              ? checkAuth('/carbonAccount/exchangeRecords/grant', {
                  label: '发放',
                  key: '发放',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      content: (
                        <span>
                          <span>
                            确认发放该兑换记录的商品：{row.realName}，
                            {row.goodsName}x{row.goodsCount}？
                          </span>
                        </span>
                      ),
                      onOk: () => {
                        return getAccountsystemOrdersSendGoodsId({ id }).then(
                          ({ data }) => {
                            if (data.code === 200) {
                              Toast('success', `已发货`);
                              refresh?.();
                            }
                          },
                        );
                      },
                    });
                  },
                })
              : {
                  label: '-',
                  key: '-',
                },
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      orderNo: xRenderSeachSchema({
        type: 'string',
        placeholder: '订单号',
      }),
      userInfo: xRenderSeachSchema({
        type: 'string',
        placeholder: '用户信息',
      }),
      goodsName: xRenderSeachSchema({
        type: 'string',
        placeholder: '商品名称',
      }),
      beginDate: xRenderSeachSchema({
        width: 360 + 80,
        title: '兑换日期',
        labelWidth: 80,
        type: 'array',
        format: 'string',
        props: {
          format: 'YYYY-MM-DD',
          showTime: true,
        },
        widget: 'dateRange',
      }),
      orderStatus: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '领取状态',
        enum: ['0', '1'],
        enumNames: [claimStatus[0], claimStatus[1]],
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
