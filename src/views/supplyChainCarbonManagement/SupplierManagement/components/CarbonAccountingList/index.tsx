/*
 * @@description: 供应链碳管理-供应商管理-详情-企业碳核算
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 10:06:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:26:26
 */
import { ColumnsType } from 'antd/lib/table';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TableActions } from '@/components/Table/TableActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  ApplyComputationResp,
  getSupplychainApplyComputationListSupplierId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';

function EnterpriseCarbonAccountingList() {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();
  /** 表格数据 */
  const [tableData, setTableData] = useState<ApplyComputationResp[]>();

  const actionColumns: ColumnsType<ApplyComputationResp> = [
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmManagementInfoCarbonAccountingInfo,
                      [
                        PAGE_TYPE_VAR,
                        ':id',
                        ':accountingPageTypeInfo',
                        ':accountingId',
                      ],
                      [pageTypeInfo, id, PageTypeInfo.show, row?.id],
                    ),
                  );
                },
              },
            ])}
          />
        );
      },
    },
  ];

  /** 表格表头 */
  const column = [...columns(), ...actionColumns];

  useEffect(() => {
    if (id) {
      getSupplychainApplyComputationListSupplierId({
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
export default EnterpriseCarbonAccountingList;
