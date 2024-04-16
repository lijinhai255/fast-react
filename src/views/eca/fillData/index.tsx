/*
 * @@description: 排放源填报
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  getComputationDataPage,
  getComputationDataPageProps,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { columns, SearchSchema } from './utils/columns';

const Users = () => {
  const [searchParams, setSearchParams] = useState<getComputationDataPageProps>(
    getSearchParams<getComputationDataPageProps>()[0],
  );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getComputationDataPageProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getComputationDataPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationDataPageProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationDataPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  return (
    <Page title='排放数据填报'>
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...columns({ refresh, navigate })],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1200 },
        }}
      />
    </Page>
  );
};

export default withTable(Users);
