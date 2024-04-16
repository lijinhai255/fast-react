/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 15:29:05
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
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Report,
  postComputationReportDelete,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';
import { publishYear } from '@/views/Factors/utils';

import { UseOrgs } from '../../hooks';

export const columns = ({
  refresh,
  navigate,
  reportFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  reportFn: (record: Report) => void;
}): TableRenderProps<Report>['columns'] => [
  {
    title: '报告名称',
    dataIndex: 'reportName',
    // copyable: true,
  },
  {
    title: '所属组织',
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
    title: '基准排放量（tCO₂e）',
    dataIndex: 'standardEmission',
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
    width: 240,
    dataIndex: 'id',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/accountingReportInfo/Create', {
              label: '生成报告',
              key: '生成报告',
              onClick: async () => {
                reportFn?.(record);
              },
            }),
            checkAuth('/accountingReportInfo/Edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingReportInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),

            checkAuth('/accountingReportInfo/Del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: (
                    <span>
                      确认删除该核算报告：
                      <span className='modal_text'>{record?.reportName}？</span>
                    </span>
                  ),
                  onOk: () => {
                    return postComputationReportDelete({
                      req: { id },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', '删除成功');
                        refresh?.();
                      }
                    });
                  },
                });
              },
            }),
            checkAuth('/accountingReportInfo/Show', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingReportInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const orgs = UseOrgs();

  return {
    type: 'object',
    properties: {
      likeReportName: xRenderSeachSchema({
        type: 'string',
        placeholder: '报告名称',
      }),
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: '所属组织',
        enum: compact(orgs.map(o => `${o.id}`)),
        enumNames: compact(orgs.map(o => o.orgName)),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
      year: xRenderSeachSchema({
        type: 'string',
        placeholder: '核算年度',
        enum: publishYear().map(item => `${item}`),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
