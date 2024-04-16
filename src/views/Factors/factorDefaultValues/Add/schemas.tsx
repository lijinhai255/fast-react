import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

import { publishYear } from '../../utils';
import { ModelButtonType } from '../types';

/** 基本信息 */
export const infoSchema = (modelList: ModelButtonType[]) => {
  return renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          year: renderFormItemSchema({
            type: 'number',
            title: '核算年度',
            'x-component': 'Select',
            enum: publishYear(),
          }),
          emptyInfo: renderEmptySchema({
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
          businessModelId: renderFormItemSchema({
            type: 'number',
            title: '核算模型',
            'x-component': 'AccountingModelButton',
            'x-component-props': {
              options: modelList,
            },
            'x-decorator-props': {
              gridSpan: 3,
            },
          }),
        },
      },
    },
  );
};
