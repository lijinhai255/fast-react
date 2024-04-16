/*
 * @@description: 导入文件历史-表头
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-06 15:15:29
 */

import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { ImportLog } from '@/sdks_v2/new/systemV2ApiDocs';
import { downloadFile } from '@/views/supplyChainCarbonManagement/components/Import/utils';

export const columns = (): TableRenderProps<ImportLog>['columns'] => [
  {
    title: '文件名称',
    dataIndex: 'fileName',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '总条数',
    dataIndex: 'totalCount',
  },
  {
    title: '导入条数',
    dataIndex: 'successCount',
  },
  {
    title: '异常条数',
    dataIndex: 'failedCount',
  },
  {
    title: '状态',
    dataIndex: 'importStatus_name',
    width: 100,
    render: (value, record) => {
      /** 0 导入中 1 已导入 -1 导入失败 */
      const status = {
        0: 'orange',
        1: 'green',
        [-1]: 'red',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={status[record?.importStatus as unknown as keyof typeof status]}
          tagText={value}
        />
      );
    },
  },
  {
    title: '操作人',
    dataIndex: 'createByName',
    width: 90,
  },
  {
    title: '导入时间',
    dataIndex: 'importTime',
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
            record.fileUrl && {
              label: '源文件',
              key: '源文件',
              onClick: async () => {
                downloadFile(record.fileUrl as string, record.fileName);
              },
            },

            record?.failedFileUrl && {
              label: '异常数据',
              key: '异常数据',
              onClick: async () => {
                downloadFile(record.failedFileUrl as string, record.fileName);
              },
            },
          ])}
        />
      );
    },
  },
];
