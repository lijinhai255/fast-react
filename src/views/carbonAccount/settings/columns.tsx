/*
 * @@description: 表头、筛选项
 */
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { Model } from '@/sdks/computation/computationV2ApiDocs';
import {
  deleteAccountsystemDeptId,
  Dept,
  getAccountsystemDeptCanDelete,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { modalText, Toast } from '@/utils';

export const columns = ({
  refresh,
  addFn,
  editFn,
}: {
  refresh: TableContext<any>['refresh'];
  addFn?: (record: Model) => void;
  editFn?: (record: Model) => void;
}): TableRenderProps['columns'] => {
  return [
    {
      title: '分组名称',
      dataIndex: 'deptName',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'updateByName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 180,
      render(id, row: Dept) {
        return (
          <TableActions
            menus={compact([
              Number(row?.level) <= 9 &&
                checkAuth('/carbonAccount/settings/add', {
                  label: '新增下级',
                  key: '新增下级',
                  onClick: async () => {
                    addFn?.(row);
                  },
                }),
              checkAuth('/carbonAccount/settings/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  editFn?.(row);
                },
              }),
              row.parentId !== 0 &&
                checkAuth('/carbonAccount/settings/del', {
                  label: '删除',
                  key: '删除',
                  onClick: async ev => {
                    ev.stopPropagation();
                    Modal.confirm({
                      title: '提示',
                      content: (
                        <span>
                          确定删除该分组：
                          <span className={modalText}>{row?.deptName}？</span>
                        </span>
                      ),
                      onOk: () => {
                        getAccountsystemDeptCanDelete({ id }).then(
                          ({ data }) => {
                            if (data.code === 200 && data.data) {
                              deleteAccountsystemDeptId({
                                id,
                              }).then(({ data }) => {
                                if (data.code === 200 && data.data) {
                                  Toast('success', '删除成功');
                                  refresh?.();
                                }
                              });
                            }
                          },
                        );
                      },
                    });

                    return null;
                  },
                }),
            ])}
          />
        );
      },
    },
  ];
};

export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {},
});
