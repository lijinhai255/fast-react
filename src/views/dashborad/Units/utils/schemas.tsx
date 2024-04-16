import { ISchema } from '@formily/react';
import { compact } from 'lodash-es';
import { SearchProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { RegNumberFore } from '@/utils/regs';

import { DictMap } from '../../Dicts/hooks';

const validateUnit = (dependencies: string[]) => {
  return [
    {
      dependencies,
      fulfill: {
        state: {
          selfErrors:
            '{{ !$self.errors.length  && ($deps[0] && $self.value && $self.value === $deps[0] ? "请将单位2修改为和单位1不同的单位" : "")}}',
        },
      },
    },
  ];
};

export const modalSchema = (): ISchema => ({
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'vertical',
      },
      properties: {
        unitClass: {
          type: 'string',

          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择',
          },
          title: '单位类型',
          'x-validator': [{ required: true, message: '请选择单位类型' }],
        },
        unitFrom: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择',
          },
          'x-reactions': validateUnit(['unitTo']),
          title: '单位1',
          'x-validator': [{ required: true, message: '请选择单位1' }],
        },
        unitTo: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-reactions': validateUnit(['unitFrom']),
          'x-component-props': {
            placeholder: '请选择',
          },
          title: '单位2',
          'x-validator': [{ required: true, message: '请选择单位2' }],
        },
        unitValue: {
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-reactions': [],
          title: '单位1/单位2',
          'x-validator': [
            { required: true, message: '请输入单位1/单位2' },
            ...RegNumberFore,
          ],

          'x-component-props': {
            placeholder: '请输入',
            min: 0,
            // precision: '9999999999'.length,
          },
        },
      },
    },
  },
});

export const searchSchema = (units: DictMap): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {
    // fixme unit
    unit: xRenderSeachSchema({
      type: 'string',
      placeholder: '单位',
      enum: compact(units.enums.map(u => u.dictValue)),
      enumNames: compact(units.enums.map(u => u.dictLabel)),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
    unitClass: xRenderSeachSchema({
      type: 'string',
      placeholder: '单位类型',
      enum: compact(units.type.map(u => u.dictValue)),
      enumNames: compact(units.type.map(u => u.dictLabel)),
      widget: 'select',
      props: {
        allowClear: true,
      },
    }),
  },
});
