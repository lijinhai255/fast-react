/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-27 11:39:46
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-30 15:02:23
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
export const InputTextLength50 = 50;
export const InputTextLength100 = 100;
export const InputTextLength20 = 20;
export const InputTextLength200 = 200;
export const TextAreaMaxLength1000 = 1000;
export const TextAreaMaxLength5000 = 5000;
export const TextAreaMaxLength500 = 500;
export const NumberMain = 0;
export const NumberMax = 999999999999.999;
export const RegEmail = [
  // { required: true, message: '请输入邮编' },
  {
    pattern:
      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    message: '请输入正确邮编格式',
  },
];
export const RegPhone = (value: string) => {
  if (value && value.length < 5) {
    return '报告负责人电话格式错误';
  }
  if (value && value.length > 15) {
    return '报告负责人电话格式错误';
  }
  if (/^(0\d{2,3})-?(\d{7,8})$/.test(value)) {
    return '报告负责人电话格式错误';
  }
  return '';
};
// 校验小数点后三位
export const RegChectDoit3 = /^-?\d{0,20}(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
// 校验小数点后四位
export const RegChectDoit4 = /^-?\d{0,20}(\.\d{1,4})?$|^0(\.\d{1,4})?$/;
export const RegChectDoit10 = /^-?\d{0,20}(\.\d{1,10})?$|^0(\.\d{1,10})?$/;

/**
 * 最大值999999999999.999 最小值0 小数点后3位
 * **/
export const RegNumber = [
  { pattern: RegChectDoit3, message: '支持小数点后三位' },
  { min: 0, message: '请输入正确总减排量' },
  { max: 999999999999.999, message: '请输入正确总减排量' },
];
export const RegUnitNumber = [
  { pattern: RegChectDoit3, message: '支持小数点后三位' },
  { min: 0, message: '请输入正确单位减排量' },
  { max: 999999999999.999, message: '请输入正确单位减排量' },
];
/** *
 * 取值区间：0.0000000001-99999999999.9999999999；
 */
export const RegNumberTwo = [
  { pattern: RegChectDoit10, message: '支持小数点后10位' },
  { min: 0.0000000001, message: '请输入正确总减排量' },
  { max: 100000000000, message: '请输入正确总减排量' },
];

/**
 * 因子树枝
 */
export const RegNumberThree = [
  { pattern: RegChectDoit10, message: '支持小数点后10位' },
  { min: 0, message: '请输入正确因子数值' },
  { max: 100000000000, message: '请输入正确因子数值' },
];
export const RegNumberFive = [
  { pattern: RegChectDoit10, message: '支持小数点后10位' },
  { min: 0.0000000001, message: '请输入正确单位换算比例' },
  { max: 100000000000, message: '请输入正确单位换算比例' },
];

// 支持数字和字母
export const RegNumAndLetters = {
  pattern: /^[a-zA-Z0-9]*$/,
  message: '仅支持字母、数字',
};

export const girdStyle = {
  type: 'void',
  'x-component': 'FormGrid',
  'x-component-props': {
    rowGap: 2,
    columnGap: 24,
    maxColumns: 3,
    minColumns: 1,
  },
};
export const reg = /\.(png|jpeg|jpg|PNG|JPEG|JPG)$/;
export const maxSize = 5 * 1024 * 1024;
