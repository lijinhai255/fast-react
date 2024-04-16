/*
 * @@description: 系统基础配置
 */

// 接口返回的code码
export const REPONSE_CODE = {
  /** 请求成功状态码 */
  SUCCESS_CODE: 200,
  /** 登录过期，或者未登录 */
  LOGIN_EXPIRE: 401,
  /** 登录过期，或者未登录 */
  LOGIN_EXPIRE_ONE: 600,
  /** 默认密码，需要修改 */
  CHANGE_PWD_CODE: 20001,
};

export type MenuTheme = 'dark' | 'light';

export interface Config {
  BASENAME?: string;
  layout: 'side' | 'top';

  theme: MenuTheme;

  fixedHeader: boolean;

  contentWidth: 'fluid' | 'fixed';

  colorWeak: boolean;

  title: string;

  logo?: string;
}

const AdminConfig: Config = {
  // react-router basename
  BASENAME: '',
  // 默认菜单栏位置
  layout: 'side',
  // 默认主题颜色
  theme: 'light',
  // 是否固定头部
  fixedHeader: true,
  // 固定宽度或者流式宽度
  contentWidth: 'fixed',
  // 是否开启色弱模式
  colorWeak: false,
  // 项目名称
  title: '碳应用平台',
};

export default AdminConfig;
