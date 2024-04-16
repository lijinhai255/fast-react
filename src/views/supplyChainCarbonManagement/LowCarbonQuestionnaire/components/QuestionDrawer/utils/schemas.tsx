/*
 * @@description: 设计问卷-添加/编辑题目schema
 */
import { PlusCircleFilled } from '@ant-design/icons';
import deleteIcon from '@src/image/icon-delete.svg';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { questionTypes } from '@/views/supplyChainCarbonManagement/utils';

const { RadioQuestion, CheckboxQuestion, DetermineQuestion, FillQuestion } =
  questionTypes;
export const questionSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          rowGap: 2,
          columnGap: 24,
          maxColumns: 1,
          minColumns: 1,
        },
        properties: {
          questionType: renderFormItemSchema({
            type: 'string',
            'x-component': 'SelectButtons',
            title: '题目类型',
            enum: [
              {
                label: '单选',
                value: RadioQuestion,
                icon: 'icon-icon_danxuan',
              },
              {
                label: '多选',
                value: CheckboxQuestion,
                icon: 'icon-icon_duoxuan',
              },
              {
                label: '填空',
                value: FillQuestion,
                icon: 'icon-icon_shuru',
              },
              {
                label: '判断',
                value: DetermineQuestion,
                icon: 'icon-icon_panduan',
              },
            ],
            default: 1,
          }),
          title: renderFormItemSchema({
            title: '题干',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 500,
            },
          }),
          tips: renderFormItemSchema({
            title: '填写提示',
            required: false,
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 500,
              style: {
                height: 100,
              },
            },
          }),
          required: renderFormItemSchema({
            title: '是否必答',
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            enum: [
              {
                label: '是',
                value: true,
              },
              {
                label: '否',
                value: false,
              },
            ],
            default: true,
          }),
          optionList: renderFormItemSchema({
            type: 'array',
            title: '选项',
            maxItems: 8,
            'x-component': 'ArrayItems',
            'x-decorator': 'FormItem',
            'x-component-props': {
              style: {
                paddingRight: 80,
                border: 'none',
              },
            },
            'x-reactions': {
              dependencies: ['.questionType'],
              fulfill: {
                schema: {
                  'x-visible': '{{$deps[0] !== 4 }}',
                  required: '{{$deps[0] !== 3 }}',
                },
              },
            },
            items: {
              type: 'object',
              'x-decorator': 'ArrayItems.Item',
              'x-reactions': {
                dependencies: ['..questionType'],
                fulfill: {
                  schema: {
                    'x-disabled': '{{$deps[0] === 3 }}',
                  },
                },
              },
              properties: {
                index: {
                  type: 'void',
                  'x-decorator': 'FormItem',
                  'x-component': 'ArrayItems.Index',
                },
                content: {
                  type: 'string',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: `选项内容`,
                    maxLength: 100,
                  },
                },
                description: {
                  type: 'string',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: `选项说明`,
                    maxLength: 100,
                  },
                },
                allowFillBlanks: {
                  'x-decorator': 'FormItem',
                  'x-component': 'RadioButtonCheckbox',
                  'x-component-props': {
                    style: {
                      width: 100,
                      marginLeft: 16,
                    },
                  },
                  default: false,
                  enum: [
                    {
                      label: '允许填空',
                    },
                  ],
                },
                blankRequired: {
                  'x-decorator': 'FormItem',
                  'x-component': 'RadioButtonCheckbox',
                  'x-component-props': {
                    style: {
                      width: 100,
                    },
                  },
                  default: false,
                  enum: [
                    {
                      label: '填空必填',
                    },
                  ],
                  'x-reactions': [
                    {
                      dependencies: ['.allowFillBlanks'],
                      fulfill: {
                        schema: {
                          'x-disabled': '{{$deps[0] === false }}',
                        },
                      },
                    },
                    {
                      dependencies: ['.allowFillBlanks'],
                      when: '{{$deps[0] === false}}',
                      fulfill: {
                        state: {
                          value: false,
                        },
                      },
                    },
                  ],
                },
                right: {
                  type: 'void',
                  'x-component-props': {
                    style: {
                      width: 100,
                    },
                  },
                  properties: {
                    remove: {
                      type: 'void',
                      'x-component': 'ArrayItems.Remove',
                      'x-component-props': {
                        style: {
                          color: '#999EA4',
                        },
                        icon: <img src={deleteIcon} alt='' />,
                      },
                    },
                  },
                },
              },
            },
            properties: {
              addition: {
                type: 'void',
                title: '添加选项',
                'x-component': 'ArrayItems.Addition',
                'x-component-props': {
                  style: {
                    color: '#2dccaa',
                    width: '100px',
                    border: 'none',
                    marginBottom: '40px',
                  },
                  icon: <PlusCircleFilled />,
                },
                'x-reactions': [
                  {
                    dependencies: ['..questionType'],
                    fulfill: {
                      schema: {
                        'x-visible': '{{$deps[0] !== 3 }}',
                      },
                    },
                  },
                  {
                    dependencies: ['..optionList'],
                    fulfill: {
                      schema: {
                        'x-disabled': '{{$deps[0]?.length > 7 }}',
                      },
                    },
                  },
                ],
              },
            },
          }),
        },
      },
    },
  );
