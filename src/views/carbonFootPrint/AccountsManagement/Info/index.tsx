/*
 * @@description: 产品碳足迹-碳足迹核算-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-09 11:29:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 15:05:20
 */
import {
  Cascader,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
  Space,
} from '@formily/antd';
import {
  Form as FormProps,
  createForm,
  onFieldChange,
  onFormInit,
  onFormUnmount,
} from '@formily/core';
import { createSchemaField } from '@formily/react';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ProductionBusiness,
  getFootprintProductionBusinessId,
  postFootprintProductionBusiness,
  putFootprintProductionBusiness,
} from '@/sdks/footprintV2ApiDocs';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { PictureUpload } from '@/views/carbonFootPrint/components/PictureUpload';
import { FileListType } from '@/views/carbonFootPrint/utils/types';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import style from './index.module.less';
import {
  accountsManageInfoBasicRadioSchema,
  accountsManageInfoBasicSchema,
} from './utils/schemas';
import FormilyRadioButton from '../components/FormilyRadioButton';
import { useProducts } from '../hooks/useProducts';

function AccountsInfo() {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 核算产品枚举值 */
  const productList = useProducts();

  /** 核算数量单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 上传的文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  const SchemaField = createSchemaField({
    components: {
      NumberPicker,
      Space,
      Input,
      Select,
      DatePicker,
      Radio,
      Cascader,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      FormilyRadioButton,
    },
  });

  /** 根据产品、核算数量、数量单位 生成功能单位 */
  const setFunctionalUnit = (form: FormProps<any>) => {
    /** 核算产品 */
    const productionIdItem = form.getFieldState('productionId');
    /** 核算数量  */
    const checkCountItem = form.getFieldState('checkCount');
    /** 数量单位 */
    const checkUnitItem = form.getFieldState('checkUnit');
    /** 功能单位 */
    const functionalUnitItem = form.getFieldState('functionalUnit');

    if (productionIdItem && checkCountItem && checkUnitItem) {
      if (
        !functionalUnitItem?.value &&
        checkUnitItem.value &&
        checkCountItem.value &&
        productionIdItem.value
      ) {
        // 功能单位的名称
        let functionalUnitName = '';

        if (checkCountItem.value) {
          functionalUnitName = checkCountItem.value;
        }
        if (checkUnitItem.inputValues) {
          functionalUnitName = `${functionalUnitName}${checkUnitItem.inputValues[1][1].label}`;
        }
        if (productionIdItem.inputValues) {
          functionalUnitName = `${functionalUnitName}${productionIdItem.inputValues[1].productionName}`;
        }

        form.setFieldState('functionalUnit', {
          value: functionalUnitName,
        });
      }
    }
  };

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
        effects() {
          onFormInit(async form => {
            form.addEffects('functionalUnit', form => {
              onFieldChange('checkCount', ['value'], () => {
                setFunctionalUnit(form);
              });

              onFieldChange('checkUnit', ['value'], () => {
                setFunctionalUnit(form);
              });

              onFieldChange('productionId', ['value'], () => {
                setFunctionalUnit(form);
              });
            });
          });
          onFormUnmount(form => {
            form.removeEffects('functionalUnit');
          });
        },
      }),
    [pageTypeInfo],
  );

  /** 图片上传 */
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

  /** 获取碳足迹核算详情 */
  useEffect(() => {
    if (!isAdd && id && accountsUnitsList) {
      getFootprintProductionBusinessId({ id }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;
          const { technological = '', checkUnit = '' } = result || {};

          const imgList = technological
            ? technological
                .split(',')
                .filter(v => v)
                .map(v => ({ url: v }))
            : [];
          /** 系统边界图 */
          setFileList([...imgList] as FileListType[]);

          const checkUnitItem = accountsUnitsList.factorUnitM.find(
            v => v.dictLabel === checkUnit,
          );

          /** 核算单位 */
          const checkUnitBack = checkUnitItem
            ? [checkUnitItem.sourceType, checkUnitItem.dictValue]
            : undefined;

          form.setValues({
            ...result,
            checkUnit: checkUnitBack,
          });
        }
      });
    }
  }, [id, pageTypeInfo, accountsUnitsList]);

  /** 选择框枚举 */
  useEffect(() => {
    /** 所属组织 */
    if (orgList) {
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
        })),
      });
    }

    /** 核算产品 */
    if (productList) {
      form.setFieldState('productionId', {
        dataSource: productList,
      });
    }

    /** 数量单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('.checkUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [orgList, productList, accountsUnitsList]);

  return (
    <div className={style.accountsWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.schemaMain}>
          <SchemaField schema={accountsManageInfoBasicSchema(isAdd)} />
        </section>
        <section className={style.schemaMain}>
          <SchemaField schema={accountsManageInfoBasicRadioSchema()} />
        </section>
        <div className={style.uploadWrapper}>
          <div className={style.uploadLabel}>系统边界图（碳足迹报告用图）:</div>
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
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: isAdd ? '保存，下一步' : '保存',
            type: 'primary',
            onClick: async () => {
              form.submit((values: ProductionBusiness) => {
                /** 核算数量单位 */
                const checkUnit =
                  accountsUnitsList?.factorUnitM.find(
                    item => item.dictValue === values.checkUnit[1],
                  )?.dictLabel || '';

                /** 系统边界图 */
                const technological = fileList.length
                  ? fileList.map(v => v.url).join(',')
                  : '';

                const result = {
                  ...values,
                  checkUnit,
                  technological,
                };
                if (isAdd) {
                  return postFootprintProductionBusiness({
                    productionBusiness: result,
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '保存成功');
                      navigate(
                        virtualLinkTransform(
                          RouteMaps.carbonFootPrintAccountsModel,
                          [':modelId'],
                          [data.data?.id],
                        ),
                      );
                    }
                  });
                }
                return putFootprintProductionBusiness({
                  productionBusiness: result,
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
export default AccountsInfo;
