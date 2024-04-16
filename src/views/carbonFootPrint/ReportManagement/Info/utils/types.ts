/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-21 00:46:40
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 09:39:06
 */
export interface DataSourceType {
  [key: string]: string;
}
export interface FactorDataProps {
  title: string;
  columns: {
    title: string;
    dataIndex: string;
    width?: number;
  }[];
  dataSource: {
    score: string;
    label: string;
    value: number;
  }[];
}
