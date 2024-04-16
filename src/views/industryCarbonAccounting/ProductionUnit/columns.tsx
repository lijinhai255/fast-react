import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import {
  postEnterprisesystemSysCellDelete,
  Cell,
  getEnterprisesystemSysCellCheck,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import {
  Toast,
  modalText,
  returnDelModalStyle,
  returnNoIconModalStyle,
} from '@/utils';

import { pageTo } from '../utils/index';

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<Cell>['columns'] => {
  return [
    {
      title: '生产单元名称',
      dataIndex: 'name',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '生产单元类型',
      dataIndex: 'cellType',
    },
    {
      title: '生产单元编号',
      dataIndex: 'cellNo',
    },
    {
      title: '更新人',
      dataIndex: 'updateName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 160,
      render(_, row) {
        const { id, name } = row || {};
        return (
          <TableActions
            menus={compact([
              checkAuth('/industryCarbonAccounting/productionUnit/edit', {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  if (id) {
                    pageTo(
                      navigate,
                      ICARouteMaps.icaProductionUnitInfo,
                      PageTypeInfo.edit,
                      id,
                    );
                  }
                },
              }),
              checkAuth('/industryCarbonAccounting/productionUnit/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  /** 校验是否在碳排放核算中引用 */
                  const { data } = await getEnterprisesystemSysCellCheck({
                    id: Number(id),
                  });
                  if (data.data) {
                    Toast('error', '该生产单元被碳排放核算引用，不能删除');
                    return;
                  }
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该生产单元：
                        <span className={modalText}>{name}?</span>
                      </>
                    ),
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    onOk: async () => {
                      if (id) {
                        await postEnterprisesystemSysCellDelete({
                          req: { id },
                        });
                        refresh?.();
                        Toast('success', '删除成功');
                      }
                    },
                  });
                },
              }),
              checkAuth('/industryCarbonAccounting/productionUnit/detail', {
                label: '查看',
                key: '查看',
                onClick: () => {
                  if (row.id) {
                    pageTo(
                      navigate,
                      ICARouteMaps.icaProductionUnitInfo,
                      PageTypeInfo.show,
                      id,
                    );
                  }
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
