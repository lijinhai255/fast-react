/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-20 20:07:48
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-27 21:32:19
 */

/** 核算数量 */
export const RegAccountValue = (value: string | number) => {
  if (!value && value !== 0) return '';
  const y = String(value).indexOf('.') + 1;
  const count = String(value).length - y;
  if (y > 0 && count > 6) {
    return '最多可支持6位小数';
  }
  if (value <= 0) {
    return '数值需为大于0的数字';
  }
  if (value > 10000000000) {
    return '必须小于10000000000';
  }
  return '';
};

export const RegAccountUnitValue = (value: string | number) => {
  if (!value && value !== 0) return '';
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  if (value <= 0.0000000001 || value > 99999999999.9999999999) {
    return '取值区间：0.0000000001-99999999999.9999999999';
  }
  return '';
};

export const RegFactorValue = (value: string | number) => {
  if (!value) return '';

  const y = String(value).indexOf('.') + 1;
  const count = String(value).length - y;
  if (y > 0 && count > 10) {
    return '最多可支持10位小数';
  }
  if (value < 0) {
    return '数值不支持负数';
  }
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  if (value > 99999999.9999999999) {
    return '必须小于99999999.9999999999';
  }

  return '';
};
