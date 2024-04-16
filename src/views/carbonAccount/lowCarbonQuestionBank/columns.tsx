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
import { deleteAccountsystemQuestionId } from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';

/** 题型。0 单选 1 多选 2 判断 */
const questionType = {
  0: '单选',
  1: '多选',
  2: '判断',
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
    title: '题干',
    dataIndex: 'questionTitle',
    fixed: 'left',
  },
  {
    title: '题型',
    dataIndex: 'questionType_name',
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
    width: 150,
    dataIndex: 'id',
    render(id, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/carbonAccount/lowCarbonQuestionBank/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                editFn?.(row);
              },
            }),
            checkAuth('/carbonAccount/lowCarbonQuestionBank/del', {
              label: '删除',
              key: '删除',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  icon: '',
                  content: <span>确认删除该试题？</span>,
                  onOk: () => {
                    return deleteAccountsystemQuestionId({
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
            checkAuth('/carbonAccount/lowCarbonQuestionBank/detail', {
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
  return {
    type: 'object',
    properties: {
      questionTitle: xRenderSeachSchema({
        type: 'string',
        placeholder: '题干',
      }),
      questionType: xRenderSeachSchema({
        required: false,
        type: 'string',
        placeholder: '状态',
        enum: ['0', '1', '2'],
        enumNames: [questionType[0], questionType[1], questionType[2]],
        widget: 'select',
        props: {
          allowClear: true,
        },
      }),
    },
  };
};
