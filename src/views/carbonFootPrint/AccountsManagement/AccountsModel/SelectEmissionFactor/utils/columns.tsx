/*
 * @@description: 碳足迹核算-核算模型-排放源-选择排放因子表头文件
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 22:25:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 11:55:50
 */

import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Factor } from '@/sdks/systemV2ApiDocs';

/** 碳足迹核算-核算模型详情-选择排放因子-表头 */
export const selectEmissionFactorColumns = ({
  navigate,
}: {
  navigate: NavigateFunction;
}): TableRenderProps<Factor>['columns'] => [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '因子数值',
    dataIndex: 'factorValue',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    ellipsis: true,
  },
  {
    title: '发布年份',
    dataIndex: 'year',
  },
  {
    title: '发布机构',
    dataIndex: 'institution',
    ellipsis: true,
  },
  {
    title: '适应场景',
    dataIndex: 'description',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: (_, row) => {
      const { id } = row;
      return (
        <TableActions
          menus={compact([
            {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    RouteMaps.factorInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
                  ),
                );
              },
            },
          ])}
        />
      );
    },
  },
];
