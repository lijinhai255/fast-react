/*
 * @@description: 导入文件历史-表头
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-09 19:01:21
 */

import type { ColumnsType } from 'antd/es/table';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';

import { TableActions } from '@/components/Table/TableActions';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { FootprintBase } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = ({
  pageTypeInfo,
  id,
  navigate,
}: {
  pageTypeInfo?: PageTypeInfo;
  id?: string;
  navigate: NavigateFunction;
}): ColumnsType<FootprintBase> => [
  {
    title: '功能单位',
    dataIndex: 'functionalUnit',
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
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 100,
    render: () => {
      return (
        <TableActions
          menus={compact([
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmFillInfoProductInfo,
                    [PAGE_TYPE_VAR, ':id', ':pageType'],
                    [pageTypeInfo, id, 'productInfo'],
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
