/*
 * @@description: 表头、筛选项
 */

import { compact } from 'lodash-es';
import { SearchProps, TableRenderProps } from 'table-render/dist/src/types';

import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';

import { UseGroup } from '../hooks';

export const columns = (
  title: string,
  type: string,
): TableRenderProps<any>['columns'] =>
  compact([
    {
      title: '名次',
      dataIndex: 'rankNum',
    },
    title.includes('个人') && {
      title: '姓名',
      dataIndex: 'realName',
    },
    title.includes('个人') && {
      title: '手机号',
      dataIndex: 'mobileMask',
    },
    title.includes('积分') && {
      title: '累计积分',
      dataIndex: type.includes('日榜') ? 'dayScore' : 'totalScore',
    },
    title.includes('减排') && {
      title: '累计减排量（g）',
      dataIndex: type.includes('日榜') ? 'dayReduction' : 'totalReduction',
    },
    {
      title: title.includes('个人') ? '所属分组' : '分组',
      dataIndex: 'deptName',
    },
    title.includes('个人') && {
      title: '用户ID',
      dataIndex: 'userNumber',
    },
  ]);
export const SearchSchema = (title: string): SearchProps<any>['schema'] => {
  const depOption = UseGroup();
  return title.includes('个人')
    ? {
        type: 'object',
        properties: {
          userInfo: xRenderSeachSchema({
            type: 'string',
            placeholder: '用户信息',
          }),
          deptId: xRenderSeachSchema({
            required: false,
            type: 'string',
            placeholder: '所属分组',
            widget: 'select',
            enum: depOption?.map(item => `${item?.value}` as string),
            enumNames: depOption?.map(item => item?.label as string),
            props: {
              allowClear: true,
              showSearch: true,
              filterOption: (input: string, option: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            },
          }),
          userNumber: xRenderSeachSchema({
            type: 'string',
            placeholder: '用户ID',
          }),
        },
      }
    : {
        type: 'object',
        properties: {
          deptId: xRenderSeachSchema({
            required: false,
            type: 'string',
            placeholder: '分组',
            widget: 'select',
            enum: depOption?.map(item => `${item?.value}` as string),
            enumNames: depOption?.map(item => item?.label as string),
            props: {
              allowClear: true,
              showSearch: true,
              filterOption: (input: string, option: any) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            },
          }),
        },
      };
};
