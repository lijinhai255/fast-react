import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';
import { getEnterprisesystemSysCellPageProps as SearchApiProps } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

export const searchSchema = (
  orgList: Org[],
): SearchProps<SearchApiProps>['schema'] => {
  return {
    type: 'object',
    properties: {
      name: xRenderSeachSchema({
        type: 'string',
        placeholder: '生产单元名称',
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
      cellNo: xRenderSeachSchema({
        type: 'string',
        placeholder: '生产单元编号',
      }),
    },
  };
};
