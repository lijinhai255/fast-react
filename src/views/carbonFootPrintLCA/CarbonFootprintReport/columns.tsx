import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { modalText, modelFooterBtnStyle } from '@/utils';

import { postReportDelete } from './service';
import { Report } from './type';

const { edit, show } = PageTypeInfo;

export const columns = ({
  refresh,
  onActionBtnClick,
}: {
  refresh: TableContext<any>['refresh'];
  /** 操作按钮的方法 */
  onActionBtnClick?: (type: string, id?: number) => void;
}): TableRenderProps<Report>['columns'] => {
  return [
    {
      title: '报告名称',
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: '模型名称',
      dataIndex: 'modelName',
    },
    {
      title: '功能单位',
      dataIndex: 'functionalUnit',
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
      width: 220,
      render(_, row) {
        const { id, name } = row || {};
        return (
          <TableActions
            menus={compact([
              /** 仅展示按钮暂时不开发生成报告的功能  */
              checkAuth('/carbonFootprintLCA/report/create', {
                label: '生成报告',
                key: '生成报告',
                onClick: () => {},
              }),
              checkAuth('/carbonFootprintLCA/report/edit', {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  onActionBtnClick?.(edit, id);
                },
              }),
              checkAuth('/carbonFootprintLCA/report/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该报告：
                        <span className={modalText}>{name}?</span>
                      </>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      if (id) {
                        await postReportDelete({
                          id,
                        });
                        refresh?.();
                      }
                    },
                  });
                },
              }),
              checkAuth('/carbonFootprintLCA/report/detail', {
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
