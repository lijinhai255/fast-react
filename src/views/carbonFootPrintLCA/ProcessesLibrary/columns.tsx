import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { modalText, modelFooterBtnStyle } from '@/utils';

import { postProcessLibraryDelete } from './service';
import { ProcessLibrary } from './type';

const { edit, copy, show } = PageTypeInfo;

export const columns = ({
  navigate,
  refresh,
  onActionBtnClick,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  /** 操作按钮的方法 */
  onActionBtnClick?: (type: string, id?: number) => void;
}): TableRenderProps<ProcessLibrary>['columns'] => {
  return [
    {
      title: '过程名称',
      dataIndex: 'processName',
      fixed: 'left',
    },
    /** 暂时隐藏 */
    // {
    //   title: '所属组织',
    //   dataIndex: 'orgName',
    // },
    {
      title: '产出产品',
      dataIndex: 'outputProductName',
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
        const { id, processName } = row || {};
        return (
          <TableActions
            menus={compact([
              checkAuth('/carbonFootprintLCA/processLibrary/edit', {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  navigate({
                    pathname: LCARouteMaps.lcaProcessLibraryInfo.replace(
                      ':pageTypeInfo',
                      `${edit}`,
                    ),
                    search: `id=${id}`,
                  });
                },
              }),
              checkAuth('/carbonFootprintLCA/processLibrary/copy', {
                label: '复制',
                key: '复制',
                onClick: () => {
                  onActionBtnClick?.(copy, id);
                },
              }),
              checkAuth('/carbonFootprintLCA/processLibrary/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该过程：
                        <span className={modalText}>{processName}?</span>
                      </>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      if (id) {
                        await postProcessLibraryDelete({
                          id,
                        });
                        refresh?.();
                      }
                    },
                  });
                },
              }),
              checkAuth('/carbonFootprintLCA/processLibrary/detail', {
                label: '查看',
                key: '查看',
                onClick: () => {
                  navigate({
                    pathname: LCARouteMaps.lcaProcessLibraryInfo.replace(
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
