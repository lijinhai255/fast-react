import { request, ResponseData } from '@src/api/request';

import { AuditNode, AuditLog } from '../EmissionFill/type';

/**
 * @description 指定审批流程列表（仅状态为已作废时）
 */
export const getAuditProcessListForCancel = (params: { auditDataId: number }) =>
  request<ResponseData<AuditNode[]>>({
    method: 'GET',
    url: `/enterprisesystem/audit/node/list`,
    params,
  });

/**
 * @description 审批记录列表（仅状态为已作废时）
 */

export const getAuditRecordListForCancel = (params: { auditDataId: number }) =>
  request<ResponseData<AuditLog[]>>({
    method: 'GET',
    url: `/enterprisesystem/audit/data/log/list`,
    params,
  });
