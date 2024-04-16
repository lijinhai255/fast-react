/*
 * @@description: 供应链碳管理-供应商管理-详情-审核记录
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 10:06:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:26:14
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  getSupplychainSupplierAuditListSupplierId,
  SupplierAuditLogDto,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';

function ApprovalRecord() {
  const { id } = useParams<{
    id: string;
  }>();

  /** 表格数据 */
  const [tableData, setTableData] = useState<SupplierAuditLogDto[]>();

  /** 表格表头 */
  const column = [...columns()];

  useEffect(() => {
    if (id) {
      getSupplychainSupplierAuditListSupplierId({
        supplierId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setTableData(data.data);
        }
      });
    }
  }, [id]);

  return <TableList columns={column} dataSource={tableData} />;
}
export default ApprovalRecord;
