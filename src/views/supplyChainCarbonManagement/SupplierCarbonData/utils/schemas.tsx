/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-26 11:06:42
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-09 11:54:55
 */
import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { Org } from '@/sdks/systemV2ApiDocs';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const searchSchema = (
  orgList: Org[],
  dataTypeOptions?: EnumResp[],
  applyStatusOptions?: EnumResp[],
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
    dataType: xRenderSeachSchema({
      type: 'string',
      placeholder: '数据类型',
      widget: 'select',
      enum: compact(dataTypeOptions?.map(v => String(v.code))),
      enumNames: compact(dataTypeOptions?.map(v => v.name)),
      props: {
        allowClear: true,
      },
    }),
    applyStatus: xRenderSeachSchema({
      type: 'string',
      placeholder: '状态',
      widget: 'select',
      enum: compact(applyStatusOptions?.map(v => String(v.code))),
      enumNames: compact(applyStatusOptions?.map(v => v.name)),
      props: {
        allowClear: true,
      },
    }),
  },
});
