/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 10:52:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-13 17:07:52
 */
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import { TableRenderProps } from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { Tags } from '@/components/Tags';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import { ApplyInfo } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = ({
  navigate,
}: {
  navigate: NavigateFunction;
}): TableRenderProps<ApplyInfo>['columns'] => [
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    fixed: 'left',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '数据类型',
    dataIndex: 'dataType_name',
  },
  {
    title: '温室气体排放数据',
    dataIndex: 'gasData',
  },
  {
    title: '状态',
    dataIndex: 'applyStatus_name',
    render: (value, record) => {
      /** 0 未填报 1 填报中 2 待审核 3 审核通过 4 审核不通过 */
      const status = {
        0: 'default',
        1: 'blue',
        2: 'orange',
        3: 'green',
        4: 'red',
      };
      return (
        <Tags
          className='customTag'
          kind='raduis'
          color={status[record?.applyStatus as unknown as keyof typeof status]}
          tagText={value}
        />
      );
    },
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    render: (_, row) => {
      const { id } = row;
      return (
        <TableActions
          menus={compact([
            checkAuth('/supplyChain/supplierCarbonData/detail', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                navigate(
                  virtualLinkTransform(
                    SccmRouteMaps.sccmCarbonDataInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [PageTypeInfo.show, id],
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
