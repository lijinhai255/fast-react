/*
 * @@description: 供应链碳管理-供应商管理-采购产品管理-申请产品碳足迹
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 15:50:00
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-02 10:53:53
 */
import { useParams } from 'react-router-dom';

import ApplyProduct from '@/views/supplyChainCarbonManagement/components/ApplyProduct';

import { useSupplierManagementDetail } from '../../hooks/useSupplierManagementDetail';
import { useSupplierPurchaseProductDetail } from '../../hooks/useSupplierPurchaseProductDetail';

function Apply() {
  const { id, productId } = useParams<{
    id: string;
    productId: string;
  }>();

  /** 供应商详情 */
  const supplierManagementInfo = useSupplierManagementDetail(id);

  /** 供应商管理-采购产品管理-详情 */
  const supplierPurchaseProductInfo = useSupplierPurchaseProductDetail({
    productId,
    supplierId: id,
  });

  const { productName, productUnit, productModel } =
    supplierPurchaseProductInfo || {};

  return (
    <ApplyProduct
      id={productId}
      productId={productId}
      supplierId={id}
      cathRecord={{
        supplierName: supplierManagementInfo?.supplierName,
        productName,
        productModel,
        productUnit: productUnit ? productUnit?.split(',') : [],
      }}
    />
  );
}
export default Apply;
