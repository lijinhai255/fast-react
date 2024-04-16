/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-26 11:06:42
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-26 15:06:03
 */
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const searchSchema = (
  orgList: Org[],
  supplyStatusOptions?: EnumResp[],
) => ({
  type: 'object',
  properties: {
    likeSupplierName: xRenderSeachSchema({
      type: 'string',
      placeholder: '供应商名称',
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
    likeSupplierCode: xRenderSeachSchema({
      type: 'string',
      placeholder: '供应商编码',
      widget: 'input',
    }),
    supplierStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: '状态',
      widget: 'select',
      enum: compact(supplyStatusOptions?.map(v => String(v.code))),
      enumNames: compact(supplyStatusOptions?.map(v => v.name)),
      props: {
        allowClear: true,
      },
    }),
  },
});
