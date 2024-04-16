/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 16:42:19
 */
import { compact } from 'lodash-es';
import { NavigateFunction } from 'react-router-dom';
import {
  SearchProps,
  TableContext,
  TableRenderProps,
} from 'table-render/dist/src/types';

import { TableActions } from '@/components/Table/TableActions';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { OrgTree } from '@/sdks/systemV2ApiDocs';

/**  组织类型。1 集团 2 分子公司 3 部门 0 单体组织 */
export enum OrgTypes {
  '单体组织',
  '集团',
  '分子公司',
  '部门',
}

export const columns = ({
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps['columns'] => {
  const pageTo = (page: PageTypeInfo, row: OrgTree) => {
    navigate(
      virtualLinkTransform(
        RouteMaps.orgsAdd,
        [PAGE_TYPE_VAR, ':upOrgId', ':pId'],
        [page, row.code, row.pcode],
      ),
    );
  };
  return [
    {
      title: '组织名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 300,
    },
    {
      title: '组织简称',
      dataIndex: 'abbr',
    },
    {
      title: '组织类型',
      dataIndex: 'orgType_name',
    },
    {
      title: '组织编码',
      dataIndex: 'orgCode',
      // render(val, row, i) {
      //   return i === 0 ? '-' : val || '-';
      // },
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
      dataIndex: 'act',
      width: 260,
      render(_: any, row: OrgTree) {
        return (
          <TableActions
            menus={compact([
              String(row.orgType) !== String(OrgTypes['单体组织']) &&
                Number(row?.level) <= 9 &&
                checkAuth('/sys/org/add', {
                  label: '新增子组织',
                  key: '新增子组织',
                  onClick: async ev => {
                    ev.stopPropagation();
                    if (row.code) pageTo(PageTypeInfo.add, row);
                  },
                }),
              checkAuth('/sys/org/edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  if (row.code) pageTo(PageTypeInfo.edit, row);
                },
              }),
              // !([1, 4].includes(Number(row.orgType)) || row.pcode === 0) &&
              //   checkAuth('/sys/org/del', {
              //     label: '删除',
              //     key: '删除',
              //     onClick: async ev => {
              //       ev.stopPropagation();
              //       Modal.confirm({
              //         title: '提示',
              //         content: (
              //           <span>
              //             确定删除该组织：
              //             <span className={modalText}>{row?.name}？</span>
              //           </span>
              //         ),
              //         ...returnNoIconModalStyle,
              //         ...returnDelModalStyle,
              //         onOk: () => {
              //           if (row.code)
              //             postSystemOrgDelete({
              //               req: { id: row.code },
              //             }).then(({ data }) => {
              //               if (data.code === 200) {
              //                 message.success('删除成功');
              //                 refresh?.({ stay: true, tab: 1 });
              //               }
              //             });
              //         },
              //       });

              //       return null;
              //     },
              //   }),
              checkAuth('/sys/org/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  if (row.code) pageTo(PageTypeInfo.show, row);
                },
              }),
            ])}
          />
        );
      },
    },
  ];
};

export const dictSearchSchema = (): SearchProps<any>['schema'] => ({
  type: 'object',
  properties: {},
});
