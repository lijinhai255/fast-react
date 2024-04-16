/*
 * @@description: 供应链碳管理-采购产品管理-供应商管理-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 14:47:13
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-31 14:39:37
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  Cascader,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact } from 'lodash-es';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  postSupplychainProductSupplierEdit,
  getSupplychainProductSupplierSupplierIdProductId,
  Supplier,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { TextArea } from '@/views/eca/component/TextArea';
import CommonHeader from '@/views/supplyChainCarbonManagement/components/CommonHeader';

import { infoSchema } from './utils/schemas';
import style from '../../../SupplierManagement/PurchaseProduct/Info/index.module.less';
import { UseGetUnitLabel } from '../../../hooks/useGetUnitLabel';
import { usePurchaseProductDetail } from '../../hooks/usePurchaseProductDetail';

function SupplierManagementInfo() {
  const { id, supplierPageTypeInfo, supplierId } = useParams<{
    id: string;
    supplierPageTypeInfo: PageTypeInfo;
    supplierId: string;
  }>();
  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      TextArea,
      Cascader,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 是否为详情页面 */
  const isDetail = supplierPageTypeInfo === PageTypeInfo.show;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [supplierPageTypeInfo],
  );

  /** 采购产品详情 */
  const purchaseProductInfo = usePurchaseProductDetail(id);
  const { productName, orgName, productUnit } = purchaseProductInfo || {};

  /** 获取核算单位翻译值 */
  const unitLabel = UseGetUnitLabel(productUnit)?.unitLabel;

  useEffect(() => {
    if (supplierId && id) {
      getSupplychainProductSupplierSupplierIdProductId({
        productId: Number(id),
        supplierId: Number(supplierId),
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;

          form.setValues({
            ...result,
          });
        }
      });
    }
  }, [supplierId, id]);

  return (
    <main className={style.purchaseProductInfoWrapper}>
      <div className={style.purchaseProductInfoHeader}>
        <CommonHeader
          basicInfo={{
            产品名称: productName,
            所属组织: orgName,
            核算单位: unitLabel,
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
              form.submit((values: Supplier) => {
                const result = {
                  ...values,
                  productId: Number(id),
                };
                return postSupplychainProductSupplierEdit({
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
export default SupplierManagementInfo;
