import { request, ResponseData } from '@src/api/request';

import { AuditDetailDto } from './type';

/**
 * @description 查询审批配置
 */
export const getAuditConfig = (params: { applyInfoId: number }) =>
  request<ResponseData<AuditDetailDto>>({
    method: 'GET',
    url: '/supplychain/audit/check',
    params,
  });
