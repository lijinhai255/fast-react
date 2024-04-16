import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { Toast, modalText, modelFooterBtnStyle } from '@/utils';

import { postModelCopy, postModelDelete } from './service';
import { Model } from './type';

const { edit, show } = PageTypeInfo;

export const columns = ({
  refresh,
  navigate,
}: {
  refresh: TableContext<any>['refresh'];
  navigate: NavigateFunction;
}): TableRenderProps<Model>['columns'] => {
  return [
    {
      title: '模型名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '功能单位',
      dataIndex: 'functionalUnit',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '基准流',
      dataIndex: 'baselineFlowCount',
      render: (value, record) => {
        const { baselineFlowUnitName } = record || {};
        return value && baselineFlowUnitName
          ? `${value}${baselineFlowUnitName}`
          : '-';
      },
    },
    {
      title: '碳足迹（kgCO₂e）',
      dataIndex: 'emission',
    },
    {
      title: '生产周期',
      dataIndex: 'productionCycle',
      width: 200,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '产品编码',
      dataIndex: 'productCode',
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
      dataIndex: 'action',
      fixed: 'right',
      width: 200,
      render(_, row) {
        const { id, functionalUnit } = row || {};
        return (
          <TableActions
            menus={compact([
              checkAuth('/carbonFootprintLCA/model/edit', {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  navigate({
                    pathname: LCARouteMaps.lcaModelInfo.replace(
                      ':pageTypeInfo',
                      `${edit}`,
                    ),
                    search: `id=${id}`,
                  });
                },
              }),
              checkAuth('/carbonFootprintLCA/model/copy', {
                label: '复制',
                key: '复制',
                onClick: async () => {
                  if (id) {
                    await postModelCopy({ id });
                    Toast('success', '复制成功');
                    refresh?.();
                  }
                },
              }),
              checkAuth('/carbonFootprintLCA/model/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该核算：
                        <span className={modalText}>{functionalUnit}?</span>
                      </>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      if (id) {
                        await postModelDelete({
                          id,
                        });
                        Toast('success', '删除成功');
                        refresh?.();
                      }
                    },
                  });
                },
              }),
              checkAuth('/carbonFootprintLCA/model/detail', {
                label: '查看',
                key: '查看',
                onClick: () => {
                  navigate({
                    pathname: LCARouteMaps.lcaModelInfo.replace(
                      ':pageTypeInfo',
                      `${show}`,
                    ),
                    search: `id=${id}`,
                  });
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
