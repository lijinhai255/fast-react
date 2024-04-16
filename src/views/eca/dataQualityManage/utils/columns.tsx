import { message, Modal, Space } from 'antd';
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
  ControlPlan,
  postComputationControlPlanDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { UseOrgs } from '../../hooks';

export const columns = ({
  navigage,
  copyDataFn,
  refresh,
}: {
  navigage?: NavigateFunction;
  editFn?: (record: ControlPlan) => void;
  copyDataFn: (record: ControlPlan) => void;
  delFn?: (record: ControlPlan) => void;
  refresh?: TableContext<ControlPlan>['refresh'];
}): TableRenderProps<any>['columns'] => [
  {
    title: '所属组织',
    dataIndex: 'orgName',
    width: 180,
    fixed: 'left',
  },
  {
    title: '版本号',
    dataIndex: 'version',
    width: 180,
  },
  {
    title: '制定（修订）内容',
    dataIndex: 'planContent',
    width: 160,
  },
  {
    title: '制定（修订）时间',
    dataIndex: 'planDate',
    width: 160,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 96,
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
    width: 120,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 190,
    fixed: 'right',
    render: (_, record) => {
      return (
        <Space>
          <TableActions
            menus={compact([
              checkAuth('/editDataQualityManage/Edit', {
                label: '编辑',
                key: '/editDataQualityManage/Edit',
                onClick: () => {
                  navigage?.(
                    virtualLinkTransform(
                      EcaRouteMaps.editDataQualityManage,
                      [':pageTypeInfo', ':id'],
                      [PageTypeInfo.edit, record.id],
                    ),
                  );
                },
              }),
              checkAuth('/editDataQualityManage/Copy', {
                label: '复制',
                key: '/editDataQualityManage/Copy',
                onClick: () => {
                  copyDataFn?.(record);
                },
              }),
              checkAuth('/editDataQualityManage/Del', {
                label: '删除',
                key: '/carbonAccounting/emissionReductionScenario/del',
                onClick: (ev: Event) => {
                  ev?.stopPropagation();
                  Modal.confirm({
                    title: '提示',
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    okText: '确认',
                    cancelText: '取消',
                    content: (
                      <span>
                        确认删除该数据质量控制计划：
                        <span className='modal_text'>{`${record.version}？`}</span>
                      </span>
                    ),
                    onOk: async () => {
                      await postComputationControlPlanDelete({
                        req: { id: record.id },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          message.success('删除成功');
                          refresh?.({ stay: true, tab: 1 });
                        }
                      });
                    },
                  });

                  return null;
                },
              }),
              checkAuth('/editDataQualityManage/Detail', {
                label: '查看',
                key: '/editDataQualityManage/Detail',
                onClick: () => {
                  navigage?.(
                    virtualLinkTransform(
                      EcaRouteMaps.editDataQualityManage,
                      [':pageTypeInfo', ':id'],
                      [PageTypeInfo.show, record.id],
                    ),
                  );
                },
              }),
            ])}
          />
        </Space>
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
      likeVersion: xRenderSeachSchema({
        type: 'string',
        placeholder: '版本号',
      }),
    },
  };
};
