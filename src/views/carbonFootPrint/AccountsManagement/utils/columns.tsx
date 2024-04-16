/*
 * @@description: 碳足迹核算-列表-表头文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-27 14:17:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 14:04:49
 */
import { Modal, Tooltip } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { IconFont } from '@/components/IconFont';
import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { ProductionBusiness } from '@/sdks/footprintV2ApiDocs';
import { deleteFootprintProductionBusiness } from '@/sdks_v2/new/footprintV2ApiDocs';
import { Toast, modalText } from '@/utils';

import { modelFooterBtnStyle } from '../../utils';
import style from '../index.module.less';

/** 碳足迹核算-列表-表头 */
export const accountsColumns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<ProductionBusiness>['columns'] => [
  {
    title: '功能单位',
    dataIndex: 'functionalUnit',
    fixed: 'left',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '产品名称',
    dataIndex: 'productionName',
  },
  {
    title: '核算数量',
    dataIndex: 'checkCount',
    render: (value, record) => `${value}${record.checkUnit}`,
  },
  {
    title: '排放量（kgCO₂e）',
    dataIndex: 'discharge',
  },
  {
    title: (
      <>
        <span className={style.accountColumnsTips}>单位产品排放量</span>
        <Tooltip
          placement='top'
          title='kgCO₂e/数量单位；单位产品排放量=排放量/核算数量'
        >
          <IconFont icon='icon-icon-bangzhuzhongxin' />
        </Tooltip>
      </>
    ),
    dataIndex: 'dischargeRate',
  },
  {
    title: '核算周期',
    dataIndex: '',
    render: (_, record) => {
      return `${record.beginDate} 至 ${record.endTime}`;
    },
    width: 220,
  },
  {
    title: '产品编码',
    dataIndex: 'productionCode',
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'type',
    fixed: 'right',
    width: 230,
    render: (_, row) => {
      const { id, functionalUnit } = row;
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonFootPrint/accounts/model', {
              label: '核算模型',
              key: '核算模型',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintAccountsModel,
                    [':modelId'],
                    [id],
                  ),
                );
              },
            }),
            checkAuth('/carbonFootPrint/accounts/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintAccountsInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, id],
                  ),
                );
              },
            }),
            checkAuth('/carbonFootPrint/accounts/del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  icon: '',
                  content: (
                    <span>
                      确认删除该核算：
                      <span className={modalText}>{functionalUnit}?</span>
                    </span>
                  ),
                  ...modelFooterBtnStyle,
                  onOk: () => {
                    return deleteFootprintProductionBusiness({
                      id,
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        if (data.data) {
                          Toast('success', '删除成功');
                          refresh?.();
                        } else {
                          Toast('error', '该核算已创建碳足迹报告，不能删除');
                        }
                      }
                    });
                  },
                });
              },
            }),
            checkAuth('/carbonFootPrint/accounts/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintAccountsDetail,
                    [':modelId'],
                    [id],
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
