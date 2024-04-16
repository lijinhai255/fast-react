/*
 * @@description: 碳账户明细
 */

import { withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import {
  getAccountsystemUserScore,
  getAccountsystemUserScoreProps as SearchApiProps,
  UserScore,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';

import { columns, SearchSchema } from './columns';

const CADetail = () => {
  const searchApi: CustomSearchProps<UserScore, SearchApiProps> = args => {
    const result = {
      ...args,
      beginDate: args?.beginDate?.[0],
      endDate: args?.beginDate?.[1],
    };
    return getAccountsystemUserScore(result).then(({ data }) => {
      return data?.data;
    });
  };

  return (
    <Page title='碳账户明细'>
      <TableRender<UserScore, SearchApiProps>
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns(),
          scroll: { x: 1600 },
        }}
        autoAddIndexColumn
        autoSaveSearchInfo
        autoFixNoText
      />
    </Page>
  );
};

export default withTable(CADetail);
