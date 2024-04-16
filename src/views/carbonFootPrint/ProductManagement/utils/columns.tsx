/*
 * @@description: 产品碳足迹-产品管理-表头文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-02-28 16:59:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 15:07:34
 */
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Production,
  deleteFootprintProduction,
  getFootprintProductionDeleteExists,
} from '@/sdks/footprintV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<Production>['columns'] => [
  {
    title: '产品名称',
    dataIndex: 'productionName',
    ellipsis: true,
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '产品编码',
    dataIndex: 'productionCode',
  },
  {
    title: '规格/型号',
    dataIndex: 'basicUnit',
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
    width: 160,
    render: (_, row) => {
      const { id, productionName } = row;
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonFootPrint/product/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintProductInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),
            checkAuth('/carbonFootPrint/product/del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                getFootprintProductionDeleteExists({ id }).then(({ data }) => {
                  if (data.code === 200) {
                    if (!data.data) {
                      Toast('error', '该产品已进行碳足迹核算，不能删除；');
                      return;
                    }
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: (
                        <span>
                          确认删除该产品：
                          <span className={modalText}>{productionName}?</span>
                        </span>
                      ),
                      ...modelFooterBtnStyle,
                      onOk: () => {
                        return deleteFootprintProduction({
                          id,
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            Toast('success', '删除成功');
                            refresh?.();
                          }
                        });
                      },
                    });
                  }
                });
              },
            }),
            checkAuth('/carbonFootPrint/product/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintProductInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
