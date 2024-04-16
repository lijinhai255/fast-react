import type { ProColumns } from '@ant-design/pro-components';
import { UploadFile } from 'antd';
import { compact } from 'lodash-es';

import { SupportFilesUpload } from '@/components/SupportFilesUpload';
import {
  SysBusinessSupport,
  SysSupportFile,
  postEnterprisesystemSysSupportFileBatchAdd,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { FilesData } from './FilesData';
import { FileListType } from '../../utils/type';

export const columns = ({
  isViewMode,
}: {
  /** 是否为查看模式 */
  isViewMode: boolean;
}): ProColumns<SysBusinessSupport>[] =>
  compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
    },
    {
      title: '证据数据',
      dataIndex: 'supportData',
      ellipsis: true,
    },
    {
      title: '材料描述',
      dataIndex: 'supportInfo',
      ellipsis: true,
    },
    {
      title: '是否必传',
      dataIndex: 'required_name',
      width: 80,
    },
    {
      title: '支撑材料',
      dataIndex: 'fileList',
      tooltip:
        '支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件上传，最多10个文件，每个不超过10M',
      width: 500,
      render: (_, row, __, action) => {
        return (
          <FilesData
            isViewMode={isViewMode}
            fileList={row?.fileList}
            onRemove={() => {
              action?.reload();
            }}
          />
        );
      },
    },
    !isViewMode && {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 80,
      render: (_, row, __, action) => {
        const { fileList = [], id, collectTime, orgId } = row || {};

        const newArr: SysSupportFile[] = [];
        return (
          <SupportFilesUpload<FileListType>
            buttonType='link'
            multiple
            fileList={fileList}
            onChange={async (
              uploadFileList: FileListType[],
              selectedFileList: UploadFile[],
            ) => {
              const ids = selectedFileList.map(v => v.uid);
              const newFileListBack = uploadFileList.filter(v => v.url);
              /** 过滤出上传完成的文件 */
              newFileListBack?.forEach(file => {
                if (!file.uid) {
                  return;
                }
                if (
                  ids.includes(file.uid) &&
                  ![...(newArr.map(v => v.fileId) || [])].includes(file.uid)
                ) {
                  newArr.push({
                    collectTime,
                    orgId,
                    sysSupportId: id,
                    fileId: file.uid,
                    fileUrl: file.url,
                    fileName: file.name,
                  });
                }
              });

              /** 新上传的文件个数应与选择的个数相同 */
              if (newArr.length !== selectedFileList.length) {
                return;
              }

              await postEnterprisesystemSysSupportFileBatchAdd({
                req: [...newArr, ...fileList],
              });
              action?.reload();
            }}
          />
        );
      },
    },
  ]);
