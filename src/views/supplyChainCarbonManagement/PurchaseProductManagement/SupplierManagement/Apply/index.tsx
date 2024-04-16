/*
 * @@description: 供应链碳管理-采购产品管理-供应商管理-申请产品碳足迹
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 15:50:00
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-02 10:55:36
 */
import { useParams } from 'react-router-dom';

import ApplyProduct from '@/views/supplyChainCarbonManagement/components/ApplyProduct';
import { UseGetUnitLabel } from '@/views/supplyChainCarbonManagement/hooks/useGetUnitLabel';

import { useProductSupplierDetail } from '../../hooks/useProductSupplierDetail';
import { usePurchaseProductDetail } from '../../hooks/usePurchaseProductDetail';

function Apply() {
  const { id, supplierId } = useParams<{
    id: string;
    supplierId: string;
  }>();

  /** 采购产品管理下的供应商的详情 */
  const productSupplierInfo = useProductSupplierDetail({
    productId: id,
    supplierId,
  });

  /** 采购产品详情 */
  const purchaseProductInfo = usePurchaseProductDetail(id);
  const { productName, productUnit, productModel } = purchaseProductInfo || {};
  /** 获取核算单位翻译值 */
  const unitValue = UseGetUnitLabel(productUnit)?.unitValue;
  return (
    <ApplyProduct
      id={supplierId}
      supplierId={String(productSupplierInfo?.id)}
      productId={id}
      cathRecord={{
        supplierName: productSupplierInfo?.supplierName,
        productName,
        productModel,
        productUnit: unitValue || [],
      }}
    />
  );
}
export default Apply;
