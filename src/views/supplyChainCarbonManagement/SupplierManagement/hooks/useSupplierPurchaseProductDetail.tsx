/*
 * @@description: 获取供应商管理-采购产品管理详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-22 16:29:24
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:41:22
 */
import { useEffect, useState } from 'react';

import {
  Product,
  getSupplychainSupplierProductSupplierIdProductId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

export const useSupplierPurchaseProductDetail = ({
  productId,
  supplierId,
}: {
  productId?: string;
  supplierId?: string;
}) => {
  const [supplierPurchaseProductInfo, setSupplierPurchaseProductInfo] =
    useState<Product>();
  useEffect(() => {
    if (productId && supplierId) {
      getSupplychainSupplierProductSupplierIdProductId({
        productId: Number(productId),
        supplierId: Number(supplierId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setSupplierPurchaseProductInfo(data?.data);
        }
      });
    }
  }, [productId, supplierId]);
  return supplierPurchaseProductInfo;
};
