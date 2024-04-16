import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { getEnterprisesystemSysDefaultYearProps as SearchApiProps } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { EnumType } from './types';
import { publishYear } from '../utils';

export const searchSchema = (
  modelList: EnumType[],
): SearchProps<SearchApiProps>['schema'] => {
  return {
    type: 'object',
    properties: {
      year: xRenderSeachSchema({
        type: 'number',
        placeholder: '核算年度',
        enum: publishYear(),
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
      businessModelId: xRenderSeachSchema({
        type: 'string',
        placeholder: '核算模型',
        enum: compact(modelList?.map(item => String(item.value))),
        enumNames: compact(modelList?.map(item => item.label)),
        widget: 'select',
        props: {
          allowClear: true,
          showSearch: true,
          optionFilterProp: 'label',
        },
      }),
    },
  };
};
