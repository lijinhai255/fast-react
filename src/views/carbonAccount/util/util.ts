import { DefaultOptionType } from 'antd/lib/select';

import {
  InitFormilyProps,
  TypeComponentName,
  validatorMessageByComponentName,
} from './type';

/**
 * @description: 获取校验必填的提示内容
 * @param {string} componentName 传入的组件名称
 * @param {string} titleName 字段名称
 * @return {string} 返回对应的提示内容
 */
const getValidatorMessage = (
  componentName: keyof typeof validatorMessageByComponentName,
  titleName: string,
) => {
  const keys = Object.keys(validatorMessageByComponentName);
  if (keys.includes(componentName)) {
    return validatorMessageByComponentName[componentName] + titleName;
  }
  return `无${componentName}类型的必填校验`;
};

/**
 * @description: 组底层的工具，后续拓展的工具需要在该工厂中叠加，轻易不可改动
 * @param {InitFormilyProps} props 基本传参
 */
export const initFormily = (props: InitFormilyProps) => {
  const { titleName, required, componentName, componentProps, noShowTitle } =
    props;
  const defaultProps = {
    title: noShowTitle ? false : titleName,
    required: required || false,
    'x-decorator': 'FormItem',
    'x-component': componentName,
    'x-validator': {
      required: required || false,
      message: getValidatorMessage(componentName, titleName),
    },
    'x-component-props': {
      ...componentProps,
    },
  };
  return defaultProps;
};

export const initFormilyShema = (
  titleName: string,
  componentName: TypeComponentName,
  required?: boolean,
  componentProps?: any,
  noShowTitle?: boolean,
) => {
  const setProps = {
    placeholder: titleName,
    ...componentProps,
  };
  return initFormily({
    titleName,
    componentName,
    componentProps: setProps,
    required,
    noShowTitle,
  });
};

// 遍历proxy
export const mapProxy = (obj: object) => {
  const returnObj: { [key: string]: any } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(obj)) {
    returnObj[key as string] = value as string;
  }
  return returnObj;
};
// 校验小数点后三位
export const RegChectDoit3 = /^-?\d{0,20}(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
/** **
 * 判断碳排放-排放源详情
 * **/
export const culComputation = () => {
  return window.location.pathname.indexOf('carbonMissionAccounting') >= 0;
};

/**
 *
 * *合并单元格方法*
 *data 数据源
 *field 合并的字段
 * */
export const changeDataFn = <T, K extends keyof T>(
  data: (T & { rowSpan?: number })[],
  field: K,
) => {
  // 重复项等第一项
  let count = 0;
  // 下一项
  let indexCount = 1;
  while (indexCount < data.length) {
    const item = data.slice(count, count + 1)[0];
    if (!item.rowSpan) {
      // 初始化为1
      item.rowSpan = 1;
    }
    // 第⼀个对象与后⾯的对象相⽐，有相同项就累加，并且后⾯相同项等rowSpan设置为0
    if (item[field] === data[indexCount][field]) {
      item.rowSpan++;
      data[indexCount].rowSpan = 0;
    } else {
      count = indexCount;
    }
    indexCount++;
  }
  return data;
};
//  filter数组
export const filterArr = (arr: DefaultOptionType[], value: string) => {
  return arr?.filter(item => Number(item.value) === Number(value))[0];
};

/**
 * 表格 --- 如果返回值为空则设置文本表格显示对应传递过来的newText
 * @param val 当前返回的替换内容
 * @param newText 显示替换的文本内容
 */
export const noValueBackText = (
  val: string | number,
  newText: string,
): string => {
  if (val || val === 0) {
    return `${val}`;
  }
  return newText || '-';
};
