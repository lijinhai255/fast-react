/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-27 19:18:33
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-29 11:56:19
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
