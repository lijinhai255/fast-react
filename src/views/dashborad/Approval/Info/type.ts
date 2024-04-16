import { AuditNodeDto } from '@/sdks/systemV2ApiDocs';

export type FormValueType = {
  auditType: number;
  orgId: number;
  nodeList: (AuditNodeDto & {
    targetRoleId?: number;
  })[];
};
