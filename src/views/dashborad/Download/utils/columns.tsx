/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-29 18:08:38
 */

import { Button } from 'antd';
import { compact } from 'lodash-es';
import { TableRenderProps } from 'table-render/dist/src/types';

import { Tags } from '@/components/Tags';
import { checkAuth } from '@/layout/utills';
import { FileLog } from '@/sdks/systemV2ApiDocs';
import { postSystemFilelogDownloadLogSave } from '@/sdks_v2/new/systemV2ApiDocs';
import { downloadFile } from '@/views/carbonFootPrint/components/ImportFile/utils';

import { FileStatus, FileStatusTagColor } from '../const';

export const columns = (): TableRenderProps<FileLog>['columns'] =>
  compact([
    {
      // fixme change key
      title: '文件名称',
      dataIndex: 'fileName',
      // copyable: true,
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      // enum: orgs.reduce((pre, next) => {
      //   if (next.id) return { ...pre, [next.id]: next.orgName };
      //   return pre;
      // }, {} as Record<any, any>),
    },
    {
      title: '功能模块',
      dataIndex: 'bizModule_name',
    },
    {
      title: '文件状态',
      dataIndex: 'fileStatus',
      render(type: keyof typeof FileStatus) {
        return FileStatus[type] ? (
          <Tags
            kind='raduis'
            color={FileStatusTagColor[type]}
            tagText={FileStatus[type]}
          />
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作者',
      dataIndex: 'createByName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    checkAuth('/download/button', {
      title: '操作',
      dataIndex: 'fileUrl',
      render(url, row) {
        return url ? (
          <Button
            type='link'
            // download={row.fileName}
            target='_blank'
            rel='noreferrer'
            onClick={async () => {
              await postSystemFilelogDownloadLogSave({
                req: {
                  id: row?.id || 0,
                },
              }).then(({ data }) => {
                if (data?.code === 200) {
                  // window.open(`${url}`);
                  try {
                    downloadFile(url, row?.fileName);
                  } catch (error) {
                    window.open(`${url}`);
                  }
                }
              });
            }}
          >
            下载
          </Button>
        ) : (
          '-'
        );
      },
    }),
  ]);
