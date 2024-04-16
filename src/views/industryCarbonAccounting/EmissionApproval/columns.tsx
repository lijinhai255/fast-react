import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { CustomTag, auditDataColor } from '@/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import { AuditData } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { ApproverPopover } from '../components/ApproverModal';
import { pageTo } from '../utils/index';

export const columns = ({
  navigate,
}: {
  navigate: NavigateFunction;
}): TableRenderProps<AuditData>['columns'] => {
  return [
    {
      title: '审核内容',
      dataIndex: 'auditType_name',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '提交人',
      dataIndex: 'createByName',
    },

    {
      title: '提交时间',
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus_name',
      width: 150,
      render: (value, record) => {
        /** 0待审核 1审核通过 2审核不通过 3已撤回 4已作废 */
        return (
          <CustomTag
            color={
              auditDataColor[record?.auditStatus as keyof typeof auditDataColor]
            }
            text={value || '-'}
          />
        );
      },
    },
    {
      title: '待审核人',
      dataIndex: 'targetNames',
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
      dataIndex: 'action',
      width: 100,
      render(_, row) {
        const { id, dataId, auditStatus, userBtnFlag } = row || {};
        return (
          <TableActions
            menus={compact([
              Number(auditStatus) === 0 &&
                userBtnFlag === true &&
                checkAuth('/industryCarbonAccounting/approval/approve', {
                  label: '审核',
                  key: '审核',
                  onClick: async () => {
                    if (id)
                      pageTo(
                        navigate,
                        ICARouteMaps.icaApprovalInfo,
                        PageTypeInfo.edit,
                        id,
                        {
                          dataId,
                          auditStatus,
                        },
                      );
                  },
                }),
              checkAuth('/industryCarbonAccounting/approval/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  if (id)
                    pageTo(
                      navigate,
                      ICARouteMaps.icaApprovalInfo,
                      PageTypeInfo.show,
                      id,
                      {
                        dataId,
                        auditStatus,
                      },
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
