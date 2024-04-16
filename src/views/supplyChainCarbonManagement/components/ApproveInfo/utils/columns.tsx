import type { ColumnsType } from 'antd/es/table';

import { Tags } from '@/components/Tags';
import {
  AuditLog,
  AuditNode,
} from '@/views/supplyChainCarbonManagement/CarbonDataApproval/type';

export const processColumns = (): ColumnsType<AuditNode> => [
  {
    title: '审核阶段',
    dataIndex: 'nodeName',
  },
  {
    title: '审批配置',
    dataIndex: 'targetNames',
  },
  {
    title: '审核状态',
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
];

export const recordColumns = (): ColumnsType<AuditLog> => [
  {
    title: '审核结果',
    dataIndex: 'auditStatus_name',
    render: (value, record) => {
      const status = {
        1: 'green',
        2: 'red',
        3: 'orange',
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
    title: '审核人',
    dataIndex: 'auditByName',
  },
  {
    title: '审核备注',
    dataIndex: 'auditComment',
  },
  {
    title: '审核时间',
    dataIndex: 'auditTime',
  },
];
