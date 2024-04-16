/*
 * @@description:碳排放源
 */

import { PlusOutlined } from '@ant-design/icons';
import { Cascader } from 'antd';
import { compact } from 'lodash-es';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getComputationEmissionSourcePage,
  postComputationComputationEmissionSourceAdd,
  postComputationModelEmissionSourceAdd,
  getComputationEmissionSourcePageProps as SearchApiProps,
} from '@/sdks/Newcomputation/computationV2ApiDocs';

import { columns, SearchSchema, TypeComputation } from './utils/columns';
import { culComputation } from '../util/util';

const EmissionManage = () => {
  // 选择selectKey
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const { refresh } = useTable();
  const navigate = useNavigate();

  // @ts-ignore
  const searchApi: CustomSearchProps<
    TypeComputation,
    SearchApiProps
  > = args => {
    const { ghg, iso } = args;
    return getComputationEmissionSourcePage({
      ...args,
      ghg: ghg ? String(ghg) : undefined,
      iso: iso ? String(iso) : undefined,
    }).then(({ data }) => {
      return data?.data;
    });
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: {
    selectedRowKeys: React.Key[];
    onChange: (newSelectedRowKeys: React.Key[]) => void;
  } = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <Page
      title={!pageTypeInfo && '排放源库'}
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.emissionManagInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={
        !pageTypeInfo &&
        checkAuth(
          '/emissionManagInfo/add',
          <div>
            <PlusOutlined /> 新增
          </div>,
        )
      }
    >
      <TableRender<TypeComputation, SearchApiProps>
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          widgets: { cascader: Cascader },
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({ refresh, navigate, pageTypeInfo, modelId: id }),
          rowSelection: pageTypeInfo ? rowSelection : undefined,
          scroll: { x: 1200 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      {window.location.pathname !== '/carbonAccounting/emissionManage' && (
        <FormActions
          place='center'
          buttons={compact([
            {
              title: '保存',
              type: 'primary',
              disabled: selectedRowKeys.length === 0,
              onClick: async () => {
                // 判断是否事 核算模型  还是碳排放核算 的排放源
                if (!culComputation()) {
                  /** 核算模型 */
                  await postComputationModelEmissionSourceAdd({
                    req: {
                      emissionSourceIds: selectedRowKeys.toString(),
                      id: id ? Number(id) : 0,
                    },
                  }).then(() => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.accountingModelEmissionSource,
                        [PAGE_TYPE_VAR, ':id'],
                        [pageTypeInfo, id],
                      ),
                    );
                  });
                } else {
                  /** 排放核算 */
                  await postComputationComputationEmissionSourceAdd({
                    req: {
                      emissionSourceIds: selectedRowKeys.toString(),
                      id: id ? Number(id) : 0,
                    },
                  }).then(() => {
                    navigate(
                      virtualLinkTransform(
                        EcaRouteMaps.carbonMissionAccountingSourceInfo,
                        [PAGE_TYPE_VAR, ':id'],
                        [pageTypeInfo, id],
                      ),
                    );
                  });
                }
              },
            },
            {
              title: '取消',
              onClick: async () => {
                if (!culComputation()) {
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.accountingModelEmissionSource,
                      [PAGE_TYPE_VAR, ':id'],
                      [pageTypeInfo, id],
                    ),
                  );
                  return;
                }
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.carbonMissionAccountingSourceInfo,
                    [PAGE_TYPE_VAR, ':id'],
                    [pageTypeInfo, id],
                  ),
                );
              },
            },
          ])}
        />
      )}
    </Page>
  );
};

export default withTable(EmissionManage);
