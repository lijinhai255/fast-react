/*
 * @@description: 产品碳足迹-产品管理-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-01 18:44:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 15:06:25
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  Production,
  getFootprintProductionId,
  postFootprintProduction,
  putFootprintProduction,
} from '@/sdks/footprintV2ApiDocs';
import { Toast } from '@/utils';
import { PictureUpload } from '@/views/carbonFootPrint/components/PictureUpload';
import { FileListType } from '@/views/carbonFootPrint/utils/types';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import style from './index.module.less';
import { productInfoBasicSchema, productInfoDescSchema } from './utils/schemas';

function ProductInfo() {
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      TextArea,
    },
  });

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 上传的图片列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [pageTypeInfo],
  );

  /** 图片上传事件 */
  const changeImageChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const newArr = info.fileList.map(item => {
      if (item.status === 'done' && item.originFileObj) {
        if (item.response?.code === 200) {
          return {
            name: item.name,
            url: item.response.data.url,
          };
        }
      }
      return item;
    });
    setFileList([...newArr] as FileListType[]);
  };

  /** 产品详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getFootprintProductionId({ id }).then(({ data }) => {
        const result = data?.data;
        const { technological = '' } = result || {};
        const imgList = technological
          ? technological
              .split(',')
              .filter(v => v)
              .map(v => ({ url: v }))
          : [];
        form.setValues({
          ...result,
        });
        /** 产品生产工艺图 */
        setFileList([...imgList] as FileListType[]);
      });
    }
  }, [id, pageTypeInfo]);

  /** 设置所属组织枚举值 */
  useEffect(() => {
    /** 组织列表 */
    if (orgList) {
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
          ...item,
        })),
      });
    }
    /** 产品编码新增自动生成 */
    if (isAdd) {
      form.setFieldState('productionCode', {
        value: new Date().getTime(),
      });
    }
  }, [orgList, pageTypeInfo]);

  return (
    <div className={style.productInfoWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={productInfoBasicSchema(isAdd)} />
        <div className={style.uploadWrapper}>
          <div className={style.uploadLabel}>
            产品生产工艺图（碳足迹报告用图）:
          </div>
          {!isDetail && (
            <div className={style.tips}>
              支持JPG、JPEG、PNG、GIF格式，每张图片最大5M，最多上传5张
            </div>
          )}
          <PictureUpload
            disabled={isDetail}
            accept='.png, .PNG, .jpg, .JPG,.jpeg, .JPEG, .gif, .GIF'
            maxCount={5}
            maxSize={5 * 1024 * 1024}
            errorSizeTips='最大支持5M的图片'
            fileType={[
              'png',
              'PNG',
              'jpg',
              'JPG',
              'jpeg',
              'JPEG',
              'gif',
              'GIF',
            ]}
            fileList={fileList}
            changeImageChange={changeImageChange}
          />
        </div>
        <SchemaField schema={productInfoDescSchema()} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit((values: Production) => {
                const result = {
                  ...values,
                  technological: fileList.map(v => v.url).join(','),
                };
                if (isAdd) {
                  return postFootprintProduction({
                    production: result,
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '保存成功');
                      history.back();
                    }
                  });
                }
                return putFootprintProduction({
                  production: result,
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', '保存成功');
                    history.back();
                  }
                });
              });
            },
          },
          {
            title: isDetail ? '返回' : '取消',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default ProductInfo;
