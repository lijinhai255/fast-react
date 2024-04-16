/**
 * @description 排放数据填报页面
 */
import { Tabs } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import ApproveInfo from '@/views/supplyChainCarbonManagement/components/ApproveInfo';

import { TAB_OPTIONS, TAB_TYPE } from './constant';
import style from './index.module.less';
import AccountingCycle from '../../components/AccountingCycle';
import { useAccountingCycleInfo } from '../../hooks';
import { getAuditProcessList, getAuditRecordList } from '../service';
import { AuditLog, AuditNode } from '../type';

const { EMISSION_DATA, APPROVAL_INFO } = TAB_TYPE;

const EmissionFillInfo = () => {
  const { isDetail, id } = usePageInfo();

  /** 详情数据 */
  const detailInfo = useAccountingCycleInfo(id);
  const { orgName, accountYear, collectTime, orgId } = detailInfo || {};

  /** 当前选中的tab */
  const [currentTab, setCurrentTab] = useState<string>(EMISSION_DATA);

  /** 审核记录列表 */
  const [approvalRecord, setApprovalRecord] = useState<AuditLog[]>();

  /** 审核流程列表 */
  const [approvalProcess, setApprovalProcess] = useState<AuditNode[]>();

  useEffect(() => {
    if (isDetail && id && currentTab === APPROVAL_INFO) {
      /** 审核记录 */
      getAuditRecordList({ computationDataId: id }).then(({ data }) => {
        setApprovalRecord(data?.data);
      });

      /** 审核流程 */
      getAuditProcessList({ computationDataId: id }).then(({ data }) => {
        setApprovalProcess(data?.data);
      });
    }
  }, [isDetail, id, currentTab]);

  return (
    <main
      className={classNames(style.wrapper, {
        [style.detailWrapper]: isDetail && currentTab === EMISSION_DATA,
      })}
    >
      {isDetail && (
        <div className={style.cycleTabs}>
          <Tabs
            items={TAB_OPTIONS}
            onChange={currentTabValue => {
              setCurrentTab(currentTabValue);
            }}
          />
        </div>
      )}
      {currentTab === EMISSION_DATA && (
        <div className={style.accountingCycleWrapper}>
          <AccountingCycle
            isViewMode={isDetail}
            tendId={id}
            headerBasicInfo={{
              所属组织: orgName,
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
          {
            title: '返回',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </main>
  );
};
export default EmissionFillInfo;
