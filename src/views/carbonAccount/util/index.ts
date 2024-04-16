/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-27 19:18:33
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-07-17 09:52:48
 */
import { returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

/** textArea 详情下的样式 */
export const textAreaReadPrettyStyle = (isDetail: boolean) => {
  return {
    placeholder: !isDetail ? '请输入' : '',
    bordered: !isDetail,
    style: isDetail && {
      background: '#f5f5f5',
      color: '#333',
      fontWeight: 500,
    },
  };
};

/** 弹窗底部按钮样式 */
export const modelFooterBtnStyle = {
  ...returnDelModalStyle,
  ...returnNoIconModalStyle,
  okButtonProps: {
    style: {
      background: '#0CBF9F',
      color: '#fff',
    },
  },
};

/** 最大值限制 */
export const RegCarbonAccountValue = (
  value: string | number,
  num?: number | undefined,
  hasZero?: boolean,
) => {
  const number = num || 10000000;
  if (!value && value !== 0) return '';
  const y = String(value).indexOf('.') + 1;
  const count = String(value).length - y;
  if (y > 0 && count > 4) {
    return '最多可支持4位小数';
  }
  if (hasZero && value < 0) {
    return '数值需为大于等于0的数字';
  }
  if (!hasZero && value <= 0) {
    return '数值需为大于0的数字';
  }
  if (value > number) {
    return `必须小于等于${number}`;
  }
  return '';
};
