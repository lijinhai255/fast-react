/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-27 11:39:46
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-06-21 15:46:24
 */
export const validatorMessageByComponentName = {
  Input: '请填写',
  Select: '请选择',
  'Radio.Group': '请选择',
  Cascader: '请选择',
  'DatePicker.RangePicker': '请选择',
  'Input.TextArea': '请输入',
  NumberPicker: '请输入',
};
export type TypeComponentName = keyof typeof validatorMessageByComponentName;
export interface InitFormilyProps {
  /** 表单名称/label */
  titleName: string;
  /** 引用的组件名称 */
  componentName: keyof typeof validatorMessageByComponentName;
  /** 组件的props */
  componentProps?: any;
  /** 是否必填校验 */
  required?: boolean;
  /** 是否显示label */
  noShowTitle?: boolean;
}

export interface PANELDATAProps {
  /** 标题名称 */
  title: string;
  /** 类型名称 */
  type?: string;
  /** 图标 */
  src?: string;
  /** 荣誉 */
  honor?: string;
}

export interface FileListType {
  name: string;
  url: string;
  uid: string;
  suffix: string;
  fileName?: string;
}
