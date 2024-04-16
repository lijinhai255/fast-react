/*
 * @@description: 供应链碳管理-供应商管理-采购产品管理-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-22 09:39:14
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 16:00:23
 */
import {
  Cascader,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { InputNumber } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  Product,
  getSupplychainSupplierProductSupplierIdProductId,
  postSupplychainSupplierProductAdd,
  postSupplychainSupplierProductEdit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { TextArea } from '@/views/eca/component/TextArea';
import CommonHeader from '@/views/supplyChainCarbonManagement/components/CommonHeader';

import style from './index.module.less';
import { infoSchema } from './utils/schemas';
import { useSupplierManagementDetail } from '../../hooks/useSupplierManagementDetail';

function PurchaseProductInfo() {
  const { id, productPageTypeInfo, productId } = useParams<{
    productPageTypeInfo: PageTypeInfo;
    id: string;
    productId: string;
  }>();
  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      TextArea,
      Cascader,
      NumberPicker,
      InputNumber,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 是否为详情页面 */
  const isDetail = productPageTypeInfo === PageTypeInfo.show;

  /** 是否为新增页面 */
  const isAdd = productPageTypeInfo === PageTypeInfo.add;

  /** 核算数量单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 供应商详情 */
  const supplyManagementInfo = useSupplierManagementDetail(id);
  const { supplierName, orgName, supplierCode } = supplyManagementInfo || {};

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [productPageTypeInfo],
  );

  /** 获取供应商下的采购产品详情 */
  useEffect(() => {
    if (!isAdd && productId && id && accountsUnitsList) {
      getSupplychainSupplierProductSupplierIdProductId({
        productId: Number(productId),
        supplierId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;
          const { productUnit = '' } = result || {};

          /** 核算单位 */
          const productUnitBack = productUnit.split(',');

          form.setValues({
            ...result,
            productUnit: productUnitBack,
          });
        }
      });
    }
  }, [productPageTypeInfo, productId, id, accountsUnitsList]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 核算单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('.productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [accountsUnitsList]);

  return (
    <main className={style.purchaseProductInfoWrapper}>
      <div className={style.purchaseProductInfoHeader}>
        <CommonHeader
          basicInfo={{
            供应商名称: supplierName,
            所属组织: orgName,
            供应商编码: supplierCode,
          }}
        />
      </div>
      <div className={style.purchaseProductInfoContent}>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={infoSchema()} />
        </Form>
      </div>
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit((values: Product) => {
                const result = {
                  ...values,
                  productUnit: String(values.productUnit),
                  supplierId: Number(id),
                };
                if (isAdd) {
                  return postSupplychainSupplierProductAdd({
                    req: result,
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '保存成功');
                      history.back();
                    }
                  });
                }
                return postSupplychainSupplierProductEdit({
                  req: result,
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
    </main>
  );
}
export default PurchaseProductInfo;
