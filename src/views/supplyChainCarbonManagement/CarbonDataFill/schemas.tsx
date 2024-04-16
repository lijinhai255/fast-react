import { compact } from 'lodash-es';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const searchSchema = (
  dataTypeOptions?: EnumResp[],
  applyStatusOptions?: EnumResp[],
) => ({
  type: 'object',
  properties: {
    likeCompanyName: xRenderSeachSchema({
      type: 'string',
      placeholder: '客户名称',
      widget: 'input',
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
      enumNames: compact(
        applyStatusOptions
          ?.map(v => ({
            name:
              Number(v.code) === 0
                ? '待填报'
                : Number(v.code) === 1
                ? '已填报'
                : v.name,
          }))
          .map(v => v.name),
      ),
      props: {
        allowClear: true,
      },
    }),
  },
});
