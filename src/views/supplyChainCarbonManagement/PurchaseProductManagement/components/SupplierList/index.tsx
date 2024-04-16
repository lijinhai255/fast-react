/*
 * @@description: 供应链碳管理-采购产品管理-详情-供应商列表
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 14:32:46
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:24:48
 */
import { Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  Supplier,
  getSupplychainProductSupplierPage,
  postSupplychainProductSupplierDelete,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';

function SupplierList({ hasAction }: { hasAction: boolean }) {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 表格数据 */
  const [tableData, setTableData] = useState<Supplier[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 表格删除标志 */
  const [deleteFlag, setDeleteFlag] = useState(false);

  /** 加载loading */
  const [loading, changeLoading] = useState(false);

  /** 表格操作栏 */
  const actionColumns: ColumnsType<Supplier> = [
    {
      title: '操作',
      dataIndex: 'action',
      width: 220,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              checkAuth('/supplyChain/productManagement/supplier/apply', {
                label: '申请产品碳足迹',
                key: '申请产品碳足迹',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmProdctSupplierManagementApply,
                      [':id', ':supplierId'],
                      [id, row?.id],
                    ),
                  );
                },
              }),
              checkAuth('/supplyChain/productManagement/supplier/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmProdctSupplierManagementInfo,
                      [':id', ':supplierPageTypeInfo', ':supplierId'],
                      [id, PageTypeInfo.edit, row?.id],
                    ),
                  );
                },
              }),
              checkAuth('/supplyChain/productManagement/supplier/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <span>
                        确认删除采购产品的该供应商：
                        <span className={modalText}>{row?.supplierName}?</span>
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplychainProductSupplierDelete({
                        req: {
                          productId: Number(id),
                          supplierId: row.id,
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', '删除成功');
                          setDeleteFlag(!deleteFlag);
                        }
                      });
                    },
                  });
                },
              }),
            ])}
          />
        );
      },
    },
  ];

  /** 表格表头 */
  const column = hasAction ? [...columns(), ...actionColumns] : [...columns()];

  /** 获取采购产品管理下的供应商列表 */
  useEffect(() => {
    if (id) {
      changeLoading(true);
      getSupplychainProductSupplierPage({
        pageNum: searchParams.current,
        pageSize: searchParams.pageSize || 10,
        productId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setTableData(data?.data?.list);
          setTotal(data?.data?.total || 0);
          changeLoading(false);
        }
      });
    }
  }, [id, searchParams, deleteFlag]);

  return (
    <TableList
      loading={loading}
      scroll={{ x: hasAction ? 1400 : 0 }}
      columns={column}
      dataSource={tableData}
      total={total}
      searchParams={searchParams}
      onchange={(current: number, pageSize: number) => {
        setSearchParams({
          current,
          pageSize,
        });
      }}
    />
  );
}
export default SupplierList;
