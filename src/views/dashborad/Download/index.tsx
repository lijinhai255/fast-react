/*
 * @@description: 下载管理
 */
import { useRef, useState } from 'react';
import { withTable, useTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { useAsyncEnums } from '@/hooks';
import {
  getSystemFilelogPage,
  getSystemFilelogPageProps,
  OperLog,
} from '@/sdks/systemV2ApiDocs';
import { getSearchParams, updateUrl, changeTableColumsNoText } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import { SearchParamses } from './utils/types';
import { useOrgs } from '../organizations/OrgManage/hooks';

const Dict = () => {
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });

  const { form } = useTable();
  const orgs = useOrgs();
  const bizModule = useAsyncEnums('BizModule');
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);

  const searchApi: SearchProps<OperLog>['api'] = ({ current, ...args }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;
    const time = JSON.parse(getSearchParams()[0]?.time || '[]').map(
      (t: string) => t,
    );

    const search = {
      ...getSearchParams()[0],
      time,
    } as Partial<SearchParamses>;
    let newSearch = { ...args, ...search };
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        current: pageNum,
        moduleType: form.getValues().moduleType,
      };
      updateUrl(args);
    } else {
      form.setValues({ ...search });
    }
    setSearchParams({ ...newSearch, current: newSearch.current || 1 });

    isFirstLoad.current = false;
    let searchVals = {
      ...newSearch,
      pageNum: current,
    } as unknown as getSystemFilelogPageProps;
    if (newSearch?.time?.length) {
      searchVals = {
        ...searchVals,
      };
    }

    return getSystemFilelogPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return { ...result, rows: result?.list || [], total: result.total || 0 };
    });
  };

  return (
    <Page title='下载管理'>
      <TableRender
        searchProps={{
          schema: searchSchema(orgs, bizModule),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText([...indexColumn, ...columns()], '-'),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.current ? +searchParams.current : undefined,
            size: 'default',
          },
        }}
      />
    </Page>
  );
};

export default withTable(Dict);
