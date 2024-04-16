import { request, ResponseData } from '@src/api/request';

import { AuditDetailDto, AuditNode, AuditLog } from './type';

/**
 * @description 查询审批配置
 */
export const getAuditConfig = (params: { orgId: number }) =>
  request<ResponseData<AuditDetailDto>>({
    method: 'GET',
    url: `/computation/audit/${params.orgId}`,
    params,
  });

/**
 * @description 审批流程列表
 */
export const getAuditProcessList = (params: { computationDataId: number }) =>
  request<ResponseData<AuditNode[]>>({
    method: 'GET',
    url: `/computation/audit/node/list/curr`,
    params,
  });

/**
 * @description 审批记录列表
 */

export const getAuditRecordList = (params: { computationDataId: number }) =>
  request<ResponseData<AuditLog[]>>({
    method: 'GET',
    url: `/computation/audit/log/list`,
    params,
  });
