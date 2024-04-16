import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks/systemV2ApiDocs';

export const searchSchema = (
  statusList?: EnumResp[],
): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      auditStatus: xRenderSeachSchema({
        type: 'string',
        placeholder: '审核状态',
        enum: compact(statusList?.map(u => String(u.code))),
        enumNames: compact(statusList?.map(u => u.name)),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
