/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 10:52:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-31 14:57:17
 */
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  Supplier,
  postSupplychainSupplierStatus,
  postSupplychainSupplierSubmit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';

import style from '../index.module.less';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<Supplier & { supplierStatus_name: string }>['columns'] => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '采购产品',
    dataIndex: '',
    render: (_, record) => {
      return (
        <span
          className={style.columnText}
          onClick={() => {
            navigate(
              virtualLinkTransform(
                SccmRouteMaps.sccmManagementPurchaseProduct,
                [':id'],
                [record?.id],
              ),
            );
          }}
        >
          采购产品管理
        </span>
      );
    },
  },
  {
    title: '供应商编码',
    dataIndex: 'supplierCode',
  },
  {
    title: '状态',
    dataIndex: 'supplierStatus',
    render: (value, record: { supplierStatus_name: string }) => {
      const status = {
        0: 'blue',
        1: 'green',
        2: 'orange',
        3: 'red',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={status[value as keyof typeof status]}
          tagText={`${record?.supplierStatus_name}`}
        />
      );
    },
  },
  {
    title: '最近申请企业碳核算时间',
    dataIndex: 'lastApplyTime',
    width: 200,
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
    dataIndex: 'supplierStatus',
    width: 260,
    render: (value, row) => {
      const { id, supplierName } = row;
      /** 启用/禁用相关 */
      /** 展示文案 */
      const text = Number(value) === 1 ? '禁用' : '启用';
      /** 接口传值 */
      const supplierStatus = Number(value) === 1 ? '2' : '1';
      // 供应商状态。0 审核中；1 启用；2 禁用；3 审核不通过,可用值:0,1,2,3
      // 查看：[0, 1, 2, 3]
      // 申请企业碳核算: [1]
      // 编辑: [1, 2, 3]
      // 启用/禁用：[1, 2]
      // 提交审核：[3]
      return (
        <TableActions
          menus={compact([
            [0, 1, 2, 3].includes(Number(value)) &&
              checkAuth('/supplyChain/supplierManagement/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmManagementInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
            Number(value) === 1 &&
              checkAuth('/supplyChain/supplierManagement/apply', {
                label: '申请企业碳核算',
                key: '申请企业碳核算',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmManagementApply,
                      [':id'],
                      [id],
                    ),
                  );
                },
              }),
            [1, 2, 3].includes(Number(value)) &&
              checkAuth('/supplyChain/supplierManagement/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmManagementInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.edit, id],
                    ),
                  );
                },
              }),
            [1, 2].includes(Number(value)) &&
              checkAuth('/supplyChain/supplierManagement/status', {
                label: text,
                key: text,
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <span>
                        确认{text}该供应商：
                        <span className={modalText}>{supplierName}?</span>
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplychainSupplierStatus({
                        req: {
                          id,
                          supplierStatus,
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', `${text}成功`);
                          refresh?.();
                        }
                      });
                    },
                  });
                },
              }),
            Number(value) === 3 &&
              checkAuth('/supplyChain/supplierManagement/edit', {
                label: '提交审核',
                key: '提交审核',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <span>
                        确认提交审核：
                        <span className={modalText}>{supplierName}?</span>
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplychainSupplierSubmit({
                        req: {
                          id,
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', '提交成功');
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
