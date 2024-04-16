/**
 * @description 排放数据填报页面
 */
import { Tabs } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { postEnterprisesystemAuditAudit } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import ApproveInfo from '@/views/supplyChainCarbonManagement/components/ApproveInfo';
import { ApproveModal } from '@/views/supplyChainCarbonManagement/components/ApproveModal';
import { AuditListType } from '@/views/supplyChainCarbonManagement/utils/type';

import { TAB_OPTIONS, TAB_TYPE, AUDIT_STATUS_TYPE } from './constant';
import style from './index.module.less';
import {
  getAuditProcessList,
  getAuditRecordList,
} from '../../EmissionFill/service';
import { AuditLog, AuditNode } from '../../EmissionFill/type';
import AccountingCycle from '../../components/AccountingCycle';
import { useAccountingCycleInfo } from '../../hooks';
import {
  getAuditProcessListForCancel,
  getAuditRecordListForCancel,
} from '../service';

const { APPROVAL_CONTENT, APPROVAL_INFO } = TAB_TYPE;

const EmissionApprovalInfo = () => {
  const { isDetail, id, dataId, auditStatus } = usePageInfo();

  /** 审核状态是否为已作废 */
  const isCancel = Number(auditStatus) === AUDIT_STATUS_TYPE.CANCEL;

  /** 详情数据 */
  const detailInfo = useAccountingCycleInfo(Number(dataId));
  const { orgName, accountYear, collectTime, orgId } = detailInfo || {};

  /** 当前选中的tab */
  const [currentTab, setCurrentTab] = useState<string>(APPROVAL_CONTENT);

  /** 控制审核弹窗的显隐 */
  const [open, setOpen] = useState(false);

  /** 审核记录列表 */
  const [approvalRecord, setApprovalRecord] = useState<AuditLog[]>();

  /** 审核列表列表 */
  const [approvalProcess, setApprovalProcess] = useState<AuditNode[]>();

  useEffect(() => {
    if (id && currentTab === APPROVAL_INFO) {
      /** 其他状态 */
      if (dataId && !isCancel) {
        /** 审核记录 */
        getAuditRecordList({ computationDataId: Number(dataId) }).then(
          ({ data }) => {
            setApprovalRecord(data?.data as AuditLog[]);
          },
        );
        /** 审核流程 */
        getAuditProcessList({ computationDataId: Number(dataId) }).then(
          ({ data }) => {
            setApprovalProcess(data?.data as AuditLog[]);
          },
        );
      }
      /** 已作废 */
      if (isCancel) {
        /** 审核记录 */
        getAuditRecordListForCancel({
          auditDataId: id,
        }).then(({ data }) => {
          setApprovalRecord(data?.data as AuditLog[]);
        });
        /** 审核流程 */
        getAuditProcessListForCancel({
          auditDataId: id,
        }).then(({ data }) => {
          setApprovalProcess(data?.data as AuditNode[]);
        });
      }
    }
  }, [id, currentTab, isCancel, dataId]);
  return (
    <main
      className={classNames(style.wrapper, {
        [style.detailWrapper]: currentTab === APPROVAL_CONTENT,
      })}
    >
      <div className={style.cycleTabs}>
        <Tabs
          items={TAB_OPTIONS}
          onChange={currentTabValue => {
            setCurrentTab(currentTabValue);
          }}
        />
      </div>
      {currentTab === APPROVAL_CONTENT && (
        <div className={style.accountingCycleWrapper}>
          <AccountingCycle
            tendId={Number(dataId)}
            isViewMode
            headerBasicInfo={{
              核算组织: orgName,
              核算年度: accountYear,
              数据收集的时间范围: collectTime,
            }}
            cycleDetailInfo={{
              orgId,
              orgName,
              accountYear,
              collectTime,
            }}
          />
        </div>
      )}

      {currentTab === APPROVAL_INFO && (
        <div className={style.approverWrapper}>
          <ApproveInfo
            approvalRecord={approvalRecord}
            approvalProcess={approvalProcess}
          />
        </div>
      )}
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '审核',
            type: 'primary',
            onClick: async () => {
              setOpen(true);
            },
          },
          {
            title: '返回',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
      <ApproveModal
        open={open}
        handleCancel={() => {
          setOpen(false);
        }}
        handleOk={(value: AuditListType) => {
          postEnterprisesystemAuditAudit({
            req: {
              ...value,
              auditDataId: Number(id),
            },
          }).then(({ data }) => {
            if (data.code === 200) {
              setOpen(false);
              history.back();
            }
          });
        }}
      />
    </main>
  );
};
export default EmissionApprovalInfo;
