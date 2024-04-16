/*
 * @@description: 碳足迹核算-核算模型-表头文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 22:17:42
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-16 19:06:16
 */
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ProcessModel,
  ProductionMaterials,
  deleteFootprintProductionMaterials,
} from '@/sdks/footprintV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils';

import EmissionAmount from '../EmissionAmount';

/** 碳足迹核算-核算模型-列表-表头 */
export const accountsModelTableColumns = ({
  updateEmissionAmount,
  refresh,
  navigate,
  currentTab,
  isDetail,
}: {
  updateEmissionAmount: (data: ProductionMaterials) => void;
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  currentTab: ProcessModel;
  isDetail: boolean;
}): TableRenderProps<ProductionMaterials>['columns'] => [
  {
    title: '名称',
    dataIndex: 'materialName',
    width: 120,
    fixed: 'left',
  },
  {
    title: '数量',
    dataIndex: 'weight',
    width: 280,
    render: (_, item) => (
      <EmissionAmount
        item={item}
        updateEmissionAmount={updateEmissionAmount}
        disabled={isDetail}
      />
    ),
  },
  {
    title: '类型',
    dataIndex: 'materialsType',
  },
  {
    title: '排放因子',
    dataIndex: 'factorValue',
    render: (value, record) =>
      value && record.factorUnit && `${value} ${record.factorUnit}`,
  },
  {
    title: '排放量(kgCO₂e)',
    dataIndex: 'discharge',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: isDetail ? 80 : 160,
    fixed: 'right',
    render: (_, row) => {
      const { id, productionBusinessId, processModelId, materialName } = row;
      return (
        <TableActions
          menus={compact([
            !isDetail && {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintAccountsModelInfo,
                    [':modelId', PAGE_TYPE_VAR, ':id', ':stage', ':stageName'],
                    [
                      productionBusinessId,
                      PageTypeInfo.edit,
                      id,
                      processModelId,
                      currentTab.modelName,
                    ],
                  ),
                );
              },
            },
            !isDetail && {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  icon: '',
                  content: (
                    <span>
                      确认删除该排放源：
                      <span className={modalText}>{materialName}?</span>
                    </span>
                  ),
                  ...modelFooterBtnStyle,
                  onOk: () => {
                    return deleteFootprintProductionMaterials({
                      id,
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast('success', '删除成功');
                        refresh?.(undefined, {
                          processModelId,
                          productionBusinessId,
                        });
                      }
                    });
                  },
                });
              },
            },
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.carbonFootPrintAccountsModelInfo,
                    [':modelId', PAGE_TYPE_VAR, ':id', ':stage', ':stageName'],
                    [
                      productionBusinessId,
                      PageTypeInfo.show,
                      id,
                      processModelId,
                      currentTab.modelName,
                    ],
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
