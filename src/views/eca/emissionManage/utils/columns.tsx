/*
 * @@description:
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
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Computation,
  EnumResp,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  postComputationComputationEmissionSourceDelete,
  postComputationEmissionSourceDelete,
  postComputationModelEmissionSourceDelete,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast, returnDelModalStyle, returnNoIconModalStyle } from '@/utils';

import { FistComputationEnums } from '../../hooks';
import { culComputation } from '../../util/util';

export type TypeComputation = Computation & {
  ghgCategory_name?: string;
  sourceName?: string;
  isoCategory_name?: string;
  id?: string;
};
const returnCommelete = (): TableRenderProps<TypeComputation>['columns'] => {
  return compact([
    {
      title: '排放源名称',
      dataIndex: 'sourceName',
      width: 160,
      fixed: 'left',
      // copyable: true,
    },
    {
      title: '排放设施/活动',
      dataIndex: 'facility',
      width: 120,
    },
    {
      title: '活动数据单位',
      dataIndex: 'activityUnitName',
      width: 120,
    },
    {
      title: '排放因子',
      dataIndex: 'factorDesc',
      width: 160,
    },
    {
      title: 'GHG分类',
      dataIndex: 'ghgClassify_name',
      width: 120,

      render: (text: string, record) => {
        return `${record?.ghgCategory_name},${text}`;
      },
    },
    {
      title: 'ISO分类',
      dataIndex: 'isoClassify_name',
      width: 120,

      render: (text: string, record) => {
        return `${record?.isoCategory_name},${text}`;
      },
    },
    {
      title: '排放源ID',
      dataIndex: 'sourceCode',
      width: 160,
    },
  ]);
};
// 排放源
export const columns = ({
  refresh,
  navigate,
  pageTypeInfo = undefined,
  modelId,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  pageTypeInfo?: PageTypeInfo;
  modelId?: string;
}): TableRenderProps<TypeComputation>['columns'] =>
  compact([
    ...returnCommelete(),
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: '更新人',
      dataIndex: 'updateByName',
      width: 160,
    },
    window.location.pathname.indexOf('chooseEmissionSource') === -1 && {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: '操作',
      width: pageTypeInfo ? 90 : 240,
      dataIndex: 'id',
      render(id, record) {
        return (
          <TableActions
            menus={compact([
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/Edit', {
                  label: '编辑',
                  key: '编辑',
                  onClick: async () => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.emissionManagInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [PageTypeInfo.edit, id],
                      ),
                    );
                  },
                }),

              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/copy', {
                  label: '复制',
                  key: '复制',
                  onClick: async () => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.emissionManagInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        ['copy', id],
                      ),
                    );
                  },
                }),
              !pageTypeInfo &&
                checkAuth('/emissionManagInfo/Del', {
                  label: `删除`,
                  key: '删除',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: (
                        <span>
                          确认删除该排放源：
                          <span className='modal_text'>
                            {record?.sourceName}?
                          </span>
                        </span>
                      ),
                      onOk: () => {
                        return postComputationEmissionSourceDelete({
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

              checkAuth('/emissionManagInfo/show', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  // 新增排放源查看
                  if (
                    window.location.pathname.indexOf(
                      '/carbonAccounting/carbonMissionAccounting/emissionSource/add/',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 碳排放核算 = 排放源管理= 查看
                  if (
                    window.location.pathname.indexOf(
                      '/carbonMissionAccounting',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfoDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 如果是核算模型-排放源管理 - 排放源详情
                  if (
                    window.location.pathname.indexOf('/accountingModel') > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 排放源-查看详情
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
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
  ]);
// 核算模型- 排放源管理 碳排放核算-排放源管理
export const meissionSourceColumns = ({
  refresh,
  navigate,
  modelId,
  nodel,
  pageTypeInfo,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  modelId?: string;
  nodel?: boolean;
  pageTypeInfo?: string;
}): TableRenderProps<TypeComputation>['columns'] => {
  return [
    ...returnCommelete(),

    {
      title: '操作',
      width: 120,
      dataIndex: 'id',
      render(id: string, record) {
        // carbonAccounting/carbonMissionAccounting/emissionSource/add/
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/role/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  // carbonAccounting/carbonMissionAccounting/emissionSource/add/43/chooseEmissionSource/0
                  if (
                    window.location.pathname.indexOf(
                      'carbonAccounting/carbonMissionAccounting/emissionSource',
                    ) >= 0
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 碳排放核算 = 详情= 查看
                  if (
                    window.location.pathname.indexOf(
                      '/carbonMissionAccounting',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfoDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 如果是核算模型-排放源管理 - 排放源详情
                  if (
                    window.location.pathname.indexOf('/accountingModel') > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }

                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
              !nodel &&
                checkAuth('/sys/role/del', {
                  label: '删除',
                  key: '删除',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: (
                        <span>
                          确认删除该排放源：
                          <span>{record?.sourceName}？</span>
                        </span>
                      ),
                      onOk: () => {
                        if (culComputation()) {
                          return postComputationComputationEmissionSourceDelete(
                            {
                              req: {
                                emissionSourceIds: id,
                                id: Number(modelId),
                              },
                            },
                          ).then(({ data }) => {
                            if (data.code === 200) {
                              Toast('success', '删除成功');
                              refresh?.();
                            }
                          });
                        }
                        return postComputationModelEmissionSourceDelete({
                          req: {
                            emissionSourceIds: id,
                            id: Number(modelId),
                          },
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
            ])}
          />
        );
      },
    },
  ];
};
// 碳排放核算- 核算详情 - 排放源列表
export const carbonMissionShowColumns = ({
  refresh,
  navigate,
  modelId,
  nodel,
  pageTypeInfo,
  leftIndex,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
  modelId?: string;
  nodel?: boolean;
  pageTypeInfo?: string;
  leftIndex?: string;
}): TableRenderProps<TypeComputation>['columns'] => {
  return [
    {
      title: '排放源名称',
      dataIndex: 'sourceName',
      width: 160,
      fixed: 'left',
      // copyable: true,
    },
    {
      title: '排放设施/活动',
      dataIndex: 'facility',
      width: 120,
    },
    {
      title: '活动数据单位',
      dataIndex: 'activityUnitName',
      width: 120,
    },
    {
      title: '活动数据',
      dataIndex: 'dataValue',
      width: 160,
      // copyable: true,
    },
    {
      title: '排放因子',
      dataIndex: 'factorDesc',
      width: 160,
    },
    {
      title: '排放量（tCO₂e）',
      dataIndex: 'carbonEmission',
      width: 160,
      // copyable: true,
    },
    {
      title: 'GHG分类',
      dataIndex: 'ghgClassify_name',
      width: 120,

      render: (text: string, record) => {
        return `${record?.ghgCategory_name},${text}`;
      },
    },
    {
      title: 'ISO分类',
      dataIndex: 'isoClassify_name',
      width: 120,

      render: (text: string, record) => {
        return `${record?.isoCategory_name},${text}`;
      },
    },
    {
      title: '排放源ID',
      dataIndex: 'sourceCode',
      width: 160,
    },

    {
      title: '操作',
      width: 120,
      dataIndex: 'id',
      render(id: string, record) {
        // carbonAccounting/carbonMissionAccounting/emissionSource/add/
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/role/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  // carbonAccounting/carbonMissionAccounting/emissionSource/add/43/chooseEmissionSource/0
                  if (
                    window.location.pathname.indexOf(
                      'carbonAccounting/carbonMissionAccounting/emissionSource',
                    ) >= 0
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfofactorDetail,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }
                  // 碳排放核算 = 详情= 查看
                  if (
                    window.location.pathname.indexOf(
                      '/carbonMissionAccounting',
                    ) > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingInfoEmissionSourceInfo,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':sourcefactorId',
                          ':id',
                          ':computationDataId',
                        ],
                        [
                          pageTypeInfo,
                          PageTypeInfo.show,
                          id,
                          modelId,
                          leftIndex,
                        ],
                      ),
                    );
                    return;
                  }
                  // 如果是核算模型-排放源管理 - 排放源详情
                  if (
                    window.location.pathname.indexOf('/accountingModel') > -1
                  ) {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSourceInfoShow,
                        [
                          PAGE_TYPE_VAR,
                          ':factorPageInfo',
                          ':SourcefactorId',
                          ':id',
                        ],
                        [pageTypeInfo, PageTypeInfo.show, id, modelId],
                      ),
                    );
                    return;
                  }

                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
              !nodel &&
                checkAuth('/sys/role/del', {
                  label: '删除',
                  key: '删除',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      ...returnNoIconModalStyle,
                      ...returnDelModalStyle,
                      content: (
                        <span>
                          确认删除该排放源：
                          <span>{record?.sourceName}？</span>
                        </span>
                      ),
                      onOk: () => {
                        if (culComputation()) {
                          return postComputationComputationEmissionSourceDelete(
                            {
                              req: {
                                emissionSourceIds: id,
                                id: Number(modelId),
                              },
                            },
                          ).then(({ data }) => {
                            if (data.code === 200) {
                              Toast('success', '删除成功');
                              refresh?.();
                            }
                          });
                        }
                        return postComputationModelEmissionSourceDelete({
                          req: {
                            emissionSourceIds: id,
                            id: Number(modelId),
                          },
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
            ])}
          />
        );
      },
    },
  ];
};

// 核算模型- 选择排放源
export const chooseMeissionSourceColumns = ({
  refresh,
  navigate,
}: {
  navigate: NavigateFunction;
  refresh: TableContext<any>['refresh'];
}): TableRenderProps<TypeComputation>['columns'] => {
  return [
    ...returnCommelete(),
    {
      title: '操作',
      width: 120,
      dataIndex: 'id',
      render(id) {
        return (
          <TableActions
            menus={compact([
              checkAuth('/sys/role/detail', {
                label: '查看',
                key: '查看',
                onClick: async () => {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.emissionManagInfo,
                      [PAGE_TYPE_VAR, ':id'],
                      [PageTypeInfo.show, id],
                    ),
                  );
                },
              }),
              checkAuth('/sys/role/del', {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    ...returnNoIconModalStyle,
                    ...returnDelModalStyle,
                    content: `确认删除该排放源：排放源名称?`,
                    onOk: () => {
                      return postComputationEmissionSourceDelete({
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
            ])}
          />
        );
      },
    },
  ];
};

/** 数据处理 */
const getTreeData = (arr: EnumResp[]) => {
  return arr.map(node => {
    const { name, code, subList } = node || {};
    if (subList && subList.length) {
      node.subList = getTreeData(subList);
    }
    return {
      ...node,
      label: name,
      value: String(code),
    };
  });
};

export const SearchSchema = (): SearchProps<any>['schema'] => {
  const GHGCategoryArr = FistComputationEnums('GHGCategory');
  const ISOCategoryArr = FistComputationEnums('ISOCategory');
  return {
    type: 'object',
    properties: {
      likeSourceName: xRenderSeachSchema({
        type: 'string',
        placeholder: '排放源名称',
      }),
      sourceCode: xRenderSeachSchema({
        type: 'string',
        placeholder: '排放源ID',
      }),
      likeFacility: xRenderSeachSchema({
        type: 'string',
        placeholder: '排放设施/活动 ',
      }),
      ghg: xRenderSeachSchema({
        type: 'array',
        placeholder: 'GHG分类',
        widget: 'cascader',
        props: {
          fieldNames: { label: 'label', value: 'value', children: 'subList' },
          changeOnSelect: true,
          options: getTreeData(GHGCategoryArr),
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
      iso: xRenderSeachSchema({
        type: 'array',
        placeholder: 'ISO分类',
        widget: 'cascader',
        props: {
          options: getTreeData(ISOCategoryArr),
          fieldNames: { label: 'label', value: 'value', children: 'subList' },
          changeOnSelect: true,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        },
      }),
    },
  };
};
