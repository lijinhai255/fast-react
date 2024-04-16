/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 10:52:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-13 14:25:54
 */
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { ProductionBusinessDto } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = ({
  pageTypeInfo,
  id,
  pageType,
  navigate,
}: {
  pageTypeInfo?: PageTypeInfo;
  id?: string;
  pageType?: string;

  navigate: NavigateFunction;
}): TableRenderProps<ProductionBusinessDto>['columns'] => [
  {
    title: '功能单位',
    dataIndex: 'functionalUnit',
    fixed: 'left',
  },
  {
    title: '产品名称',
    dataIndex: 'productionName',
  },
  {
    title: '核算数量',
    dataIndex: 'checkCount',
  },
  {
    title: '排放总量（kgCO₂e）',
    dataIndex: 'discharge',
  },
  {
    title: '单位产品排放量',
    dataIndex: 'dischargeRate',
  },
  {
    title: '核算周期',
    dataIndex: 'beginDate',
    width: 200,
    render: (value, record) => {
      return value && record?.endTime ? `${value}至${record?.endTime}` : '-';
    },
  },
  {
    title: '产品编码',
    dataIndex: 'productionCode',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    fixed: 'right',
    render: (_, row) => {
      return (
        <TableActions
          menus={compact([
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmFillInfoProductSelectInfo,
                    [
                      PAGE_TYPE_VAR,
                      ':id',
                      ':pageType',
                      ':productionBusinessId',
                    ],
                    [pageTypeInfo, id, pageType, row?.productionBusinessId],
                  ),
                );
              },
            },
          ])}
        />
      );
    },
  },
];
