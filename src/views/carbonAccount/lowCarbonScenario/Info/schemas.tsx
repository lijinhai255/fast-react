/*
 * @@description: 表单配置项
 */
import { TreeProps } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';

import {
  renderFormItemSchema,
  renderSchemaWithLayout,
  renderEmptySchema,
  renderFromGridSchema,
} from '@/components/formily/utils';
import { PageTypeInfo } from '@/router/utils/enums';
import { RegCarbonAccountValue } from '@/views/carbonAccount/util';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schemaInfo = (pageTypeInfo: PageTypeInfo) =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          sceneName: renderFormItemSchema({
            title: '场景名称',
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 20,
            },
          }),
          sceneCode: renderFormItemSchema({
            title: '场景编码',
            'x-disabled': pageTypeInfo !== PageTypeInfo.add,
            'x-component': 'Input',
            'x-component-props': {
              maxLength: 50,
            },
            'x-validator': [
              (val: string) => {
                if (!val) return '';
                const reg = /[^\d|a-z|A-Z]/g;
                if (reg.test(val)) return '只能输入英文和数字';
                return '';
              },
            ],
          }),
          sceneClassify: renderFormItemSchema({
            title: '分类',
            'x-component': 'Select',
            'x-component-props': {
              fieldNames: {
                label: 'dictLabel',
                value: 'dictValue',
              },
            },
          }),
          sceneType: renderFormItemSchema({
            title: '场景类型',
            'x-component': 'Radio.Group',
            'x-disabled': pageTypeInfo !== PageTypeInfo.add,
            default: 'UploadingImage',
          }),
          orderNum: renderFormItemSchema({
            title: '排序',
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              precision: 0,
            },
            'x-validator': (value: string) => RegCarbonAccountValue(value),
          }),
          empty: renderEmptySchema(),
          sceneImage: renderFormItemSchema({
            title: '场景图标',
            'x-decorator-props': {
              gridSpan: 1,
              extra: !window.location.pathname.includes('show')
                ? `支持JPG、JPEG、PNG格式,
                图片最大限制1M，建议100x100像素`
                : '',
            },
            'x-component': 'CardUpload',
            'x-component-props': {
              maxCount: 1,
            },
          }),
          sceneGraph: renderFormItemSchema({
            title: '正确图示',
            'x-decorator-props': {
              extra: !window.location.pathname.includes('show')
                ? `支持JPG、JPEG、PNG格式,
                图片最大限制1M，建议200x100像素`
                : '',
            },
            'x-component': 'CardUpload',
            'x-component-props': {
              maxCount: 1,
            },
            'x-reactions': [
              {
                dependencies: ['sceneType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] !== "SystemDocking"}}',
                  },
                },
              },
            ],
          }),
          errPath: renderFormItemSchema({
            title: '错误图示',
            'x-decorator-props': {
              extra: !window.location.pathname.includes('show')
                ? `支持JPG、JPEG、PNG格式,
                图片最大限制1M，建议200x100像素`
                : '',
            },
            'x-component': 'CardUpload',
            'x-component-props': {
              maxCount: 1,
            },
            'x-reactions': [
              {
                dependencies: ['sceneType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] !== "SystemDocking"}}',
                  },
                },
              },
            ],
          }),
          empty1: renderEmptySchema({
            'x-reactions': [
              {
                dependencies: ['sceneType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] === "SystemDocking"}}',
                  },
                },
              },
            ],
          }),
          empty2: renderEmptySchema({
            'x-reactions': [
              {
                dependencies: ['sceneType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] === "SystemDocking"}}',
                  },
                },
              },
            ],
          }),
          sceneScript: renderFormItemSchema({
            title: '场景描述',
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

export const schemaActivity = () =>
  renderSchemaWithLayout(
    {},
    {
      grid: {
        ...renderFromGridSchema(),

        properties: {
          sceneUnit: renderFormItemSchema({
            title: '活动单位',
            'x-component': 'Cascader',
          }),
          unitScore: renderFormItemSchema({
            title: '单位活动累计积分（分/活动单位）',
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              precision: 0,
            },
            'x-validator': (value: string) =>
              RegCarbonAccountValue(value, undefined, true),
          }),
          rate: renderFormItemSchema({
            title: '单位活动减碳量（gCO₂e/活动单位）',
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              precision: 3,
            },
            'x-validator': (value: string) =>
              RegCarbonAccountValue(value, undefined, true),
          }),
          periodType: renderFormItemSchema({
            title: '活动周期',
            'x-component': 'Radio.Group',
            default: 0,
            enum: [
              { label: '日', value: 0 },
              { label: '月', value: 1 },
              { label: '年', value: 2 },
            ],
          }),
          scoreType: renderFormItemSchema({
            title: '周期内多次获取数据规则',
            'x-component': 'Radio.Group',
            default: 0,
            enum: [
              { label: '多次累加', value: 0 },
              { label: '取最高值', value: 1 },
            ],
            'x-reactions': [
              {
                dependencies: ['sceneType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0] == "SystemDocking"}}',
                  },
                },
              },
            ],
          }),
          // empty: renderEmptySchema(),
          limitType: renderFormItemSchema({
            title: '限制规则',
            required: false,
            'x-component': 'Checkbox.Group',
            default: [0],
            enum: [
              { label: '积分限制', value: 1 },
              { label: '次数限制', value: 2 },
            ],
          }),
          timesMaxValue: renderFormItemSchema({
            title: '周期内最多可参与次数',
            'x-component': 'Input',
            'x-reactions': [
              {
                dependencies: ['limitType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0]?.includes(2)}}',
                  },
                },
              },
            ],
          }),
          scoreMaxValue: renderFormItemSchema({
            title: '周期内最多可获得积分',
            'x-component': 'Input',
            'x-reactions': [
              {
                dependencies: ['limitType'],
                fulfill: {
                  schema: {
                    'x-visible': '{{$deps[0]?.includes(1)}}',
                  },
                },
              },
            ],
          }),
        },
      },
    },
  );
