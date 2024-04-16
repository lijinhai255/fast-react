/**
 * @description:操作日志
 */

import { withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { useAsyncEnums } from '@/hooks';
import {
  getSystemOperlogPage,
  getSystemOperlogPageProps as SearchApiProps,
  OperLog,
} from '@/sdks/systemV2ApiDocs';

import { columns } from './utils/columns';
import { SearchSchema } from './utils/schemas';

const ActionsLog = () => {
  const moduleType = useAsyncEnums('ModuleType');

  const searchApi: CustomSearchProps<OperLog, SearchApiProps> = args => {
    const result = {
      ...args,
      startDate: args?.startDate?.[0],
      endDate: args?.startDate?.[1],
    };
    return getSystemOperlogPage(result).then(({ data }) => {
      return data?.data || {};
    });
  };

  return (
    <Page title='操作日志'>
      <TableRender<OperLog, SearchApiProps>
        searchProps={{
          schema: SearchSchema(moduleType),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns(),
        }}
        autoAddIndexColumn
        autoSaveSearchInfo
        autoFixNoText
      />
    </Page>
  );
};

export default withTable(ActionsLog);
