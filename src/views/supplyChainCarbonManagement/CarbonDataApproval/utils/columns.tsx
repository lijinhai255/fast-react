import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { AuditDataResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

import { ApproverPopover } from '../../components/ApproverModal';

export const columns = ({
  navigate,
}: {
  navigate: NavigateFunction;
}): TableRenderProps<AuditDataResp>['columns'] => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '数据类型',
    dataIndex: 'dataType_name',
  },
  {
    title: '温室气体排放数据',
    dataIndex: 'gasData',
  },
  {
    title: '状态',
    dataIndex: 'auditStatus_name',
    render: (value, record) => {
      /** 0 待审核 1 审核通过 2审核不通过 */
      const status = {
        0: 'orange',
        1: 'green',
        2: 'red',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={status[record?.auditStatus as unknown as keyof typeof status]}
          tagText={value}
        />
      );
    },
  },
  {
    title: '提交时间',
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: '待审核人',
    dataIndex: 'targetNames',
    width: 150,
    render: (value, record) => {
      const isApproval = Number(record.auditStatus) === 0;
      return isApproval ? (
        <ApproverPopover id={record.id}>{value}</ApproverPopover>
      ) : (
        '-'
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'auditStatus',
    width: 120,
    render: (value, row) => {
      const { id, dataId, auditStatus } = row;
      return (
        <TableActions
          menus={compact([
            Number(value) === 0 &&
              checkAuth('/supplyChain/carbonDataApproval/approve', {
                label: '审核',
                key: '审核',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmApprovalInfo,
                      [
                        PAGE_TYPE_VAR,
                        ':id',
                        ':dataId',
                        ':dataType',
                        ':auditStatus',
                      ],
                      [PageTypeInfo.edit, id, dataId, 'approve', auditStatus],
                    ),
                  );
                },
              }),
            checkAuth('/supplyChain/carbonDataApproval/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmApprovalInfo,
                    [
                      PAGE_TYPE_VAR,
                      ':id',
                      ':dataId',
                      ':dataType',
                      ':auditStatus',
                    ],
                    [PageTypeInfo.show, id, dataId, 'show', auditStatus],
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
