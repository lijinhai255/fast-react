/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-07 16:19:23
 */

declare module '*.module.less' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.md';
declare module '*.svg' {
  const content: string;
  export default content;
}

interface ImportMeta {
  env: {
    REACT_APP_API_URL: string;
    REACT_APP_API_FILE_UPLOAD_URL: string;
    REACT_APP_API_FILE_UPLOAD_RANDOMNAME_URL: string;
    MODE: string;
    NODE_ENV: string;
  };
}
