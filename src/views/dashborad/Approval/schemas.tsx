import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { AuditResp, EnumResp, Org } from '@/sdks/systemV2ApiDocs';

export const searchSchema = (
  orgs: Org[],
  auditTypeEnum: EnumResp[],
): SearchProps<Partial<AuditResp>>['schema'] => ({
  type: 'object',
  properties: {
    auditType: xRenderSeachSchema({
      type: 'string',
      placeholder: '审批内容',
      enum: compact(auditTypeEnum.map(k => `${k.code}`)),
      enumNames: compact(auditTypeEnum.map(k => k.name)),
      widget: 'select',
      props: {
        filterOption: (input: string, option: any) =>
          (option?.label ?? '').includes(input),
        showSearch: true,
        allowClear: true,
      },
    }),
    orgId: xRenderSeachSchema({
      type: 'string',
      placeholder: '所属组织',
      enum: compact(orgs.map(o => `${o.id}`)),
      enumNames: compact(orgs.map(o => o.orgName)),
      widget: 'select',
      props: {
        filterOption: (input: string, option: any) =>
          (option?.label ?? '').includes(input),
        showSearch: true,
        allowClear: true,
      },
    }),
  },
});
