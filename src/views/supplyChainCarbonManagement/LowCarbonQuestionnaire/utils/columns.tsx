/*
 * @description: 低碳问卷列表表头
 */
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableContext, TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  postSupplychainQuestionnaireDelete,
  Questionnaire,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, modalText, returnDelModalStyle } from '@/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils/index';
import { StatusValues } from '@/views/supplyChainCarbonManagement/utils';

import { RowType } from '../../utils/type';

const { Unpublished, Published, Over } = StatusValues;

export type ColumnsType = Questionnaire & {
  questionnaireStatus_name: string;
  deadline: string;
};

export const columns = ({
  refresh,
  navigate,
  drawerOpenFn,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  drawerOpenFn?: (value: boolean, row?: RowType) => void;
}): TableRenderProps<ColumnsType>['columns'] => [
  {
    title: '问卷名称',
    dataIndex: 'questionnaireName',
    fixed: 'left',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '问卷题量',
    dataIndex: 'questionNum',
  },
  {
    title: '供应商数量',
    dataIndex: 'supplierNum',
  },
  {
    title: '回收答卷（份）',
    dataIndex: 'feedbackNum',
  },
  {
    title: '状态',
    dataIndex: 'questionnaireStatus',
    render: (value, record) => {
      const status = {
        [Unpublished]: 'default',
        [Published]: 'green',
        [Over]: 'orange',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={status[value as keyof typeof status]}
          tagText={`${record?.questionnaireStatus_name}`}
        />
      );
    },
  },
  {
    title: '截止日期',
    dataIndex: 'deadline',
    width: 200,
  },
  {
    title: '更新人',
    dataIndex: 'updateByName',
    width: 100,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'questionnaireStatus',
    width: 260,
    render: (value, row) => {
      const { id, questionnaireName } = row;
      return (
        <TableActions
          menus={compact([
            checkAuth('/supplyChain/questionnaire/show', {
              label: '查看',
              key: '查看',
              onClick: async () => drawerOpenFn?.(true, row),
            }),
            checkAuth('/supplyChain/questionnaire/preview', {
              label: '预览',
              key: '预览',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmQuestionnairePreview,
                    [':id'],
                    [id],
                  ),
                );
              },
            }),
            Number(value) === Unpublished &&
              checkAuth('/supplyChain/questionnaire/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      SccmRouteMaps.sccmQuestionnaireInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.edit, id],
                    ),
                  );
                },
              }),
            checkAuth('/supplyChain/questionnaire/copy', {
              label: '复制',
              key: '复制',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  icon: '',
                  content: (
                    <span>
                      确认复制：
                      <span className={modalText}>{questionnaireName}?</span>
                    </span>
                  ),
                  ...modelFooterBtnStyle,
                  onOk: () => {
                    if (!id) return {};
                    return navigate(
                      virtualLinkTransform(
                        SccmRouteMaps.sccmQuestionnaireInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.copy, id],
                      ),
                    );
                  },
                });
              },
            }),
            Number(value) === Unpublished &&
              checkAuth('/supplyChain/questionnaire/delete', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <span>
                        确认删除该问卷：
                        <span className={modalText}>{questionnaireName}?</span>
                      </span>
                    ),
                    ...modelFooterBtnStyle,
                    ...returnDelModalStyle,
                    onOk: () => {
                      if (!id) return {};
                      return postSupplychainQuestionnaireDelete({
                        req: {
                          id,
                        },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', '提交成功');
                          refresh?.();
                        }
                      });
                    },
                  });
                },
              }),
          ])}
        />
      );
    },
  },
];
