/*
 * @@description: 供应链碳管理-供应商管理-详情-采购产品列表
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 11:48:39
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:27:30
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
  Product,
  getSupplychainSupplierProductPage,
  postSupplychainSupplierProductDelete,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';

import { columns } from './utils/columns';

function ProductList({ hasAction }: { hasAction: boolean }) {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();

  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 表格数据 */
  const [tableData, setTableData] = useState<Product[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 表格删除标志 */
  const [deleteFlag, setDeleteFlag] = useState(false);

  /** 表格loading */
  const [loading, changeLoading] = useState(false);

  /** 表格操作栏 */
  const actionColumns: ColumnsType<Product> = [
    {
      title: '操作',
      dataIndex: 'action',
      width: 220,
      render: (_, row) => {
        return (
          <TableActions
            menus={compact([
              checkAuth('/supplyChain/supplierManagement/product/apply', {
                label: '申请产品碳足迹',
                key: '申请产品碳足迹',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmManagementPurchaseProductApply,
                      [':id', ':productId'],
                      [id, row?.id],
                    ),
                  );
                },
              }),
              checkAuth('/supplyChain/supplierManagement/product/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmManagementPurchaseProductInfo,
                      [':id', ':productPageTypeInfo', ':productId'],
                      [id, PageTypeInfo.edit, row?.id],
                    ),
                  );
                },
              }),
              checkAuth('/supplyChain/supplierManagement/product/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <span>
                        确认删除供应商的该采购产品：
                        <span className={modalText}>{row?.productName}?</span>
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplychainSupplierProductDelete({
                        req: {
                          productId: row.id,
                          supplierId: Number(id),
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

  /** 表格表头 hasAction: 是否展示表格操作栏 */
  const column = hasAction ? [...columns(), ...actionColumns] : [...columns()];

  /** 获取供应商管理下的采购产品列表 */
  useEffect(() => {
    if (id) {
      changeLoading(true);
      getSupplychainSupplierProductPage({
        pageNum: searchParams.current,
        pageSize: searchParams.pageSize || 10,
        supplierId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setTableData(data?.data?.list || []);
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
export default ProductList;
