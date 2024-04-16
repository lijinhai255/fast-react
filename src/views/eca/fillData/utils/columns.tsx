import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { CustomTag, fillDataColor } from '@/components/CustomTag';
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
  ComputationData,
  postComputationDataRollback,
  postComputationDataSubmit,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { Toast, returnNoIconModalStyle } from '@/utils';
import { publishYear } from '@/views/Factors/utils';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';

import { ComputationEnums, UseOrgs } from '../../hooks';
import { getAuditConfig } from '../service';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<
  ComputationData & { dataStatus_name: string; rollbackBtnFlag: boolean }
>['columns'] => {
  return [
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '核算年度',
      dataIndex: 'year',
    },

    {
      title: '数据收集的时间范围',
      dataIndex: 'dateRange',
      render: text => {
        return text || '-';
      },
    },
    {
      title: '排放量（tCO₂e）',
      dataIndex: 'carbonEmission',
      render: text => {
        return text || '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'dataStatus',
      width: 120,
      render: (
        value: keyof typeof fillDataColor,
        record: { dataStatus_name: string },
      ) => {
        return (
          <CustomTag
            color={fillDataColor[value]}
            text={record?.dataStatus_name || '-'}
          />
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      width: 180,
    },
    {
      title: '操作',
      width: 160,
      dataIndex: 'id',
      render(id, record) {
        // 0 待填报 1 填报中 2 已填报 3 已撤回 4 审核中 5 审核通过 6 审核不通过
        // 填报 【0 ，1，2，3，6】
        // 提交 【2，3，6】
        // 撤回 【4，5】
        return (
          <TableActions
            menus={compact([
              [0, 1, 2, 3, 7].includes(Number(record.dataStatus)) &&
                checkAuth('/fillDataInfo/Add', {
                  label: '填报',
                  key: '填报',
                  onClick: async () => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.fillDataInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.edit, id],
                      ),
                    );
                  },
                }),

              [2, 3, 7].includes(Number(record.dataStatus)) &&
                checkAuth('/fillDataInfo/Submit', {
                  label: '提交',
                  key: '提交',
                  onClick: async () => {
                    /** 查询审批配置 */
                    const { data } = await getAuditConfig({
                      orgId: Number(record?.orgId || 0),
                    });
                    const { auditRequired, nodeList } = data?.data || {};
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content:
                        /** 不需要审批 则展示弹窗提示 否则展示审批路程 */
                        auditRequired === NOT_REQUIRED ? (
                          <span>
                            确认提交该数据，{record?.orgName}：
                            <span className='modal_text'>
                              {record?.dateRange}？
                            </span>
                          </span>
                        ) : (
                          <AuditConfigTable dataSource={nodeList} />
                        ),
                      ...returnNoIconModalStyle,
                      onOk: () => {
                        return postComputationDataSubmit({
                          req: { id: Number(record?.id || 0) },
                        }).then(() => {
                          Toast('success', '提交成功');
                          refresh?.();
                        });
                      },
                    });
                  },
                }),

              record?.rollbackBtnFlag &&
                checkAuth('/fillDataInfo/Reject', {
                  label: '撤回',
                  key: '撤回',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      ...returnNoIconModalStyle,
                      content: `确认撤回该数据？撤回后需要重新审核。`,
                      onOk: () => {
                        return postComputationDataRollback({
                          req: { id: Number(record?.id || 0) },
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', '撤回成功');
                            refresh?.();
                          }
                        });
                      },
                    });
                  },
                }),
              checkAuth('/fillDataInfo/Show', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.fillDataInfo,
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
};

export const SearchSchema = (): SearchProps<any>['schema'] => {
  const orgs = UseOrgs();
  const DataStatusArr = ComputationEnums('DataStatus');
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
      dataStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: '状态',
        enum: DataStatusArr?.map(org => `${org?.value}` as string),
        enumNames: DataStatusArr?.map(org => org?.label as string),
        widget: 'select',
        props: {
          allowClear: true,
        },
        // props: {
        //   showSearch: true,
        //   filterOption: (input: string, option: any) =>
        //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        // },
      }),
    },
  };
};
