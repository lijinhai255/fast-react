/*
 * @@description: 供应链碳管理-供应商管理-采购产品管理
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 18:15:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-24 19:01:33
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';

import ManagementPage from '../../components/ManagementPage';
import ProductList from '../components/ProductList';
import { useSupplierManagementDetail } from '../hooks/useSupplierManagementDetail';

function PurchaseProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();

  /** 供应商详情 */
  const supplyManagementInfo = useSupplierManagementDetail(id);
  const { supplierName, orgName, orgId, supplierCode } =
    supplyManagementInfo || {};

  return (
    <ManagementPage
      basicInfo={{
        供应商名称: supplierName,
        所属组织: orgName,
        供应商编码: supplierCode,
      }}
      onBtnClick={() => {
        navigate(
          virtualLinkTransform(
            SccmRouteMaps.sccmManagementPurchaseProductInfo,
            [':id', ':productPageTypeInfo', ':productId'],
            [id, PageTypeInfo.add, 'null'],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/supplyChain/supplierManagement/product/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
      rightRender={[
        checkAuth(
          '/supplyChain/supplierManagement/product/select',
          <Button
            type='default'
            onClick={() => {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmManagementPurchaseProductSelect,
                  [':id', ':orgId'],
                  [id, orgId],
                ),
              );
            }}
          >
            选择
          </Button>,
        ),
      ]}
    >
      <ProductList hasAction />
    </ManagementPage>
  );
}
export default PurchaseProduct;
