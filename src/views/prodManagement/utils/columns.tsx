/*
 * @@description:运营指标colums
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { CustomTag } from '@/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { OrgPojo } from '@/sdks/systemV2ApiDocs';
import {
  OperationMetrics,
  postComputationOperationMetricsDelete,
  postComputationOperationMetricsStatus,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';
import { publishYear } from '@/views/Factors/utils';

import { TypeChangeProManage } from '../type';

export const columns = ({
  refresh,
  editRecordFn,
}: {
  refresh: TableContext<any>['refresh'];
  editRecordFn: (record: OperationMetrics) => void;
}): TableRenderProps<OperationMetrics>['columns'] => [
  {
    title: '运营指标',
    dataIndex: 'metricsName',
  },
  {
    title: '单位',
    dataIndex: 'metricsUnitName',
  },
  {
    title: '状态',
    dataIndex: 'metricsStatus',
    render: metricsStatus => {
      // return Number(metricsStatus) ? '禁用' : '启用';
      return (
        <CustomTag
          color={Number(metricsStatus) ? 'red' : 'green'}
          text={Number(metricsStatus) ? '禁用' : '启用'}
        />
      );
    },
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
    title: '操作 ',
    width: 200,
    dataIndex: 'id',
    render(id, record) {
      const metricsStatusObj: { [key: string]: string } = {
        0: '禁用',
        1: '启用',
      };
      return (
        <TableActions
          menus={compact([
            record?.presetType &&
              checkAuth('prodManagementDataOperationalIndicators/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  editRecordFn(record);
                },
              }),
            checkAuth('prodManagementDataOperationalIndicators/enable', {
              label: metricsStatusObj[Number(record.metricsStatus)],
              key: metricsStatusObj[Number(record.metricsStatus)],
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  ...returnNoIconModalStyle,
                  content: (
                    <span>
                      确认{Number(record.metricsStatus) === 0 ? '禁用' : '启用'}
                      ：
                      <span className='modal_text'>{record?.metricsName}</span>
                      <span>？</span>
                    </span>
                  ),
                  onOk: async () => {
                    const { data } =
                      await postComputationOperationMetricsStatus({
                        req: {
                          id,
                          status: Number(record.metricsStatus) === 0 ? 1 : 0,
                        },
                      });
                    if (data.code === 200) {
                      refresh?.(
                        {
                          stay: false,
                          tab: 0,
                        },
                        {
                          currentTab: TypeChangeProManage[1],
                        },
                      );
                    }
                  },
                });
              },
            }),
            record?.presetType &&
              checkAuth('prodManagementDataOperationalIndicators/del', {
                label: '删除',
                key: '删除',
                disabled: !record.deleteBtnFlag,
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    content: (
                      <span>
                        确认删除运营指标：
                        <span className='modal_text'>
                          {record?.metricsName}
                        </span>
                        <span>？</span>
                      </span>
                    ),
                    onOk: async () => {
                      const { data } =
                        await postComputationOperationMetricsDelete({
                          req: { id },
                        });
                      if (data.code === 200) {
                        Toast('success', '删除成功');
                        refresh?.(
                          {
                            stay: false,
                            tab: 0,
                          },
                          {
                            currentTab: TypeChangeProManage[1],
                          },
                        );
                      }
                    },
                  });
                },
              }),
          ])}
        />
      );
    },
  },
];

export const SearchSchema = (orgs: OrgPojo[]): SearchProps<any>['schema'] => {
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
        type: 'number',
        placeholder: '年份',
        enum: publishYear(2000),
        widget: 'select',
      }),
    },
  };
};
export const opeSearchSchema = (): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeMetricsName: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '运营指标',
        widget: 'Input',
      }),
    },
  };
};
