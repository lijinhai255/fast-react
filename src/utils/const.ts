/*
 * @@description:全局静态值
 */
export enum constant {
  /** 路由重定向使用的key */
  'redirectURL' = 'redirectURL',
}

export const BUTTON_AUTH = 'React-ant-Admin-Auth';

/** 文件上传地址 */
export const UPLOAD_FILES_URL = import.meta.env.REACT_APP_API_FILE_UPLOAD_URL;

/** 随机文件名-文件上传地址 */
export const UPLOAD_FILES_RANDOMNAME_URL = import.meta.env
  .REACT_APP_API_FILE_UPLOAD_RANDOMNAME_URL;
