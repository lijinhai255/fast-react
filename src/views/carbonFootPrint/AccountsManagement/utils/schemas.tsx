/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-09 11:15:59
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 10:22:27
 */
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';

/** 碳足迹核算-列表-搜索schema */
export const searchSchema = (orgList: Org[]) => ({
  type: 'object',
  properties: {
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
    productionName: xRenderSeachSchema({
      type: 'string',
      placeholder: '产品名称',
      widget: 'input',
    }),
    productionCode: xRenderSeachSchema({
      type: 'string',
      placeholder: '产品编码',
      widget: 'input',
    }),
  },
});
