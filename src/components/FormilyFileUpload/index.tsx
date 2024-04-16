/**
 * @description formily 文件上传
 */
import { CloudUploadOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import { useField } from '@formily/react';
import { Button, Typography, Upload } from 'antd';
import { UploadFile, UploadProps } from 'antd/lib/upload';
import classNames from 'classnames';
import { cloneDeep, isArray } from 'lodash-es';
import { useEffect, useState } from 'react';

import { baseUrl } from '@/api/request';
import { IconFont } from '@/components/IconFont';
import { Toast, getSuffix } from '@/utils';
import { UPLOAD_FILES_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';

import style from './index.module.less';
import { FileListType } from './type';

const { Text } = Typography;

const fileType =
  '.png,.PNG,.jpg,.JPG,.JPEG,.jpeg,.xls,.xlsx,.XLS,.XLSX,.doc,.DOC,.docx,.DOCX,.pdf,.PDF,.rar,.RAR,.zip,.ZIP';

const maxCount = 10;

let isPassBeforeUploadLimit = true;

export const FormilyFileUpload = ({
  value,
  onChange,
}: {
  value: FileListType[];
  onChange: (value: FileListType[]) => void;
}) => {
  const field = useField<Field>();
  const isReadPretty = field.readPretty;

  /** 文件列表 */
  const [fileListBack, setFileListBack] = useState<FileListType[]>([]);

  useEffect(() => {
    // 设置文件
    if (value && value.length > 0 && isArray(value)) {
      const arr = value.map(item => {
        const { uid, name, url, id } = item;
        return {
          uid,
          name,
          url,
          id,
        };
      });
      setFileListBack([...arr]);
    } else {
      setFileListBack([]);
    }
  }, [value]);

  /** 文件上传的方法 */
  const onImgChange: UploadProps['onChange'] = ({ fileList }) => {
    if (!isPassBeforeUploadLimit) {
      return;
    }
    const newArr = fileList.map(item => {
      const { response, name, uid } = item;
      if (response) {
        return {
          url: response.data.url,
          name,
          uid,
        };
      }
      return {
        ...item,
      };
    });
    setFileListBack([...newArr]);
    if (typeof onChange === 'function') {
      onChange([...newArr]);
    }
  };

  /** 删除文件 */
  const onRemove: UploadProps['onRemove'] = file => {
    const oldFile = cloneDeep(fileListBack).filter(res => res.uid !== file.uid);
    setFileListBack(oldFile);
    if (typeof onChange === 'function') {
      onChange(oldFile);
    }
  };

  /** 上传文件的参数 */
  const fileProps: UploadProps = {
    showUploadList: true,
    disabled: isReadPretty,
    accept: fileType,
    name: 'file',
    maxCount,
    action: `${baseUrl}${UPLOAD_FILES_URL}`,
    headers: {
      Authorization: getToken(),
    },
    onChange: onImgChange,
    onRemove,
    beforeUpload: file => {
      const typeFile = file.name.split('.');

      if (!fileType.includes(typeFile[typeFile.length - 1])) {
        Toast('error', `只支持${fileType}格式文件上传`);
        isPassBeforeUploadLimit = false;
        return false;
      }

      if (fileListBack.length >= maxCount) {
        Toast('error', `文件最多上传${maxCount}个`);
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        Toast('error', '文件大小不能超过10M');
        return Upload.LIST_IGNORE;
      }

      isPassBeforeUploadLimit = true;
      return true;
    },
  };

  return (
    <div className={style.fileUploadWrapper}>
      {!isReadPretty && (
        <div className={style.tips}>
          支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件上传，最多10个文件，每个不超过10M
        </div>
      )}
      <Upload
        {...fileProps}
        fileList={[...fileListBack] as UploadFile[]}
        // eslint-disable-next-line react/no-unstable-nested-components
        itemRender={(_, file, __, actions) => {
          const nameArr = file.name.split('.');
          const suffix = nameArr[nameArr.length - 1];
          const name = file.name?.slice(0, file.name.length - suffix.length);
          const fileItem = {
            ...file,
            suffix,
          };
          return (
            <div
              className={classNames(style.fileWrapper, {
                [style.readPrettyWrapper]: isReadPretty,
              })}
            >
              <div className={style.fileContent}>
                <a href={fileItem.url} target='_blank' rel='noreferrer'>
                  <IconFont
                    className={style.fileIcon}
                    icon={getSuffix(fileItem.suffix)}
                  />
                  <Text
                    className={style.name}
                    ellipsis={{ suffix: fileItem.suffix }}
                  >
                    {name}
                  </Text>
                </a>
              </div>
              {!isReadPretty && (
                <div
                  className={style.delBtn}
                  onClick={() => {
                    actions?.remove();
                  }}
                >
                  <IconFont
                    className={style.delIcon}
                    icon='icon-icon-shanchu'
                  />
                </div>
              )}
            </div>
          );
        }}
      >
        <Button icon={<CloudUploadOutlined />}>上传文件</Button>
      </Upload>
    </div>
  );
};
