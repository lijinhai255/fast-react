/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-13 11:50:03
 */
import type { ColumnsType } from 'antd/es/table';

import { Tags } from '@/components/Tags';
import { AuditLog } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<AuditLog> => [
  {
    title: '反馈结果',
    dataIndex: 'auditStatus_name',
    render: (value, record) => {
      const status = {
        0: 'orange',
        1: 'green',
        2: 'red',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={status[record?.auditStatus as unknown as keyof typeof status]}
          tagText={value}
        />
      );
    },
  },
  {
    title: '反馈人',
    dataIndex: 'auditByName',
  },
  {
    title: '联系方式',
    dataIndex: 'auditByMobile',
  },
  {
    title: '反馈意见',
    dataIndex: 'auditComment',
  },
  {
    title: '反馈时间',
    dataIndex: 'auditTime',
  },
];
