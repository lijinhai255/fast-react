/*
 * @@description: 导入
 */
import { Button, Col, Row, Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { ReactNode, useEffect, useState } from 'react';

import { baseUrl } from '@/api/request';
import { FormActions } from '@/components/FormActions';
import { IconFont } from '@/components/IconFont';
import { Toast } from '@/utils';
import { UPLOAD_FILES_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { FileListType, FileType } from '@/views/carbonFootPrint/utils/types';

import style from './index.module.less';
import { downloadFile } from './utils';

function Import({
  importTypeName,
  masterplateFile,
  importBtnLoading,
  importFlag,
  children,
  importFile,
}: {
  /** 导入类型名称 */
  importTypeName: string;
  /** 模版文件 {name: 模版文件名称，url：模版文件地址} */
  masterplateFile: FileType;
  /** 导入文件的loading */
  importBtnLoading: boolean;
  /** 导入标识 */
  importFlag: boolean;
  /** 子节点 */
  children: ReactNode;
  /** 导入的方法 */
  importFile?: (record: FileType) => void;
}) {
  /** 上传的文件列表 */
  const [fileListParams, setFileListParams] = useState<FileListType>();

  /** 上传文件的loading */
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  useEffect(() => {
    setFileListParams(undefined);
  }, [importFlag]);

  /** 文件上传 */
  const changeFileFn = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
      const { url } = info.file.response.data;
      const suffixArr = info.file.name.split('.');
      const nameArr = url.split('dct/');
      const data = {
        suffix: suffixArr[suffixArr.length - 1],
        name: nameArr[1],
        url,
        fileName: info.file.name,
      };
      setFileListParams(data as FileListType);
      setBtnLoading(false);
    }
  };

  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: false,
    accept: '.xls, .xlsx, .XLS, .XLSX',
    name: 'file',
    onChange: changeFileFn,
    action: `${baseUrl}${UPLOAD_FILES_URL}`,
    headers: {
      Authorization: getToken(),
    },
    beforeUpload: file => {
      const { name } = file;
      const typeFile = name.split('.');
      const fileType = ['xls', 'xlsx', 'XLS', 'XLSX'];
      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast('error', `只支持${fileType.join(',')}格式文件上传`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        Toast('error', `文件太大`);
        return Upload.LIST_IGNORE;
      }
      setBtnLoading(true);
      return true;
    },
  };

  return (
    <div className={style.importFilewrapper}>
      <div>
        <h4>导入{importTypeName}</h4>
        <div className={style.header}>
          <Row>
            <Col className={style.section} flex={1}>
              <p className={style.fileTips}>
                1、下载{importTypeName}导入模版，根据模版导入{importTypeName}
                信息
              </p>
              <Button
                onClick={() => {
                  downloadFile(masterplateFile.url, masterplateFile.name);
                }}
              >
                下载模版
              </Button>
            </Col>
            <Col className={style.section} flex={1}>
              <p className={style.fileTips}>
                2、上传文件，支持格式为：xls、xlsx，文件最大5M
              </p>
              {fileListParams ? (
                <div className={style.fileListBack}>
                  <div className={style.fileListBackFile}>
                    <IconFont
                      className={style.fileIcon}
                      icon='icon-icon-Excel'
                    />
                    <span>{fileListParams.fileName}</span>
                  </div>
                  <div className={style.uploadWrapper}>
                    <Upload className={style.upload} {...fileProps}>
                      <Button loading={btnLoading}>重新上传</Button>
                    </Upload>
                    <Button
                      loading={importBtnLoading}
                      onClick={() => {
                        importFile?.(fileListParams);
                      }}
                      type='primary'
                    >
                      导入
                    </Button>
                  </div>
                </div>
              ) : (
                <Upload {...fileProps}>
                  <Button loading={btnLoading}>上传文件</Button>
                </Upload>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <h4>导入历史</h4>
        {children && <div>{children}</div>}
      </div>
      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => history.back(),
          },
        ]}
      />
    </div>
  );
}
export default Import;
