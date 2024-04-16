/*
 * @@description: 表单项配置
 */

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderEmptySchema,
  renderFromGridSchema,
} from '@/components/formily/utils';

import { optionsArr } from './utils';

export const schema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          questionType: renderFormItemSchema({
            title: '题型',
            'x-component': 'Radio.Group',
            default: 0,
            enum: [
              { label: '单选', value: 0 },
              { label: '多选', value: 1 },
              { label: '判断', value: 2 },
            ],
          }),
          empty1: renderEmptySchema(),
          empty2: renderEmptySchema(),
          questionTitle: renderFormItemSchema({
            title: '题干',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              maxLength: 500,
            },
            'x-decorator-props': {
              gridSpan: 2,
            },
          }),
        },
      },
    },
  );

export const schemaTable = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          answerList: {
            title: '答案',
            type: 'array',
            required: true,
            'x-component': 'ArrayTable',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-decorator': 'FormItem',
            'x-component-props': {
              pagination: false,
            },
            items: {
              type: 'object',
              properties: {
                columns1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '选项',
                    width: 100,
                  },
                  properties: {
                    option: renderEmptySchema(
                      { type: 'string' },
                      {
                        showVal: (row: any, index: number | undefined) => {
                          return optionsArr[index || 0]?.label;
                        },
                      },
                    ),
                  },
                },
                column2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: '内容' },
                  properties: {
                    answer: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        maxLength: 100,
                      },
                    },
                  },
                },
                column3: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { width: 100, title: '正确答案' },
                  properties: {
                    correctAnswer: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Radio',
                      'x-reactions': [
                        {
                          dependencies: ['questionType'],
                          fulfill: {
                            schema: {
                              'x-visible': '{{($deps[0] !== 1)}}',
                            },
                          },
                        },
                      ],
                    },
                    correctAnswer2: {
                      type: 'string',
                      'x-decorator': 'FormItem',
                      'x-component': 'Checkbox',
                      'x-reactions': [
                        {
                          dependencies: ['questionType'],
                          fulfill: {
                            schema: {
                              'x-visible': '{{($deps[0] === 1)}}',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                column4: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '操作',
                    dataIndex: 'operations',
                    width: 200,
                    fixed: 'right',
                  },
                  properties: {
                    item: {
                      type: 'void',
                      'x-component': 'FormItem',
                      properties: {
                        remove: {
                          type: 'void',
                          'x-component': 'ArrayTable.Remove',
                          'x-component-props': {
                            icon: null,
                            title: '删除',
                          },
                          'x-reactions': [
                            {
                              dependencies: ['questionType', 'answerList'],
                              fulfill: {
                                schema: {
                                  'x-disabled':
                                    '{{($deps[0] === 0 && $deps[1].length <= 3) || ($deps[0] === 1 && $deps[1].length <= 4)}}',
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                  'x-reactions': [
                    {
                      dependencies: ['questionType'],
                      fulfill: {
                        schema: {
                          'x-visible': '{{$deps[0] !== 2}}',
                        },
                      },
                    },
                  ],
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                'x-component': 'ArrayTable.Addition',
                title: '添加',
                'x-reactions': [
                  {
                    dependencies: ['questionType', 'answerList'],
                    fulfill: {
                      schema: {
                        'x-visible':
                          '{{$deps[0] !== 2 && $deps[1].length > 2}}',
                        'x-disabled':
                          '{{($deps[0] === 0 && $deps[1].length >= 5) || ($deps[0] === 1 && $deps[1].length >= 8)}}',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  );
