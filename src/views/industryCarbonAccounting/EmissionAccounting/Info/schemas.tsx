import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

import { COLLECT_CTCLE_OPTIONS, COLLECT_CTCLE_TYPE } from './constant';

const { YEAR } = COLLECT_CTCLE_TYPE;

/** 基本信息 */
export const infoSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          orgId: renderFormItemSchema({
            title: '组织名称',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
          }),
          accountYear: renderFormItemSchema({
            title: '核算年度',
            'x-component': 'Select',
            'x-component-props': {
              allowClear: true,
            },
          }),
          collectCycle: renderFormItemSchema({
            title: '数据收集周期',
            'x-component': 'Radio.Group',
            enum: COLLECT_CTCLE_OPTIONS,
            default: YEAR,
          }),
        },
      },
    },
  );
