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
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  DictEnumResp,
  Factor,
  postSystemFactorStatus,
} from '@/sdks/systemV2ApiDocs';
import { modalText, returnNoIconModalStyle, Toast } from '@/utils';

/** 状态。0 启用 1 禁用 */
export const status = {
  0: '启用',
  1: '禁用',
};

export const columns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  firstClassify?: DictEnumResp[];
  secondClassify?: DictEnumResp[];
}): TableRenderProps<Factor>['columns'] => [
  {
    title: '因子名称',
    dataIndex: 'name',
    fixed: 'left',
  },
  {
    title: '因子数值',
    dataIndex: 'factorValue',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '发布年份',
    dataIndex: 'year',
  },
  {
    title: '发布机构',
    dataIndex: 'institution',
  },
  {
    title: '适用场景',
    dataIndex: 'description',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render(val) {
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={val === 0 ? 'green' : 'red'}
          tagText={status[(val as keyof typeof status) ?? 1]}
        />
      );
    },
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
    dataIndex: 'content',
    fixed: 'right',
    width: 160,
    render(_, row) {
      return (
        <TableActions
          menus={compact([
            checkAuth('/factor/list/info/edit', {
              label: '编辑',
              key: '编辑',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.factorInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.edit, row.id],
                  ),
                );
              },
            }),
            checkAuth('/factor/list/info/status', {
              label: Number(row.status) !== 0 ? '启用' : '禁用',
              key: '禁用',
              onClick: async () => {
                Modal.confirm({
                  title: '提示',
                  ...returnNoIconModalStyle,
                  icon: '',
                  content: (
                    <span>
                      确定要{Number(row.status) !== 0 ? '启用' : '禁用'}
                      该排放因子：
                      <span className={modalText}>{row.name}？</span>
                    </span>
                  ),
                  onOk: () => {
                    return postSystemFactorStatus({
                      req: {
                        id: row.id,
                        status: Number(row.status) === 0 ? '1' : '0',
                      },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        Toast(
                          'success',
                          `${Number(row.status) !== 0 ? '启用' : '禁用'}成功`,
                        );
                        refresh?.();
                      }
                    });
                  },
                });
              },
            }),
            checkAuth('/factor/list/info', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.factorInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, row.id],
                  ),
                );
              },
            }),
          ])}
        />
      );
    },
  },
];
