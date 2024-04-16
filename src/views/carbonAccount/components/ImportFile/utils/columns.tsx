/*
 * @@description: 导入文件历史-表头
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-07-08 09:31:26
 */

import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { FileUpload } from '@/sdks/footprintV2ApiDocs';

import { fileStatusMap } from './const';
import { downloadFile } from './index';

export const columns = (): TableRenderProps<FileUpload>['columns'] => [
  {
    title: '文件名称',
    dataIndex: 'fileName',
  },
  {
    title: '总条数',
    dataIndex: 'totalNum',
    width: 90,
  },
  {
    title: '导入条数',
    dataIndex: 'successNum',
    width: 90,
  },
  {
    title: '异常条数',
    dataIndex: 'failNum',
    width: 90,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value: number) => {
      return (
        <Tags
          kind='raduis'
          color={fileStatusMap.get(value)?.color || ''}
          tagText={fileStatusMap.get(value)?.name || '-'}
        />
      );
    },
  },
  {
    title: '操作人',
    dataIndex: 'updateByName',
    width: 90,
  },
  {
    title: '导入时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 155,
    render: (_, record) => {
      return (
        <TableActions
          menus={compact([
            record.filePath && {
              label: '源文件',
              key: '源文件',
              onClick: async () => {
                downloadFile(record.filePath as string, record.fileName);
              },
            },

            record?.failPath && {
              label: '异常数据',
              key: '异常数据',
              onClick: async () => {
                downloadFile(record.failPath as string, record.fileName);
              },
            },
          ])}
        />
      );
    },
  },
];
