/*
 * @@description:
 * @Date: 2023-01-09 19:44:27
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-21 18:26:25
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
// import {
//   POST635fbc82fb3023a78974b0d031d469b6,
//   Role,
// } from '@/sdks/systemV2ApiDocs';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ReductionScene,
  postComputationReductionSceneDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { UseOrgs } from '../../hooks';

export const columns = ({
  pageTypeInfo,
  refresh,
  navigate,
  reportId,
  chooseType,
}: {
  pageTypeInfo?: PageTypeInfo;
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  chooseScreen?: string;
  reportId?: string;
  chooseType?: string;
}): TableRenderProps<ReductionScene>['columns'] => [
  {
    title: '所属组织',
    dataIndex: 'orgName',
    fixed: 'left',
  },
  {
    title: '减排场景名称',
    dataIndex: 'sceneName',
  },
  {
    title: '总减排量',
    dataIndex: 'totalCarbonEmission',
  },
  {
    title: '单位减排量',
    dataIndex: 'unitCarbonEmission',
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
    dataIndex: 'id',
    fixed: 'right',
    render(id, record) {
      return (
        <TableActions
          menus={compact([
            window.location.pathname.indexOf(
              '/carbonAccounting/reductionScene',
            ) >= 0 &&
              checkAuth('/reductionSceneInfo/Edit', {
                label: '编辑',
                key: '编辑',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.reductionSceneInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.edit, id],
                    ),
                  );
                },
              }),

            window.location.pathname.indexOf(
              '/carbonAccounting/reductionScene',
            ) >= 0 &&
              checkAuth('/reductionSceneInfo/Del', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    content: (
                      <span>
                        确认删除该减排场景：
                        <span className='modal_text'>{record?.sceneName}</span>
                      </span>
                    ),
                    onOk: () => {
                      return postComputationReductionSceneDelete({
                        req: { id },
                      }).then(({ data }) => {
                        if (data.code === 200) {
                          Toast('success', '删除成功');
                          refresh?.();
                        }
                      });
                    },
                  });
                },
              }),

            checkAuth('/reductionSceneInfo/Show', {
              label: '查看',
              key: '查看',
              onClick: async () => {
                if (
                  window.location.pathname.indexOf(
                    '/carbonAccounting/accountingReport/',
                  ) >= 0
                ) {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.accountingReportInfoChooseScreenDetail,
                      [
                        PAGE_TYPE_VAR,
                        ':chooseType',
                        ':id',
                        ':serenPageTypeInfo',
                        ':sercenId',
                      ],
                      [
                        pageTypeInfo,
                        chooseType,
                        reportId,
                        PageTypeInfo.show,
                        record?.id,
                      ],
                    ),
                  );
                  return;
                }
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.reductionSceneInfo,
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
export const SearchSchema = (): SearchProps<any>['schema'] => {
  const orgs = UseOrgs();

  return {
    type: 'object',
    properties: {
      likeSceneName: xRenderSeachSchema({
        type: 'string',
        placeholder: '场景名称',
      }),
      orgId: xRenderSeachSchema({
        type: 'string',
        placeholder: '所属组织',
        widget: 'select',
        enum: orgs?.map(org => `${org?.id}` as string),
        enumNames: orgs?.map(org => org?.orgName as string),
        props: {
          allowClear: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
    },
  };
};
