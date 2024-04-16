/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-20 22:18:19
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 09:37:52
 */

import { saveAs } from 'file-saver';

import { Toast } from '@/utils';

/** 下载文件 */
export const downloadFile = (url: string, name?: string) => {
  Toast('success', '开始下载...');
  saveAs(url, name);
};
