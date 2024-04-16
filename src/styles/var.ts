/*
 * @@description: 全局颜色变量 - 需要与 var.less 一致
 * antd theme https://ant.design/docs/react/customize-theme-cn#theme
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-07 17:22:31
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-03 11:40:35
 */
// todo usage on upto antdv5
export const Colors = {
  // fixme 目前可以强行注入这个变量，但是注入之后会导致 tooltip 箭头样式错误
  // https://github.com/ant-design/ant-design/issues/40491
  borderRadius: 4,
  colorPrimary: '#0CBF9F',
  // button 颜色
  colorLink: '#0CBF9F',
  colorLinkHover: '#0CBF9F',
  colorLinkActive: '#0CBF9F',
  colorText: '#333',
  colorTextSecondary: '#666',
  colorTextTertiary: '#999',
  colorTextQuaternary: '#b5b8bb',
  colorBgMask: 'rgba(0,0,0,.6)',
  colorBorder: '#d2d6da',
  colorTextPlaceholder: '#b5b8bb',
  colorTextDisabled: '#999',
  colorBgContainerDisabled: '#f5f5f5',
  colorInfoBgHover: '#f7f8f9',
  colorPrimaryBgHover: '#f7f8f9',
  controlItemBgActiveHover: '#f7f8f9',
  controlItemBgHover: '#f7f8f9',
};
