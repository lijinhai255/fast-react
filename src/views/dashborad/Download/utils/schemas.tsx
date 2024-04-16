/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-22 11:07:39
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-18 15:23:18
 */
import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp, Org } from '@/sdks/systemV2ApiDocs';

export const searchSchema = (
  orgs: Org[],
  bizModule: EnumResp[],
): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    orgId: xRenderSeachSchema({
      type: 'string',
      placeholder: '所属组织',
      enum: compact(orgs.map(o => `${o.id}`)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      enumNames: compact(orgs.map(o => o.orgName)),
      props: {
        allowClear: true,
        filterOption: (input: string, option: any) =>
          (option?.label ?? '').includes(input),
        showSearch: true,
      },
      widget: 'select',
    }),
    bizModule: xRenderSeachSchema({
      type: 'string',
      placeholder: '功能模块',
      enum: compact(bizModule.map(m => `${m.code}`)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      enumNames: compact(bizModule.map(m => m.name)),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
  },
});
