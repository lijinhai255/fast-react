/*
 * @@description:
 */
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import {
  DefaultYear,
  deleteEnterpriseSystemDefaultYearId,
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
}): TableRenderProps<DefaultYear>['columns'] => {
  return [
    {
      title: '核算年度',
      dataIndex: 'year',
    },
    {
      title: '核算模型',
      dataIndex: 'businessName',
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 220,
      render(_, row) {
        const { id, businessName, year } = row || {};
        return (
          <TableActions
            menus={compact([
              checkAuth('/factor/defaultValues/manage', {
                label: '缺省值管理',
                key: '缺省值管理',
                onClick: () => {
                  if (id) {
                    pageTo(
                      navigate,
                      RouteMaps.factorDefaultValuesManage,
                      PageTypeInfo.edit,
                      id,
                    );
                  }
                },
              }),
              checkAuth('/factor/defaultValues/delete', {
                label: '删除',
                key: '删除',
                onClick: () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该年度缺省值：
                        <span className={modalText}>
                          {year}，{businessName}?
                        </span>
                      </>
                    ),
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    onOk: async () => {
                      if (id) {
                        await deleteEnterpriseSystemDefaultYearId({ id });
                        refresh?.();
                        Toast('success', '删除成功');
                      }
                    },
                  });
                },
              }),
              checkAuth('/factor/defaultValues/detail', {
                label: '查看',
                key: '查看',
                onClick: () => {
                  if (row.id) {
                    pageTo(
                      navigate,
                      RouteMaps.factorDefaultValuesInfo,
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
