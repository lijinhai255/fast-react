import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
} from '@/components/formily/utils';

import { RegAccountValue } from '../../utils/index';
import style from '../index.module.less';

import 'moment/locale/zh-cn';

/** 碳足迹核算-详情-基本信息schema */
export const accountsManageInfoBasicSchema = (isAdd: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({
          'x-component-props': {
            maxColumns: 3,
            minColumns: 1,
            columnGap: 25,
          },
        }),
        properties: {
          orgId: renderFormItemSchema({
            title: '所属组织',
            type: 'number',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
            'x-disabled': !isAdd,
          }),
          productionId: renderFormItemSchema({
            title: '核算产品',
            type: 'number',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
          }),
          checkContent: {
            type: 'void',
            title: '核算数量',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
            ],
            properties: {
              checkCount: renderFormItemSchema({
                validateTitle: '核算数量',
                type: 'number',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '请输入',
                },
                'x-validator': (value: string) => RegAccountValue(value),
              }),
              checkUnit: renderFormItemSchema({
                validateTitle: '核算单位',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择单位',
                  showSearch: true,
                },
              }),
            },
          },
          functionalUnit: renderFormItemSchema({
            title: '功能单位',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),

          '[beginDate, endTime]': renderFormItemSchema({
            title: '核算周期',
            'x-component': 'DatePicker.RangePicker',
            'x-component-props': {
              placeholder: ['开始日期', '结束日期'],
              placement: 'bottomLeft',
              getPopupContainer: (el: HTMLElement) => {
                return el;
              },
              className: style.datePicker,
            },
          }),
        },
      },
    },
  );

/** 碳足迹核算-详情-系统边界schema */
export const accountsManageInfoBasicRadioSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),
        properties: {
          systemBoundary: {
            type: 'void',
            title: '系统边界',
            'x-decorator': 'FormItem',
            'x-component': 'FormGrid',
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    'x-decorator-props': {
                      asterisk: `{{!$form.readPretty}}`,
                    },
                  },
                },
              },
            ],
            properties: {
              type: renderFormItemSchema({
                type: 'number',
                'x-component': 'FormilyRadioButton',
                'x-component-props': {
                  normalRadioStyle: {
                    minWidth: '572px',
                  },
                },
                enum: [
                  {
                    label: (
                      <>
                        <p className={style.accountsManageInfoBasicRadioLabel}>
                          半生命周期
                        </p>
                        <p className={style.accountsManageInfoBasicRadioTips}>
                          从资源开采到产品出厂：原材料获取、生产制造、分销和储存
                        </p>
                      </>
                    ),
                    value: 1,
                    icon: 'icon-icon-shijian1',
                  },
                  {
                    label: (
                      <>
                        <p className={style.accountsManageInfoBasicRadioLabel}>
                          全生命周期
                        </p>
                        <p className={style.accountsManageInfoBasicRadioTips}>
                          从资源开采到产品废弃：原材料获取、生产制造、分销和储存、产品使用、废弃处置
                        </p>
                      </>
                    ),
                    value: 2,
                    icon: 'icon-icon-shijian1',
                  },
                ],
                default: 1,
              }),
            },
          },
        },
      },
    },
  );
