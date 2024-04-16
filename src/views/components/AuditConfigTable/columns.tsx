import type { ProColumns } from '@ant-design/pro-components';

import { AuditNodeDto } from './type';

export const columns = (): ProColumns<AuditNodeDto>[] => [
  {
    title: '审批流程',
    dataIndex: 'nodeName',
  },
  {
    title: '审批人',
    dataIndex: 'targetNames',
  },
];
