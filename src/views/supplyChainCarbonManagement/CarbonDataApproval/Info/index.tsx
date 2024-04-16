/*
 * @@description: 供应链碳管理-碳数据审核-详情
 */
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  AuditDto,
  postSupplychainAuditAudit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

import style from '../../SupplierManagement/Info/index.module.less';
import { ApproveModal } from '../../components/ApproveModal';
import CarbonDataInfo from '../../components/CarbonDataInfo';
import { AuditListType } from '../../utils/type';
import {
  getAuditProcessList,
  getAuditProcessListForCancel,
  getAuditRecordList,
  getAuditRecordListForCancel,
} from '../service';
import { AuditLog, AuditNode } from '../type';

/** 已作废 */
const cancel = 4;
function CarbonDataApproval() {
  const navigate = useNavigate();
  const { pageTypeInfo, id, dataId, dataType, auditStatus } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    dataId: string;
    dataType: string;
    auditStatus: string;
  }>();

  /** 申请id */
  const applyInfoId = Number(dataId);

  /** 审核id */
  const auditDataId = Number(id);

  /** 审核状态是否为已作废 */
  const isCancel = Number(auditStatus) === cancel;

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为审核页面 */
  const isApprove = dataType === 'approve';

  /** 控制审核弹窗的显隐 */
  const [open, changeOpen] = useState(false);

  /** 审核记录列表 */
  const [approvalRecord, setApprovalRecord] = useState<AuditLog[]>();

  /** 审核列表列表 */
  const [approvalProcess, setApprovalProcess] = useState<AuditNode[]>();

  /** 审批记录 */
  useEffect(() => {
    if (auditDataId && isCancel) {
      getAuditRecordListForCancel({
        auditDataId: Number(id),
      }).then(({ data }) => {
        setApprovalRecord(data.data);
      });
    }
    if (applyInfoId && !isCancel) {
      getAuditRecordList({
        applyInfoId,
      }).then(({ data }) => {
        setApprovalRecord(data.data);
      });
    }
  }, [auditDataId, applyInfoId, isCancel]);

  /** 审批流程 */
  useEffect(() => {
    if (auditDataId && isCancel) {
      getAuditProcessListForCancel({
        auditDataId: Number(id),
      }).then(({ data }) => {
        setApprovalProcess(data.data);
      });
    }
    if (applyInfoId && !isCancel) {
      getAuditProcessList({
        applyInfoId,
      }).then(({ data }) => {
        setApprovalProcess(data.data);
      });
    }
  }, [auditDataId, applyInfoId, isCancel]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <CarbonDataInfo
        id={dataId}
        disabled={isDetail || isApprove}
        approvalRecord={approvalRecord}
        approvalProcess={approvalProcess}
        onDetailClick={row => {
          navigate(
            virtualLinkTransform(
              SccmRouteMaps.sccmApprovalInfoEnterpriseEmissonSourceInfo,
              [
                PAGE_TYPE_VAR,
                ':id',
                ':dataId',
                ':dataType',
                ':auditStatus',
                ':factorPageInfo',
                ':factorId',
              ],
              [
                pageTypeInfo,
                id,
                dataId,
                dataType,
                auditStatus,
                PageTypeInfo.show,
                row?.id,
              ],
            ),
          );
        }}
      />
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '审核',
            type: 'primary',
            onClick: async () => {
              changeOpen(true);
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
          changeOpen(false);
        }}
        handleOk={(value: AuditListType) => {
          postSupplychainAuditAudit({
            req: {
              ...value,
              auditDataId: Number(id),
            } as AuditDto,
          }).then(({ data }) => {
            if (data.code === 200) {
              changeOpen(false);
              history.back();
            }
          });
        }}
      />
    </div>
  );
}
export default CarbonDataApproval;
