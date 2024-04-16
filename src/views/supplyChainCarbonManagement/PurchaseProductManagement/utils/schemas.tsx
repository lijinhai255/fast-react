/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-23 09:47:34
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-23 09:50:40
 */
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';

export const searchSchema = (orgList: Org[]) => ({
  type: 'object',
  properties: {
    likeProductName: xRenderSeachSchema({
      type: 'string',
      placeholder: '产品名称',
      widget: 'input',
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
});
