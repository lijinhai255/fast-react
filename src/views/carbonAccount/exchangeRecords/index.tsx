/*
 * @@description:兑换记录
 */

import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import {
  getAccountsystemOrders,
  Orders,
  getAccountsystemOrdersProps as SearchApiProps,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';

import { columns, SearchSchema } from './columns';

const ExchangeRecords = () => {
  const { refresh } = useTable();

  const searchApi: CustomSearchProps<Orders, SearchApiProps> = args => {
    const result = {
      ...args,
      beginDate: args?.beginDate?.[0],
      endDate: args?.beginDate?.[1],
    };
    return getAccountsystemOrders(result).then(({ data }) => {
      return data?.data;
    });
  };

  return (
    <Page title='兑换记录'>
      <TableRender<Orders, SearchApiProps>
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns({ refresh }),
          scroll: { x: 1500 },
        }}
        autoAddIndexColumn
        autoSaveSearchInfo
        autoFixNoText
      />
    </Page>
  );
};

export default withTable(ExchangeRecords);
