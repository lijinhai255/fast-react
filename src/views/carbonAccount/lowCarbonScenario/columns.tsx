/*
 * @@description: 表头、筛选项
 */

import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { xRenderSeachSchema } from '@/components/x-render/TableRender/utils/xRender';
import { checkAuth } from '@/layout/utills';
import { Model } from '@/sdks/computation/computationV2ApiDocs';
import {
  deleteAccountsystemSceneId,
  getAccountsystemSceneUpdateStatusId,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

/** 用户状态。0 启用 1 禁用 */
const userStatus = {
  0: '启用',
  1: '禁用',
};
export const columns = ({
  refresh,
  editFn,
  showFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  editFn?: (record: Model) => void;
  showFn?: (record: Model) => void;
}): TableRenderProps<any>['columns'] => [
  {
    title: '场景名称',
    dataIndex: 'sceneName',
    fixed: 'left',
  },
  {
    title: '场景编码',
    dataIndex: 'sceneCode',
  },
  {
    title: '分类',
    dataIndex: 'sceneClassify_name',
  },
  {
    title: '场景类型',
    dataIndex: 'sceneType_name',
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
  },
  {
    title: '状态',
    dataIndex: 'sceneStatus_name',
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
    width: 200,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonAccount/lowCarbonScenario/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                editFn?.(row);
              },
            }),
            checkAuth('/carbonAccount/lowCarbonScenario/status', {
              label: Number(row.sceneStatus) !== 0 ? '启用' : '禁用',
              key: '启用',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  content: (
                    <span>
                      确定要{Number(row.sceneStatus) !== 0 ? '启用' : '禁用'}
                      该场景：
                      <span className={modalText}>{row.sceneName}</span>
                    </span>
                  ),
                  onOk: () => {
                    return getAccountsystemSceneUpdateStatusId({ id }).then(
                      ({ data }) => {
                        if (data.code === 200) {
                          Toast(
                            'success',
                            `${
                              Number(row.sceneStatus) !== 0 ? '启用' : '禁用'
                            }成功`,
                          );
                          refresh?.();
                        }
                      },
                    );
                  },
                });
              },
            }),
            row.builtIn !== 0 &&
              checkAuth('/carbonAccount/lowCarbonScenario/del', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <span>
                        确认删除该场景：
                        <span className={modalText}>{row.sceneName}?</span>
                      </span>
                    ),
                    onOk: () => {
                      return deleteAccountsystemSceneId({
                        id,
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          if (data.data) {
                            Toast('success', '删除成功');
                            refresh?.();
                          }
                        }
                      });
                    },
                  });
                },
              }),
            checkAuth('/carbonAccount/lowCarbonScenario/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                showFn?.(row);
              },
            }),
          ])}
        />
      );
    },
  },
];
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const accountSceneClassify = useAllEnumsBatch('accountSceneClassify');

  return {
    type: 'object',
    properties: {
      sceneName: xRenderSeachSchema({
        type: 'string',
        placeholder: '场景名称',
      }),
      sceneCode: xRenderSeachSchema({
        type: 'string',
        placeholder: '场景编码',
      }),
      sceneClassify: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '分类',
        widget: 'select',
        enum: accountSceneClassify?.accountSceneClassify?.map(
          item => `${item?.dictValue}` as string,
        ),
        enumNames: accountSceneClassify?.accountSceneClassify?.map(
          item => item?.dictLabel as string,
        ),
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      sceneStatus: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '状态',
        enum: ['0', '1'],
        enumNames: [userStatus[0], userStatus[1]],
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
