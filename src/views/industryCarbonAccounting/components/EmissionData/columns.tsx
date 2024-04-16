import type { ProColumns } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { ReactNode } from 'react';

import { TableActions } from '@/components/Table/TableActions';
import {
  postEnterprisesystemSysFillParamDelete,
  SysBusinessParamDelReq,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils';

import { ClassifyProps, EmissionDataListType } from '../../utils/type';

export const columns = ({
  isViewMode,
  columnsData,
  selectedClassifyItem,
  onActionBtnClick,
}: {
  /** 是否为详情查看模式 */
  isViewMode: boolean;
  /** 表头数据 */
  columnsData?: any[];
  /** 选中的分类项数据 */
  selectedClassifyItem?: ClassifyProps;
  /** 操作按钮的方法 */
  onActionBtnClick?: (type: string, id?: number) => void;
}): ProColumns<EmissionDataListType>[] => {
  return compact(
    columnsData && [
      {
        title: '序号',
        dataIndex: 'allIndex',
        width: 60,
      },
      ...(columnsData || []),
      {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        width: isViewMode ? 80 : 160,
        render(
          _: ReactNode,
          row: EmissionDataListType,
          __: number,
          action: any,
        ) {
          const { id = 0 } = row;
          return (
            <TableActions
              menus={compact([
                !isViewMode && {
                  label: '编辑',
                  key: '编辑',
                  onClick: async () => {
                    onActionBtnClick?.('edit', id);
                  },
                },
                !isViewMode && {
                  label: '删除',
                  key: '删除',
                  onClick: async () => {
                    const {
                      classifyType = 0,
                      collectTime = '',
                      orgId = 0,
                    } = selectedClassifyItem || {};
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: <span>确认删除该数据?</span>,
                      ...modelFooterBtnStyle,
                      onOk: () => {
                        return postEnterprisesystemSysFillParamDelete({
                          req: {
                            classifyType,
                            collectTime,
                            id,
                            orgId,
                          } as SysBusinessParamDelReq,
                        }).then(() => {
                          action?.reload();
                        });
                      },
                    });
                  },
                },
                {
                  label: '查看',
                  key: '查看',
                  onClick: async () => {
                    onActionBtnClick?.('show', id);
                  },
                },
              ])}
            />
          );
        },
      },
    ],
  );
};
