import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { CustomTag } from '@/components/CustomTag';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import {
  postEnterprisesystemAuditRollback,
  postEnterprisesystemAuditSubmit,
  SysBusinessTenet,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';

import { getAuditConfig } from './service';
import { pageTo } from '../utils/index';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<SysBusinessTenet>['columns'] => {
  return [
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '核算年度',
      dataIndex: 'accountYear',
    },
    {
      title: '数据收集的时间范围',
      dataIndex: 'collectTime',
    },
    {
      title: '排放量（tCO₂e）',
      dataIndex: 'discharge',
    },
    {
      title: '状态',
      dataIndex: 'status_name',
      render: (value, record) => {
        /** 0 待填报、1 填报中、3已撤回、4待审核、5审核中、6审核通过、7审核不通过； */
        const status = {
          0: 'gold',
          1: 'blue',
          3: '',
          4: 'orange',
          5: 'cyan',
          6: 'green',
          7: 'red',
        };
        return (
          <CustomTag
            color={status[record.status as keyof typeof status]}
            text={value || '-'}
          />
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'subTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 150,
      render(value, row) {
        /**
         * 0 待填报、1 填报中、3已撤回、4待审核、5审核中、6审核通过、7审核不通过；
         * 填报：[0, 1, 3, 7]
         * 提交: [1, 3, 7]
         * 撤回: [4, 5, 6]
         * 查看: [0, 1, 3, 4, 5, 6, 7]
         */
        const {
          id,
          orgName,
          orgId = 0,
          collectTime,
          rollbackBtnFlag,
        } = row || {};
        return (
          <TableActions
            menus={compact([
              [0, 1, 3, 7].includes(value) &&
                checkAuth('/industryCarbonAccounting/fill/fill', {
                  label: '填报',
                  key: '填报',
                  onClick: async () => {
                    if (id)
                      pageTo(
                        navigate,
                        ICARouteMaps.icaFillInfo,
                        PageTypeInfo.edit,
                        id,
                      );
                  },
                }),
              [1, 3, 7].includes(value) &&
                checkAuth('/industryCarbonAccounting/fill/submit', {
                  label: '提交',
                  key: '提交',
                  onClick: async () => {
                    /** 校验是否设置了审批流 */
                    const { data } = await getAuditConfig({
                      orgId,
                    });
                    const { auditRequired, nodeList } = data?.data || {};
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content:
                        /** 不需要审批 则展示弹窗提示 否则展示审批路程 */
                        auditRequired === NOT_REQUIRED ? (
                          <>
                            确认提交该数据：
                            <span className={modalText}>
                              {orgName}: {collectTime}?
                            </span>
                          </>
                        ) : (
                          <AuditConfigTable dataSource={nodeList} />
                        ),
                      ...modelFooterBtnStyle,
                      onOk: async () => {
                        if (id) {
                          await postEnterprisesystemAuditSubmit({
                            req: { id },
                          });
                          refresh?.();
                          Toast('success', '提交成功');
                        }
                      },
                    });
                  },
                }),
              [4, 5, 6].includes(value) &&
                rollbackBtnFlag &&
                checkAuth('/industryCarbonAccounting/fill/recall', {
                  label: '撤回',
                  key: '撤回',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: <>确认撤回该数据，撤回后需要重新审核？</>,
                      ...modelFooterBtnStyle,
                      onOk: async () => {
                        if (id) {
                          await postEnterprisesystemAuditRollback({
                            req: { id },
                          });
                          refresh?.();
                          Toast('success', '撤回成功');
                        }
                      },
                    });
                  },
                }),
              [0, 1, 3, 4, 5, 6, 7].includes(value) &&
                checkAuth('/industryCarbonAccounting/fill/detail', {
                  label: '查看',
                  key: '查看',
                  onClick: async () => {
                    if (id)
                      pageTo(
                        navigate,
                        ICARouteMaps.icaFillInfo,
                        PageTypeInfo.show,
                        id,
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
