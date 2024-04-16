/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 10:52:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-31 15:00:02
 */
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  Product,
  postSupplychainProductDelete,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';

import style from '../../SupplierManagement/index.module.less';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<Product>['columns'] => [
  {
    title: '产品名称',
    dataIndex: 'productName',
    ellipsis: true,
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '供应商',
    dataIndex: '',
    render: (_, record) => {
      return (
        <span
          className={style.columnText}
          onClick={() => {
            navigate(
              virtualLinkTransform(
                SccmRouteMaps.sccmProdctSupplierManagement,
                [':id'],
                [record?.id],
              ),
            );
          }}
        >
          供应商管理
        </span>
      );
    },
  },
  {
    title: '规格/型号',
    dataIndex: 'productModel',
  },
  {
    title: '核算单位',
    dataIndex: 'productUnit',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
    width: 100,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    render: (_, row) => {
      const { id, productName } = row;
      return (
        <TableActions
          menus={compact([
            checkAuth('/supplyChain/productManagement/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmProdctInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
            checkAuth('/supplyChain/productManagement/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmProdctInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),
            checkAuth('/supplyChain/productManagement/delete', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  icon: '',
                  content: (
                    <span>
                      确认删除该采购产品：
                      <span className={modalText}>{productName}?</span>
                    </span>
                  ),
                  ...modelFooterBtnStyle,
                  onOk: () => {
                    if (!id) return {};
                    return postSupplychainProductDelete({
                      req: {
                        id,
                      },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', '删除成功');
                        refresh?.();
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
