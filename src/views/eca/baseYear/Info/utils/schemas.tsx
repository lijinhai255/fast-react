/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-16 17:59:11
 */
import { ISchema } from '@formily/react';
import { Modal, TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import { renderFormItemSchema } from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import { returnNoIconModalStyle } from '@/utils';
import { TextAreaMaxLength500 } from '@/views/eca/util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const Schema = (
  pageTypeInfo?: PageTypeInfo,
  computationList?: () => void,
  emissionStandardEdit?: number,
  update?: boolean,
): ISchema => {
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
              rowGap: 2,
              columnGap: 24,
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              orgId: renderFormItemSchema({
                title: '所属组织',
                required: true,
                type: 'string',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: pageTypeInfo !== PageTypeInfo.add,
                  style: {
                    width: '100%',
                  },
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              }),
              settingType: renderFormItemSchema({
                type: 'string',
                title: '设定类型',
                'x-decorator': 'FormItem',
                'x-component': 'Radio.Group',
                enum: [
                  {
                    label: '单一年份',
                    value: '1',
                  },
                  {
                    label: '多年平均',
                    value: '2',
                  },
                ],
                'x-component-props': {
                  placeholder: '请输入',
                },
              }),
              startYear: renderFormItemSchema({
                type: 'string',
                title: '基准年份',
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
                'x-component-props': {
                  picker: 'year',
                },
                'x-reactions': {
                  dependencies: ['settingType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='1'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              '[startYear,endYear]': renderFormItemSchema({
                type: 'string',
                title: '基准年份',
                'x-validator': (value: string[]) => {
                  if (!value[0]) {
                    return `请选择基准年份`;
                  }
                  if (Number(value[1]) - Number(value[0]) >= 10) {
                    return `选择范围不能超过十年`;
                  }
                  return '';
                },
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker.RangePicker',
                'x-component-props': {
                  placeholder: ['开始日期', '结束日期'],
                  picker: 'year',
                },
                'x-reactions': {
                  dependencies: ['settingType'],
                  fulfill: {
                    state: {
                      display: `{{$deps[0]==='2'?'visible':'hidden'}}`,
                    },
                  },
                },
              }),
              policy: renderFormItemSchema({
                type: 'string',
                title: '基准线排放量重算政策',
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 3 },
                'x-component-props': {
                  placeholder:
                    '企业应在企业机构或温室气体排放清单方法学发生重大变化时，重新计算基准年排放。报告组织的发生重大结构性变化，如兼并、收购或资产剥离；计算方法的变化，数据准确性的改进，或发现重大错误。',
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              }),
              changeDateSource: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ComButton',
                'x-display':
                  pageTypeInfo === PageTypeInfo.show ? 'none' : 'visible',
                'x-decorator-props': {
                  gridSpan: 3,
                  style: {
                    marginBottom: '10px',
                  },
                },
                'x-component-props': {
                  title: '更新数据',
                  onclickFn: () => {
                    Modal.confirm({
                      title: '提示',
                      ...returnNoIconModalStyle,
                      content: '查询的新数据将替换已有数据，确认更新数据？?',
                      okText: '确定',
                      cancelText: '取消',
                      onOk: computationList,
                    });
                  },
                },
              },
              dataList: {
                type: 'string',
                title:
                  '基准排放量（单位：tCO₂e；GHG和ISO标准至少填写其一，全部填写以GHG标准分类为准）',
                'x-decorator': 'FormItem',
                'x-component': 'ComTable',
                'x-decorator-props': { gridSpan: 3 },
                'x-validator': [{ require: true, message: '请填写基准排放量' }],
                'x-component-props': {
                  placeholder:
                    '企业应在企业机构或温室气体排放清单方法学发生重大变化时，重新计算基准年排放。报告组织的发生重大结构性变化，如兼并、收购或资产剥离；计算方法的变化，数据准确性的改进，或发现重大错误。',
                  style: {
                    height: 200,
                  },
                  emissionStandardEdit,
                  update,
                },
              },
            },
          },
        },
      },
    },
  };
};
