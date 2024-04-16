/*
 * @@description: 导入文件历史-表头
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-09 18:24:04
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
import { ComputationResult } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = ({
  pageTypeInfo,
  id,
  navigate,
}: {
  pageTypeInfo?: PageTypeInfo;
  id?: string;
  navigate: NavigateFunction;
}): ColumnsType<ComputationResult> => [
  {
    title: '核算组织',
    dataIndex: 'orgName',
  },
  {
    title: '核算年份',
    dataIndex: 'year',
  },
  {
    title: '排放总量（tCO₂e）',
    dataIndex: 'total',
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
    render: (_, row) => {
      return (
        <TableActions
          menus={compact([
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                const { orgName, year, total } = row;
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmFillInfoEnterpriseInfo,
                    [PAGE_TYPE_VAR, ':id', ':pageType', ':basicInfo'],
                    [
                      pageTypeInfo,
                      id,
                      'enterprise',
                      JSON.stringify({
                        orgName,
                        year,
                        total,
                      }),
                    ],
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
