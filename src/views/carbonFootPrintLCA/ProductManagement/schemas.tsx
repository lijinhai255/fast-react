import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';

export const searchSchema = (orgList: Org[]): SearchProps<any>['schema'] => {
  return {
    type: 'object',
    properties: {
      nameOrCode: xRenderSeachSchema({
        type: 'string',
        placeholder: '产品名称或编码',
      }),
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: '所属组织',
        enum: compact(orgList.map(u => String(u.id))),
        enumNames: compact(orgList.map(u => u.orgName)),
        widget: 'select',
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
    },
  };
};
