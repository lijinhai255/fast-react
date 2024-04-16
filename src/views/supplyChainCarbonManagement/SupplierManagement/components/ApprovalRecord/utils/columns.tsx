/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 17:48:31
 */
import type { ColumnsType } from 'antd/es/table';

import { Tags } from '@/components/Tags';
import { SupplierAuditLogDto } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): ColumnsType<SupplierAuditLogDto> => [
  {
    title: '审核结果',
    dataIndex: 'approvalStatus_name',
    render: (value, record) => {
      const status = {
        1: 'green',
        2: 'red',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={
            status[record?.approvalStatus as unknown as keyof typeof status]
          }
          tagText={value}
        />
      );
    },
  },
  {
    title: '审核人',
    dataIndex: 'auditByName',
  },
  {
    title: '联系方式',
    dataIndex: 'auditByMobile',
  },
  {
    title: '审核意见',
    dataIndex: 'auditComment',
  },
  {
    title: '审核时间',
    dataIndex: 'auditTime',
  },
];
