import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { EnumResp } from '@/sdks/systemV2ApiDocs';

export const SearchSchema = (
  moduleType?: EnumResp[],
): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    likeUsername: xRenderSeachSchema({
      type: 'string',
      placeholder: '操作用户/姓名',
    }),
    moduleType: xRenderSeachSchema({
      type: 'string',
      placeholder: '操作模块',
      // fixme 接口目前没有提供这里的字段
      enum: compact(moduleType?.map(k => `${k.code ?? ''}`)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      enumNames: compact(moduleType?.map(k => k.name)),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
    startDate: xRenderSeachSchema({
      width: 360 + 80,
      title: '操作时间',
      labelWidth: 80,
      type: 'array',
      format: 'string',
      props: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      widget: 'dateRange',
    }),
  },
});
