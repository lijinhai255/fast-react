/*
 * @@description: 表头、筛选项
 */

import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { CaRouteMaps } from '@/router/utils/caEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Model } from '@/sdks/computation/computationV2ApiDocs';

import style from '../index.module.less';

export const columns = ({
  navigate,
  inFn,
  outFn,
}: {
  navigate: NavigateFunction;
  inFn?: (record: Model) => void;
  outFn?: (record: Model) => void;
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
    title: '剩余库存',
    dataIndex: 'amount',
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
            checkAuth('/carbonAccount/merchandiseInventory/ground', {
              label: '库存记录',
              key: '库存记录',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    CaRouteMaps.inventoryRecords,
                    [PAGE_TYPE_VAR, ':id', ':title', ':num'],
                    [PageTypeInfo.edit, row.goodsId, row.goodsName, row.amount],
                  ),
                );
              },
            }),
            checkAuth('/carbonAccount/merchandiseInventory/in', {
              label: '入库',
              key: '入库',
              onClick: async () => {
                inFn?.(row);
              },
            }),

            checkAuth('/carbonAccount/merchandiseInventory/out', {
              label: '出库',
              key: '出库',
              onClick: async () => {
                outFn?.(row);
              },
            }),
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
      goodsName: xRenderSeachSchema({
        type: 'string',
        placeholder: '商品名称',
      }),
    },
  };
};
