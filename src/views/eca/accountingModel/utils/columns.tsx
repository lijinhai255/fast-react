/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-15 16:59:29
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
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import {
  Model,
  postComputationModelDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast } from '@/utils';

import { UseOrgs } from '../../hooks';

export const columns = ({
  refresh,
  navigate,
  editFn,
  copyFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  editFn?: (record: Model) => void;
  copyFn?: (record: Model) => void;
  showFn?: (record: Model) => void;
}): TableRenderProps<Model>['columns'] => [
  {
    title: '模型名称',
    dataIndex: 'modelName',
    // copyable: true,
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '模型介绍',
    dataIndex: 'intro',
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
    width: 260,
    dataIndex: 'id',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/accountingModel/SourceInfo', {
              label: '排放源管理',
              key: '排放源管理',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingModelEmissionSource,
                    [':pageTypeInfo', ':id'],
                    [PageTypeInfo.add, id],
                  ),
                );
              },
            }),

            checkAuth('/accountingModel/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                editFn?.(record);
              },
            }),
            checkAuth('/accountingModel/Copy', {
              label: '复制',
              key: '复制',
              onClick: async () => {
                copyFn?.(record);
              },
            }),
            checkAuth('/accountingModel/Del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  centered: true,
                  title: '提示',
                  okType: 'default',
                  okButtonProps: {
                    style: { background: '#ED5555', color: '#fff' },
                  },
                  closable: true,
                  okText: '确认',
                  cancelText: '取消',
                  content: (
                    <span>
                      确认删除该核算模型：
                      <span className='modal_text'>{record?.modelName}</span>
                    </span>
                  ),
                  onOk: () => {
                    return postComputationModelDelete({
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
            checkAuth('/accountingModel/show', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingModelEmissionSource,
                    [':pageTypeInfo', ':id'],
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
      likeModelName: xRenderSeachSchema({
        type: 'string',
        placeholder: '模型名称',
      }),
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
    },
  };
};
