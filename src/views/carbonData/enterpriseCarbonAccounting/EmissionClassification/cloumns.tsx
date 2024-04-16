import { ColumnsType } from 'antd/lib/table';

export const columns: ColumnsType<{ [key: string]: string }> = [
  {
    title: '排放分类',
    dataIndex: '排放分类',
    fixed: 'left',
    width: 130,
  },
  {
    title: '排放量（tCO₂e）',
    dataIndex: '排放量',
    width: 140,
  },
  { title: '排放量占比（%）', dataIndex: '排放量占比', width: 140 },
  {
    title: '基准年排放量（tCO₂e）',
    dataIndex: '基准年排放量',
    width: 140,
  },
  { title: '和上年同比（%）', dataIndex: '和上年同比', width: 140 },
  { title: '和基准年比（%）', dataIndex: '和基准年比', width: 140 },
];
