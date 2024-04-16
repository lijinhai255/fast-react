import { NavigateFunction } from 'react-router-dom';

import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
  TypeMapRoute,
} from '@/router/utils/enums';
import { updateUrl } from '@/utils';

/** 页面跳转 */
export const pageTo = (
  navigate: NavigateFunction,
  path: TypeMapRoute,
  page: PageTypeInfo,
  id?: number,
  extraParams?: { [key: string]: string | number | undefined },
) => {
  navigate(virtualLinkTransform(path, [PAGE_TYPE_VAR], [page]));
  updateUrl({
    id,
    ...extraParams,
  });
};

/**
 * @description 数字校验
 * @value 输入框的值
 * @max 允许输入的最大值
 * @min 允许输入的最小值
 * @decimal 允许输入的小数位
 * @tips 不符合验证规则的提示
 */
export const checkValue = (
  value: number,
  max: number,
  min: number,
  decimal: number,
  title: string,
) => {
  if (!value && value !== 0) return '';
  const y = String(value).indexOf('.') + 1;
  const count = String(value).length - y;

  if (y > 0 && count > decimal) {
    return `${title}格式错误`;
  }
  if (value < min) {
    return `${title}格式错误`;
  }
  if (value > max) {
    return `${title}格式错误`;
  }
  return '';
};
