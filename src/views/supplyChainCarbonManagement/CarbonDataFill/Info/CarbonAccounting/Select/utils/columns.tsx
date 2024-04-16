/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 10:52:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-09 18:24:34
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
import { ComputationDto } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = ({
  pageTypeInfo,
  id,
  navigate,
}: {
  pageTypeInfo?: PageTypeInfo;
  id?: string;
  navigate: NavigateFunction;
}): ColumnsType<ComputationDto> => [
  {
    title: '核算组织',
    dataIndex: 'orgName',
  },
  {
    title: '核算年度',
    dataIndex: 'year',
  },
  {
    title: '排放总量（tCO₂e）',
    dataIndex: 'carbonEmission',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    render: (_, row) => {
      const { orgName, year, carbonEmission } = row;
      return (
        <TableActions
          menus={compact([
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmFillInfoEnterpriseSelectInfo,
                    [PAGE_TYPE_VAR, ':id', ':pageType', ':basicInfo'],
                    [
                      pageTypeInfo,
                      id,
                      'enterpriseSelect',
                      JSON.stringify({
                        orgName,
                        year,
                        total: carbonEmission,
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
