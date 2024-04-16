/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-09 16:11:55
 */

import { TableRenderProps } from 'table-render/dist/src/types';

import { ImportLog } from '@/sdks_v2/new/systemV2ApiDocs';

export const columns = (): TableRenderProps<ImportLog>['columns'] => [
  {
    title: '姓名',
    dataIndex: 'realName',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
];
