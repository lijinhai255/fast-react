import {
  renderEmptySchema,
  renderFormilyTableAction,
  renderFormItemSchema,
  renderFromGridSchema,
  renderSchemaWithLayout,
} from '@/components/formily/utils';
import { convertToChineseUpper } from '@/utils';

import { ADUDIT_REQUIRED_OPTIONS, ADUDIT_REQUIRED_TYPE } from './constant';

const { REQUIRED } = ADUDIT_REQUIRED_TYPE;

export const schema = (isDetail: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          auditType: renderFormItemSchema({
            title: '审批内容',
            'x-component': 'Select',
          }),
          orgId: renderFormItemSchema({
            title: '所属组织',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
              allowClear: true,
            },
          }),
          auditRequired: renderFormItemSchema({
            title: '审批配置',
            'x-component': 'Radio.Group',
            enum: ADUDIT_REQUIRED_OPTIONS,
            default: REQUIRED,
          }),
          nodeList: {
            type: 'array',
            title: '审批流',
            'x-component': 'ArrayTable',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              gridSpan: 3,
            },
            'x-component-props': {
              pagination: false,
              scroll: { x: 1200 },
            },
            'x-reactions': {
              dependencies: ['auditRequired'],
              fulfill: {
                schema: {
                  'x-visible': `{{$deps[0] === ${REQUIRED} }}`,
                },
              },
            },
            // columns
            items: {
              type: 'object',
              properties: {
                column1: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': {
                    title: '审批节点',
                    width: 144,
                    fixed: 'left',
                  },
                  properties: {
                    nodeLevel: renderEmptySchema(
                      { type: 'string' },
                      {
                        showVal: (_, index) =>
                          `${
                            convertToChineseUpper((Number(index) || 0) + 1) ===
                            '一十零'
                              ? '十'
                              : convertToChineseUpper((Number(index) || 0) + 1)
                          }级审批`,
                      },
                    ),
                  },
                },
                column2: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: '审批节点' },
                  properties: {
                    nodeName: renderFormItemSchema({
                      validateTitle: '节点名称',
                      'x-component': 'Input',
                      'x-component-props': {
                        maxLength: 50,
                      },
                    }),
                  },
                },
                column3: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: '审批配置类型' },
                  properties: {
                    configType: renderFormItemSchema({
                      validateTitle: '审批配置',
                      'x-component': 'Select',
                    }),
                  },
                },
                column4: {
                  type: 'void',
                  'x-component': 'ArrayTable.Column',
                  'x-component-props': { title: '审批配置' },
                  properties: {
                    configGrid: {
                      ...renderFromGridSchema({ columns: 2 }),
                      properties: {
                        targetIds: renderFormItemSchema({
                          'x-decorator-props': { gridSpan: 2 },
                          validateTitle: '用户',
                          'x-component': 'Select',
                          'x-component-props': {
                            mode: 'multiple',
                            showSearch: true,
                            filterOption: (input: string, option: any) =>
                              (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase()),
                          },
                        }),
                        auditOrgId: renderFormItemSchema({
                          validateTitle: '组织',
                          required: false,
                          'x-component': 'Select',
                          'x-visible': false,
                        }),
                        targetRoleId: renderFormItemSchema({
                          validateTitle: '角色',
                          'x-component': 'Select',
                          'x-visible': false,
                        }),
                      },
                    },
                  },
                },
                column5: renderFormilyTableAction({
                  actionBtns: ({ index, array }) => [
                    {
                      label: '新增',
                      key: 'Add',
                      disabled:
                        isDetail ||
                        index < array.field.value.length - 1 ||
                        index === 9,
                      onClick: async () => {
                        const { value } = array.field;
                        array.field.push({
                          nodeLevel: value[value.length - 1].nodeLevel + 1,
                        });
                      },
                    },
                    {
                      label: '删除',
                      key: 'del',
                      disabled: isDetail || index === 0,
                      onClick: async () => {
                        array.field.remove(index);
                      },
                    },
                  ],
                  width: 120,
                  wrapperProps: {
                    'x-component-props': {
                      fixed: 'right',
                    },
                  },
                }),
              },
            },
          },
        },
      },
    },
  );
