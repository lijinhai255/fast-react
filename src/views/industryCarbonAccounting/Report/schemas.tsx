import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';
import { getEnterprisesystemSysReportPageProps as SearchApiProps } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { publishYear } from '@/views/Factors/utils';

export const searchSchema = (
  orgList: Org[],
): SearchProps<SearchApiProps>['schema'] => {
  return {
    type: 'object',
    properties: {
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: '组织名称',
        enum: compact(orgList.map(u => String(u.id))),
        enumNames: compact(orgList.map(u => u.orgName)),
        widget: 'select',
        props: {
          showSearch: true,
          optionFilterProp: 'label',
          allowClear: true,
        },
      }),
      accountYear: xRenderSeachSchema({
        type: 'string',
        placeholder: '核算年度',
        enum: publishYear().map(item => `${item}`),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
