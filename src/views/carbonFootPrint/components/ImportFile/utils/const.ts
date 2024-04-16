/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-03 18:45:07
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 09:37:49
 */

export const fileStatusMap: Map<number, { name?: string; color?: string }> =
  new Map([
    [
      0,
      {
        name: '导入成功',
        color: 'green',
      },
    ],
    [
      1,
      {
        name: '导入失败',
        color: 'red',
      },
    ],
    [
      2,
      {
        name: '导入中',
        color: 'orange',
      },
    ],
  ]);
