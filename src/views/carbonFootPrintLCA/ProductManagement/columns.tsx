import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast, modalText, modelFooterBtnStyle } from '@/utils';

import { postProductionDelete } from './service';
import { Product } from './type';

const { edit, show } = PageTypeInfo;

export const columns = ({
  refresh,
  onActionBtnClick,
}: {
  refresh: TableContext<any>['refresh'];
  /** 操作按钮的方法 type：按钮的类型枚举值add、edit、show、copy， id：所在行的id */
  onActionBtnClick?: (type: string, id?: number) => void;
}): TableRenderProps<Product>['columns'] => {
  return [
    {
      title: '产品名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '产品编码',
      dataIndex: 'code',
    },
    {
      title: '规格/型号',
      dataIndex: 'specification',
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
      width: 160,
      render(_, row) {
        const { id = 0, name } = row || {};
        return (
          <TableActions
            menus={compact([
              checkAuth('/carbonFootprintLCA/production/edit', {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  onActionBtnClick?.(edit, id);
                },
              }),
              checkAuth('/carbonFootprintLCA/production/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  if (id) {
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: (
                        <>
                          确认删除该产品：
                          <span className={modalText}>{name}?</span>
                        </>
                      ),
                      ...modelFooterBtnStyle,
                      onOk: async () => {
                        await postProductionDelete({
                          id,
                        });
                        Toast('success', '删除成功');
                        refresh?.();
                      },
                    });
                  }
                },
              }),
              checkAuth('/carbonFootprintLCA/production/detail', {
                label: '查看',
                key: '查看',
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};
