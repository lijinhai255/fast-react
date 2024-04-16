/*
 * @@description:
 */
/*
 * @@description:低碳场景
 */
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import { CaRouteMaps } from '@/router/utils/caEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Model } from '@/sdks/computation/computationV2ApiDocs';
import {
  getAccountsystemScene,
  getAccountsystemSceneProps,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { columns, SearchSchema } from './columns';

const Users = () => {
  // 弹窗表单赋值
  const [searchParams, setSearchParams] = useState<getAccountsystemSceneProps>(
    getSearchParams<getAccountsystemSceneProps>()[0],
  );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getAccountsystemSceneProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getAccountsystemSceneProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getAccountsystemSceneProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getAccountsystemScene({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.records,
        total: data?.data?.total,
      };
    });
  };
  // 复制、编辑 查看
  const editFn = (record: Model) => {
    // changeInitValue({ ...record });
    navigate(
      virtualLinkTransform(
        CaRouteMaps.lowCarbonScenarioInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.edit, record.id],
      ),
    );
  };
  const showFn = (record: Model) => {
    // changeInitValue({ ...record });
    navigate(
      virtualLinkTransform(
        CaRouteMaps.lowCarbonScenarioInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.show, record.id],
      ),
    );
  };
  return (
    <Page
      title='低碳场景'
      actionBtnChild={checkAuth(
        '/carbonAccount/lowCarbonScenario/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            CaRouteMaps.lowCarbonScenarioInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        );
      }}
    >
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...columns({ refresh, navigate, editFn, showFn })],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1500 },
        }}
      />
    </Page>
  );
};

export default withTable(Users);
