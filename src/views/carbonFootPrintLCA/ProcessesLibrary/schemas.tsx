/*
 * @@description:
 */
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { getEnterprisesystemSysCellPageProps as SearchApiProps } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

export const searchSchema = (): SearchProps<SearchApiProps>['schema'] => {
  return {
    type: 'object',
    properties: {
      likeProcessName: xRenderSeachSchema({
        type: 'string',
        placeholder: '过程名称',
      }),
      /** 暂时去掉 */
      // orgId: xRenderSeachSchema({
      //   type: 'string',
      //   placeholder: '所属组织',
      //   enum: compact(orgList.map(u => String(u.id))),
      //   enumNames: compact(orgList.map(u => u.orgName)),
      //   widget: 'select',
      //   props: {
      //     showSearch: true,
      //     optionFilterProp: 'label',
      //     allowClear: true,
      //   },
      // }),
      outputProductName: xRenderSeachSchema({
        type: 'string',
        placeholder: '产出产品',
      }),
    },
  };
};
