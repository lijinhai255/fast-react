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

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { Model } from '@/sdks/computation/computationV2ApiDocs';
import { getAccountsystemGoodsUpdateStatusId } from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { modalText, Toast } from '@/utils';

import style from './index.module.less';
import { UseGroup } from '../hooks';

/** 用户状态。0 未上架 1 已上架 */
const goodsStatus = {
  0: '未上架',
  1: '已上架',
};
export const columns = ({
  refresh,
  editFn,
  showFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  editFn?: (record: Model) => void;
  showFn?: (record: Model) => void;
}): TableRenderProps<any>['columns'] => [
  {
    title: '商品图',
    dataIndex: 'imgPath',
    fixed: 'left',
    render(val) {
      return <img src={val} alt={val} className={style.listImg} />;
    },
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
  },
  {
    title: '兑换积分',
    dataIndex: 'score',
  },
  {
    title: '剩余库存',
    dataIndex: 'amount',
  },
  {
    title: '投放渠道',
    dataIndex: 'limitNo_name',
  },
  {
    title: '限兑数量',
    dataIndex: 'countLimit',
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
  },
  {
    title: '状态',
    dataIndex: 'goodsStatus_name',
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
    width: 180,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            Number(row.goodsStatus) !== 1 &&
              checkAuth('/carbonAccount/pointProducts/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  editFn?.(row);
                },
              }),
            checkAuth('/carbonAccount/pointProducts/ground', {
              label: Number(row.goodsStatus) !== 0 ? '下架' : '上架',
              key: '下架',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  content: (
                    <span>
                      确定要{Number(row.goodsStatus) !== 0 ? '下架' : '上架'}
                      该商品：
                      <span className={modalText}>{row.goodsName}</span>？
                    </span>
                  ),
                  onOk: () => {
                    return getAccountsystemGoodsUpdateStatusId({ id }).then(
                      ({ data }) => {
                        if (data.code === 200) {
                          Toast(
                            'success',
                            `${
                              Number(row.goodsStatus) !== 0 ? '下架' : '上架'
                            }成功`,
                          );
                          refresh?.();
                        }
                      },
                    );
                  },
                });
              },
            }),
            checkAuth('/carbonAccount/pointProducts/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                showFn?.(row);
              },
            }),
          ])}
        />
      );
    },
  },
];

// 处理积分商品-下拉列表-增加全渠道数据
export const DepOptions = () => {
  const deptOption = UseGroup();
  return deptOption.concat({ label: '全渠道', value: '全渠道' });
};

export const SearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      goodsName: xRenderSeachSchema({
        type: 'string',
        placeholder: '商品名称',
      }),
      deptId: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '投放渠道',
        widget: 'select',
        enum: DepOptions()?.map(item => `${item?.value}` as string),
        enumNames: DepOptions()?.map(item => item?.label as string),
        props: {
          allowClear: true,
          showSearch: true,
          showArrow: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      goodsStatus: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '状态',
        enum: ['0', '1'],
        enumNames: [goodsStatus[0], goodsStatus[1]],
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
