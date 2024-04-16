/*
 * @@description: 供应链碳管理-采购产品管理-详情-产品碳足迹
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 10:06:54
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:24:30
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
  getSupplychainApplyFootprintListProductId,
  ApplyFootprintResp,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';

function CarbonFootPrintList() {
  const navigate = useNavigate();
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();
  /** 表格数据 */
  const [tableData, setTableData] = useState<ApplyFootprintResp[]>();

  const actionColumns: ColumnsType<ApplyFootprintResp> = [
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
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
                      SccmRouteMaps.sccmProdctInfoCarbonFootPrintInfo,
                      [
                        PAGE_TYPE_VAR,
                        ':id',
                        ':carbonFootPrintPageTypeInfo',
                        ':carbonFootPrintId',
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
      getSupplychainApplyFootprintListProductId({
        productId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setTableData(data.data);
        }
      });
    }
  }, [id]);
  return (
    <TableList columns={column} dataSource={tableData} scroll={{ x: 1600 }} />
  );
}
export default CarbonFootPrintList;
