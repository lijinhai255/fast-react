import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { OrgTree } from '@/sdks_v2/new/computationV2ApiDocs';
import { changeTableColumsNoText } from '@/utils';
import { publishYear } from '@/views/Factors/utils';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (dataSource?: OrgTree[]): ISchema => {
  return {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          layout: 'vertical',
        },
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              rowGap: 10,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 3,
            },
            properties: {
              orgId: {
                type: 'string',
                title: '核算组织',
                'x-validator': [{ required: true, message: '请选择核算组织' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              year: {
                type: 'string',
                title: '核算年度',
                'x-validator': [{ required: true, message: '请选择核算年度' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  options: publishYear().map(item => {
                    return {
                      label: item,
                      value: item,
                    };
                  }),
                },
              },
              dataPeriod: {
                type: 'string',
                title: '数据收集周期',
                enum: [
                  {
                    label: '按年',
                    value: '1',
                  },
                  {
                    label: '按季度',
                    value: '2',
                  },
                  {
                    label: '按月',
                    value: '3',
                  },
                ],
                'x-validator': [
                  { required: true, message: '请选择数据收集周期' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                'x-component-props': {
                  placeholder: '请选择',
                },
              },
              allCheckedList: {
                type: 'Array',
                title: '组织范围',
                'x-decorator-props': { gridSpan: 4, strictAutoFit: true },
                'x-validator': [{ required: true, message: '请选择组织范围' }],
                'x-decorator': 'FormItem',
                'x-component': 'CustomTable',
                'x-component-props': {
                  pagination: false,
                  rowKey: 'orgName',
                  colums: changeTableColumsNoText(
                    [
                      {
                        title: '组织名称',
                        dataIndex: 'name',
                        width: '50%',
                      },
                      {
                        title: '核算模型',
                        dataIndex: 'modelName',
                        width: '50%',
                      },
                    ],
                    '-',
                  ),
                  dataSource,
                  style: { width: '100%' },
                  scroll: { x: 1200 },
                },
              },
            },
          },
        },
      },
    },
  };
};
