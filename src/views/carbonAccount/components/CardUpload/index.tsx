/*
 * @@description: 卡片图片上传
 */

import { UploadOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import { useField } from '@formily/react';
import { message, Upload, UploadProps } from 'antd';

import { baseUrl } from '@/api/request';
import { UPLOAD_FILES_URL } from '@/utils/const';
import { getToken } from '@/utils/cookie';
import { maxSize, reg } from '@/views/eca/util/type';

const CardUpload = (props: UploadProps) => {
  const filed = useField<Field>();
  return (
    <Upload
      {...props}
      fileList={filed.value}
      action={`${baseUrl}${UPLOAD_FILES_URL}`}
      listType='picture-card'
      headers={{
        Authorization: getToken(),
      }}
      onChange={({ fileList: newFileList }) => {
        // @ts-ignore
        const newArr = newFileList.map((item, index) => {
          if (item.status === 'done' && item.originFileObj) {
            if (item.response.code === 200) {
              return {
                url: item.response.data?.url,
                uid: index,
                name: item.response.data?.fileName,
              };
            }
          }
          return item;
        });
        // getIfilePath([...fileData]);
        filed.setValue([...newArr]);
        // props.onChange(newArr);
      }}
      maxCount={5}
      beforeUpload={(e: { size: number; name: string }) => {
        if (e.size > maxSize) {
          message.error(
            '支持的图片格式：JPG、JPEG、PNG、GIF，每张图片最大支持5M',
          );
          return Upload.LIST_IGNORE;
        }
        if (!reg.test(e.name)) {
          message.error(
            '支持的图片格式：JPG、JPEG、PNG、GIF，每张图片最大支持5M',
          );
          return Upload.LIST_IGNORE;
        }
        return true;
      }}
    >
      {((filed?.value?.length || 0) < (props?.maxCount as unknown as number) ||
        0) &&
      !window.location.pathname.includes('show') ? (
        <div className='customUpload'>
          <UploadOutlined style={{ fontSize: 20 }} />
          <div style={{ marginTop: 8 }}>
            <span>上传图片</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </Upload>
  );
};
export default CardUpload;
