import { ColumnsType } from 'antd/lib/table';

type RecordType = {
  orgName: string;
  emission: number;
  proportion: string | number;
};

export const columns: ColumnsType<RecordType> = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
  },
  {
    title: '排放量（tCO₂e）',
    dataIndex: 'emission',
  },
  {
    title: '排放量占比（%）',
    dataIndex: 'proportion',
  },
];
