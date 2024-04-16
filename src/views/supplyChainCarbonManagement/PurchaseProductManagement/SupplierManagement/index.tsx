/*
 * @@description: 供应链碳管理-采购产品管理-供应商管理
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-23 19:20:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-24 19:03:35
 */
import { useNavigate, useParams } from 'react-router-dom';

import { checkAuth } from '@/layout/utills';
import { virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';

import ManagementPage from '../../components/ManagementPage';
import { UseGetUnitLabel } from '../../hooks/useGetUnitLabel';
import SupplierList from '../components/SupplierList';
import { usePurchaseProductDetail } from '../hooks/usePurchaseProductDetail';

function SupplierManagement() {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();

  /** 采购产品详情 */
  const purchaseProductInfo = usePurchaseProductDetail(id);
  const { productName, orgName, orgId, productUnit } =
    purchaseProductInfo || {};

  /** 获取核算单位翻译值 */
  const unitLabel = UseGetUnitLabel(productUnit)?.unitLabel;

  return (
    <ManagementPage
      basicInfo={{
        产品名称: productName,
        所属组织: orgName,
        核算单位: unitLabel,
      }}
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            SccmRouteMaps.sccmProdctSupplierManagementSelect,
            [':id', ':orgId'],
            [id, orgId],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/supplyChain/productManagement/supplier/select',
        <div>选择</div>,
      )}
    >
      <SupplierList hasAction />
    </ManagementPage>
  );
}
export default SupplierManagement;
