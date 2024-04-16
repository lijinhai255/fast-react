import { TableRenderProps } from 'table-render/dist/src/types';

export const columns = (): TableRenderProps<any>['columns'] => [
  {
    title: '操作用户',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'realName',
    width: 120,
  },
  {
    title: '操作模块',
    dataIndex: 'moduleType_name',
    width: 200,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddr',
    width: 180,
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作日志',
    dataIndex: 'content',
  },
];
