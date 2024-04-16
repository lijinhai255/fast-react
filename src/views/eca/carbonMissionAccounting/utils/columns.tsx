/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 10:26:18
 */

import { Button, Modal } from 'antd';
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
  Computation,
  postComputationComputationDelete,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { postComputationComputationVerify } from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';
import { publishYear } from '@/views/Factors/utils';

import { UseOrgs } from '../../hooks';

export const columns = ({
  refresh,
  navigate,
  showEmissionListFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  showEmissionListFn: (record: Computation) => void;
}): TableRenderProps<Computation>['columns'] => [
  {
    title: '核算组织',
    dataIndex: 'orgName',
    fixed: 'left',
  },
  {
    title: '核算年度',
    dataIndex: 'year',
  },
  {
    title: '排放总量（tCO₂e）',
    dataIndex: 'carbonEmission',
    render: (text, record) => {
      return text ? (
        <Button
          type='link'
          onClick={() => {
            showEmissionListFn(record);
          }}
        >
          {text}
        </Button>
      ) : (
        '-'
      );
    },
  },
  {
    title: '数据收集周期',
    dataIndex: 'dataPeriod_name',
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
    dataIndex: 'id',
    fixed: 'right',
    width: 240,
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonMissionAccounting/InfoSource', {
              label: '排放源管理',
              key: '排放源管理',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.carbonMissionAccountingSourceInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.add, id],
                  ),
                );
              },
            }),
            checkAuth('/carbonMissionAccountingInfo/Edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.carbonMissionAccountingInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),

            checkAuth('/carbonMissionAccountingInfo/Del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                /** 校验是否被核算报告引用 */
                await postComputationComputationVerify({
                  req: {
                    id: Number(id),
                  },
                });
                Modal.confirm({
                  title: '提示',
                  ...returnNoIconModalStyle,
                  ...returnDelModalStyle,
                  content: (
                    <span>
                      确认删除该组织的碳排放核算：
                      <span className='modal_text'>
                        {record.orgName}，{record.year}？
                      </span>
                    </span>
                  ),
                  onOk: () => {
                    return postComputationComputationDelete({
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
            checkAuth('/carbonMissionAccountingInfo/Show', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.carbonMissionAccountingInfo,
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
      orgId: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '所属组织',
        widget: 'select',
        enum: orgs?.map(org => `${org?.id}` as string),
        enumNames: orgs?.map(org => org?.orgName as string),
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
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
