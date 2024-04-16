/*
 * @@description:
 */
/*
 * @@description:减排场景
 */
import { PlusOutlined } from '@ant-design/icons';
import { compact } from 'lodash-es';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getComputationReductionScenePage,
  getComputationReductionScenePageProps,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

import { columns, SearchSchema } from './utils/columns';

const Users = () => {
  const formValues = new URLSearchParams(window.location.search).get(
    CHOOSE_FACTOR.FORM_VALUES,
  );
  const { pageTypeInfo, id, chooseScreen, chooseType } = useParams<{
    pageTypeInfo?: PageTypeInfo;
    id: string;
    chooseScreen: string;
    chooseType: string;
  }>();
  const [selectedRowKeys, changeSselectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] =
    useState<getComputationReductionScenePageProps>(
      getSearchParams<getComputationReductionScenePageProps>()[0],
    );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getComputationReductionScenePageProps>['api'] =
    ({ current, ...args }) => {
      const pageNum =
        (isFirstLoad.current ? searchParams.pageNum : current) || current;
      let newSearch = {
        ...args,
        ...searchParams,
        pageNum,
      } as getComputationReductionScenePageProps;
      if (!isFirstLoad.current) {
        newSearch = {
          ...args,
          pageNum,
        } as getComputationReductionScenePageProps;
        updateUrl(args);
      } else {
        form.setValues(newSearch);
      }
      setSearchParams({
        ...newSearch,
      });
      isFirstLoad.current = false;
      return getComputationReductionScenePage({
        ...newSearch,
      }).then(({ data }) => {
        return {
          rows: data?.data?.list,
          total: data?.data?.total,
        };
      });
    };
  const returnUrl = () => {
    return formValues
      ? `?${CHOOSE_FACTOR.FORM_VALUES}=${formValues}&${CHOOSE_FACTOR.SCREEN_ID}=${selectedRowKeys}`
      : `?${CHOOSE_FACTOR.SCREEN_ID}=${selectedRowKeys}`;
  };
  return (
    <Page
      title='减排场景'
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.reductionSceneInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/reductionSceneInfo/Add',
        window.location.pathname.indexOf('reductionScene') >= 0 && (
          <div>
            <PlusOutlined /> 新增
          </div>
        ),
      )}
    >
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...columns({
                pageTypeInfo,
                refresh,
                navigate,
                chooseScreen,
                reportId: id,
                chooseType,
              }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          rowSelection: chooseType
            ? {
                type: 'checkbox',
                selectedRowKeys,
                onChange: selectRowKeys => {
                  changeSselectedRowKeys(selectRowKeys);
                },
              }
            : undefined,
          scroll: { x: 1200 },
        }}
      />
      {window.location.pathname.indexOf('/carbonAccounting/reductionScene') ===
        -1 && (
        <FormActions
          place='center'
          buttons={compact([
            {
              title: '保存',
              type: 'primary',
              disabled: selectedRowKeys.length === 0,
              onClick: async () => {
                const urlParamsData = returnUrl();
                const baseUrl = `${virtualLinkTransform(
                  EcaRouteMaps.accountingReportInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [pageTypeInfo, id],
                )}`;
                navigate(baseUrl + urlParamsData);
              },
            },
            {
              title: '取消',
              onClick: async () => {
                const urlParamsData = returnUrl();
                const baseUrl = `${virtualLinkTransform(
                  EcaRouteMaps.accountingReportInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [pageTypeInfo, id],
                )}`;
                navigate(baseUrl + urlParamsData);
              },
            },
          ])}
        />
      )}
    </Page>
  );
};

export default withTable(Users);
