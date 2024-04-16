/*
 * @@description: 图片上传
 */
import { CloudUploadOutlined } from '@ant-design/icons';
import { Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import classNames from 'classnames';
import { FC, memo } from 'react';

import { baseUrl } from '@/api/request';
import { Toast } from '@/utils';
import { UPLOAD_FILES_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { FileListType } from '@/views/carbonFootPrint/utils/types';

import style from './index.module.less';

export type Props = {
  maxCount: number;
  maxSize: number;
  fileType: string[];
  fileList: FileListType[];
  errorSizeTips?: string;
  changeImageChange?: (info: UploadChangeParam<UploadFile<any>>) => void;
};

export const PictureUpload: FC<Props & UploadProps> = memo(
  ({
    maxCount,
    maxSize,
    fileType,
    fileList,
    disabled,
    errorSizeTips,
    changeImageChange,
    ...props
  }) => {
    /** 上传图片的参数 */
    const fileProps: UploadProps = {
      ...props,
      listType: 'picture-card',
      name: 'file',
      maxCount,
      fileList,
      action: `${baseUrl}${UPLOAD_FILES_URL}`,
      headers: {
        Authorization: getToken(),
      },
      disabled,
      showUploadList: { showRemoveIcon: !disabled, showPreviewIcon: true },
      onChange: changeImageChange,
      beforeUpload: file => {
        const { name } = file;
        const typeFile = name.split('.');
        if (!fileType.includes(typeFile[typeFile.length - 1])) {
          Toast('error', `只支持${fileType.join(',')}格式文件上传`);
          return false;
        }
        if (fileList.length >= maxCount) {
          Toast('error', `文件最多上传${maxCount}个`);
          return false;
        }
        if (file.size > maxSize) {
          Toast('error', `${errorSizeTips || '文件过大'}`);
          return Upload.LIST_IGNORE;
        }
        return true;
      },
    };
    return (
      <div className={style.cardUploadWrapper}>
        <div
          className={classNames(style.uploadCardSelectBtnWrapper, {
            [style.disabledCardListItem]: fileList.length >= 5,
          })}
        >
          <Upload {...fileProps}>
            {!disabled && (
              <div>
                <p>
                  <CloudUploadOutlined className={style.uploadIcon} />
                </p>
                <p className={style.uploadText}>上传图片</p>
              </div>
            )}
          </Upload>
        </div>
      </div>
    );
  },
);
