/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-16 09:48:53
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-14 10:43:49
 */
import { ISchema } from '@formily/react';
import { TreeProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import {
  InputTextLength100,
  InputTextLength200,
  InputTextLength50,
  TextAreaMaxLength1000,
  TextAreaMaxLength500,
  TextAreaMaxLength5000,
} from '../../util/type';

export type CheckInfo<T extends TreeNodeNormal = any> = Parameters<
  NonNullable<TreeProps<T>['onCheck']>
>[1];

export const schema = (): ISchema => {
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
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              orgId: {
                type: 'string',
                title: '所属组织',
                'x-validator': [{ required: true, message: '请选择所属组织' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '').includes(input),
                  showSearch: true,
                },
              },
              version: {
                type: 'string',
                title: '版本号',
                'x-validator': [{ required: true, message: '请输入版本号' }],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              },
              planDate: {
                type: 'string',
                title: '制定（修订）时间',
                'x-validator': [
                  { required: true, message: '请选择制定（修订）时间' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'DatePicker',
                'x-component-props': {
                  locale,
                  placeholder: '制定（修订）时间',
                  disabledDate: (current: Date) => {
                    const currentDate = dayjs().format('YYYY-MM-DD');
                    return dayjs(current)?.format('YYYY-MM-DD') > currentDate;
                  },
                },
              },
              planContent: {
                type: 'string',
                title: '制定（修订）内容',
                'x-validator': [
                  { required: true, message: '请输入制定（修订）内容' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '制定（修订）内容',
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
              remark: {
                type: 'string',
                title: '备注',
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '请输入',
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const controlSchema = (): ISchema => {
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
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              serviceName: {
                type: 'string',
                title: '产品或服务名称',
                'x-validator': [
                  { required: true, message: '请输入产品或服务名称' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              },
              serviceUnit: {
                type: 'string',
                title: '产品或服务单位',
                'x-validator': [
                  { required: true, message: '请选择产品或服务单位' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择',
                  displayRender: (label: string[]) => {
                    if (!label) return '';
                    return label.slice(-1);
                  },
                  showSearch: (inputValue: string, path: DefaultOptionType[]) =>
                    path.some(
                      option =>
                        (option.label as string)
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) > -1,
                    ),
                },
              },
              serviceDesc: {
                type: 'string',
                title: '产品或服务描述',
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '产品或服务描述',
                  maxlength: TextAreaMaxLength500,
                  alignItems: 'flex-start',
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormOneSchema = (): ISchema => {
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
              maxColumns: 2,
              minColumns: 2,
            },
            properties: {
              orgId: {
                type: 'string',
                title: '所属组织',
                'x-validator': [{ required: true, message: '所属组织' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  disabled: true,
                  placeholder: '请选择',
                  style: { width: '50' },
                  showSearch: true,
                  filterOption: (input: string, option: any) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                },
              },
              version: {
                type: 'string',
                title: '版本号',
                'x-validator': [{ required: true, message: '版本号' }],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength50,
                },
              },
              planDate: {
                type: 'string',
                title: '制定（修订）时间',
                'x-validator': [
                  { required: true, message: '制定（修订）时间' },
                ],
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 2 },
                'x-component': 'DatePicker',
                'x-component-props': {
                  locale,
                  placeholder: '制定（修订）时间',
                  style: { width: '50%' },
                  disabledDate: (current: Date) => {
                    const currentDate = dayjs().format('YYYY-MM-DD');
                    return dayjs(current)?.format('YYYY-MM-DD') > currentDate;
                  },
                },
              },
              planContent: {
                type: 'string',
                title: '制定（修订）内容',
                'x-validator': [
                  { required: true, message: '制定（修订）内容' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-decorator-props': { gridSpan: 2 },

                'x-component-props': {
                  placeholder: '制定（修订）内容',
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
              remark: {
                type: 'string',
                title: '备注',
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 2 },

                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '请输入',
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength500,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormTwoSchema = (isEdit: boolean): ISchema => {
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
              maxColumns: 2,
              minColumns: 1,
            },
            properties: {
              orgName: {
                type: 'string',
                title: '组织名称',
                'x-validator': [{ required: true, message: '请选择组织名称' }],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                },
              },
              deptName: {
                type: 'string',
                title: '碳盘查负责部门',
                'x-validator': [
                  { required: true, message: '请输入碳盘查负责部门' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength100,
                },
              },
              regCodes: {
                type: 'array',
                title: '注册地址-所属地区',
                'x-validator': [
                  { required: true, message: '请选择注册地址-所属地区' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择',
                  fieldNames: {
                    value: 'code',
                    label: 'name',
                    children: 'children',
                  },
                  showSearch: (inputValue: string, path: DefaultOptionType[]) =>
                    path.some(
                      option =>
                        (option.label as string)
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) > -1,
                    ),
                },
              },
              regArea: {
                type: 'string',
                title: '注册地址-所属地区',
                'x-validator': [
                  { required: true, message: '请选择注册地址-所属地区' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              regAddress: {
                type: 'string',
                title: '注册地址-详细地址',
                'x-validator': [
                  { required: true, message: '请输入注册地址-详细地址' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  maxLength: InputTextLength200,
                },
              },
              produceArea: {
                type: 'string',
                title: '生产经营地址-所属地区',
                'x-validator': [
                  { required: true, message: '请选择生产经营地址-所属地区' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              produceCodes: {
                type: 'array',
                title: '生产经营地址-所属地区',
                'x-validator': [
                  { required: true, message: '请选择生产经营地址-所属地区' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: '请选择',
                  fieldNames: {
                    value: 'code',
                    label: 'name',
                    children: 'children',
                  },
                  showSearch: (inputValue: string, path: DefaultOptionType[]) =>
                    path.some(
                      option =>
                        (option.label as string)
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) > -1,
                    ),
                },
              },
              produceAddress: {
                type: 'string',
                title: '生产经营地址-详细地址',
                'x-validator': [
                  { required: true, message: '请输入生产经营地址-详细地址' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入',
                  style: { width: '100%' },
                  maxLength: InputTextLength200,
                },
              },
              intro: {
                type: 'string',
                title: '企业简介',
                'x-validator': [{ required: true, message: '请输入企业简介' }],
                'x-decorator': 'FormItem',
                'x-decorator-props': { gridSpan: 2 },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '请输入',
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              planeImg: {
                type: 'string',
                title: '组织平面示意图',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  extra: !window.location.pathname.includes('show')
                    ? isEdit
                      ? '支持的图片格式：JPG、JPEG、PNG、GIF，每张图片最大支持5M；'
                      : ''
                    : '',
                },
                'x-component': 'CardUpload',
                'x-component-props': {
                  maxCount: 5,
                  isEdit,
                },
              },
              planeImgDesc: {
                type: 'string',
                title: '组织平面示意图描述',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '组织平面示意图描述',
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              gasGroupImg: {
                type: 'string',
                title: '温室气体管理小组架构',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                  extra: !window.location.pathname.includes('show')
                    ? isEdit
                      ? '支持的图片格式：JPG、JPEG、PNG、GIF，每张图片最大支持5M；'
                      : ''
                    : '',
                },
                'x-component': 'CardUpload',
                'x-component-props': {
                  maxCount: 5,
                  isEdit,
                },
              },
              gasGroupDesc: {
                type: 'string',
                title: '温室气体管理小组架构描述',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '温室气体管理小组架构描述',
                  style: {
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormForeSchema = (): ISchema => {
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
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              borderMethod: {
                type: 'string',
                title: '组织边界设定方法',
                'x-validator': [
                  { required: true, message: '请选择组织边界设定方法' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  style: { width: '50%' },
                },
              },
              borderDesc: {
                type: 'string',
                title: '组织边界描述',
                'x-validator': [
                  { required: true, message: '请输入组织边界描述' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '组织边界描述',
                  style: {
                    maxWidth: 800,
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              borderChange: {
                type: 'string',
                title: '组织边界变动说明',
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '组织边界变动说明',
                  style: {
                    maxWidth: 800,
                    height: 100,
                    alignItems: 'flex-start',
                  },
                  maxLength: TextAreaMaxLength1000,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const FormSixSchema = (): ISchema => {
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
              rowGap: 1,
              columnGap: 24,
              maxColumns: 1,
              minColumns: 1,
            },
            properties: {
              dataQuality: {
                type: 'string',
                title: '数据质量管理规定',
                'x-validator': [
                  {
                    required: true,
                    message: '请输入数据质量管理规定',
                  },
                  (value: string) => {
                    if (value?.length >= TextAreaMaxLength5000) {
                      return '数据质量管理规定最多5000字符';
                    }
                    return null;
                  },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '数据内部质量控制和质量保证相关规定',
                  style: {
                    width: '100%',
                    height: '400px',
                    alignItems: 'flex-start',
                  },
                  maxLengt: TextAreaMaxLength5000,
                  // showCount: true,
                },
              },
            },
          },
        },
      },
    },
  };
};
export const ControlDetailSchema = (): ISchema => {
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
              rowGap: 1,
              columnGap: 24,
              maxColumns: 2,
              minColumns: 2,
            },
            properties: {
              ghgCategory_name: {
                type: 'string',
                title: '排放分类GHG',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '排放分类GHG',
                  disabled: true,
                },
              },
              isoCategory_name: {
                type: 'string',
                title: '排放分类ISO',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '排放分类ISO',
                  disabled: true,
                },
              },
              ghgClassify_name: {
                type: 'string',
                title: '排放类别GHG',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '排放类别GHG',
                  disabled: true,
                },
              },
              isoClassify_name: {
                type: 'string',
                title: '排放类别ISO',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '排放类别ISO',
                  disabled: true,
                },
              },
              categoryDesc: {
                type: 'string',
                title: '类别描述',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '类别描述',
                  disabled: true,
                  style: { height: '200px', alignItems: 'flex-start' },
                },
              },
              activityDesc: {
                type: 'string',
                title: '活动描述/被排除的说明',
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: '请输入活动描述/被排除的说明' },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder:
                    '活动描述/被排除的说明：包含的类别，描述活动详情；被排除的类别，说明理由。',
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              computationFlag: {
                type: 'boolean',
                title: '是否纳入碳排放核算',
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: '请选择是否纳入碳排放核算' },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  style: { width: '50%' },
                  options: [
                    {
                      label: '否',
                      value: false,
                    },
                    {
                      label: '是',
                      value: true,
                    },
                  ],
                },
                'x-reactions': {
                  target:
                    '*(collectDesc,collectDes,calculateType,calculateDesc,storageDesc)',
                  when: `{{$self.value === true}}`,
                  fulfill: {
                    state: {
                      display: 'visible',
                    },
                  },
                  otherwise: {
                    state: {
                      display: 'hidden',
                    },
                  },
                },
              },

              collectDesc: {
                type: 'string',
                title: '数据收集说明',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-validator': [
                  {
                    required: true,
                    message: '请输入数据收集说明',
                  },
                ],
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder:
                    '数据收集说明：需要收集的数据；数据来源、获取时间说明；如何进行数据质量评估；如何改善现有数据的计划；数据假设的信息及识别这些信息的改进方式；需要追踪的信息说明及长期内如何追踪等',
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              calculateType: {
                type: 'string',
                title: '计算方法',
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-validator': [{ required: true, message: '请选择计算方法' }],
                'x-component': 'Checkbox.Group',
                enum: [
                  {
                    label: '排放因子法 ',
                    value: '1',
                  },
                  {
                    label: '物料平衡法',
                    value: '2',
                  },
                ],
                'x-component-props': {
                  placeholder: '计算方法',
                },
              },
              calculateDesc: {
                type: 'string',
                title: '计算方法描述',
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: '请输入计算方法描述' },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder: '计算方法描述',
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
              storageDesc: {
                type: 'string',
                title: '数据存储说明',
                'x-decorator': 'FormItem',
                'x-validator': [
                  { required: true, message: '请输入数据存储说明' },
                ],
                'x-decorator-props': {
                  gridSpan: 2,
                },
                'x-component': 'TextArea',
                'x-component-props': {
                  placeholder:
                    '数据存储说明：数据如何存储及存储方式；数据存储的时间长度；数据备份的规定等',
                  style: { height: '200px', alignItems: 'flex-start' },
                  maxLength: TextAreaMaxLength1000,
                },
              },
            },
          },
        },
      },
    },
  };
};
