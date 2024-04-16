/*
 * @@description: 供应链碳管理-供应商管理-申请企业碳核算
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 17:52:04
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-30 11:45:25
 */
import { useParams } from 'react-router-dom';

import ApplyEnterprise from '../../components/ApplyEnterprise';
import { useSupplierManagementDetail } from '../hooks/useSupplierManagementDetail';

function Apply() {
  const { id } = useParams<{
    id: string;
  }>();
  const supplierInfo = useSupplierManagementDetail(id);
  return (
    <ApplyEnterprise
      id={id}
      cathRecord={{ supplierName: supplierInfo?.supplierName }}
    />
  );
}
export default Apply;
