/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-23 17:34:48
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-19 09:30:33
 */
import { Tag } from 'antd';

export const textColor = {
  0: 'orange',
  1: 'cyan',
  2: 'green',
  3: 'blue',
};
export const fillDataColor = {
  0: 'blue',
  2: 'cyan',
  3: 'gold',
  4: 'orange',
  5: 'green',
  6: 'green',
  7: 'red',
};

export const auditDataColor = {
  0: 'blue',
  1: 'green',
  2: 'red',
  3: 'gold',
};
export const CustomTag = ({ text, color }: { text: string; color: string }) => {
  return (
    <Tag className={`customTag customTag-${color}`} color={color}>
      {text}
    </Tag>
  );
};
