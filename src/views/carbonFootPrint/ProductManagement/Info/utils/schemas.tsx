/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-01 19:04:29
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-04-13 18:16:53
 */
import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderFromGridSchema,
  renderEmptySchema,
} from '@/components/formily/utils';

/** 产品碳足迹-产品管理-详情-基本信息schema */
export const productInfoBasicSchema = (isAdd: boolean) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          productionName: renderFormItemSchema({
            title: '产品名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
          orgId: renderFormItemSchema({
            title: '所属组织',
            'x-component': 'Select',
            'x-component-props': {
              showSearch: true,
              optionFilterProp: 'label',
            },
            'x-disabled': !isAdd,
          }),
          productionCode: renderFormItemSchema({
            title: '产品编码',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
          }),
          basicUnit: renderFormItemSchema({
            title: '规格/型号',
            required: false,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 100,
            },
          }),
        },
      },
    },
  );

/** 产品碳足迹-产品管理-工艺描述/产品描述schema */
export const productInfoDescSchema = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema({}),
        properties: {
          technologicalMsg: renderFormItemSchema({
            title: '产品生产工艺描述',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 1000,
              style: {
                height: 100,
                alignItems: 'flex-start',
              },
            },
          }),
          empty: renderEmptySchema(),
          description: renderFormItemSchema({
            title: '产品描述',
            required: false,
            'x-decorator-props': {
              gridSpan: 2,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              placeholder: '请输入',
              maxLength: 1000,
              style: {
                height: 100,
                alignItems: 'flex-start',
              },
            },
          }),
        },
      },
    },
  );
