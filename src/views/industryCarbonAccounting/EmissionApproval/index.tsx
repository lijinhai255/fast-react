/**
 * @description 排放数据审核列表
 */
import { useNavigate } from 'react-router-dom';
import { withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { useAsyncEnums } from '@/hooks';
import {
  AuditData,
  getEnterprisesystemAuditPageProps as SearchApiProps,
  getEnterprisesystemAuditPage,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { columns } from './columns';
import { searchSchema } from './schemas';

const EmissionApproval = () => {
  const navigate = useNavigate();

  /** 审核状态 */
  const statusList = useAsyncEnums('AuditStatus');

  const searchApi: CustomSearchProps<AuditData, SearchApiProps> = args => {
    return getEnterprisesystemAuditPage(args).then(({ data }) => {
      return data?.data;
    });
  };

  return (
    <Page title='排放数据审核'>
      <TableRender<AuditData, SearchApiProps>
        searchProps={{
          schema: searchSchema(statusList),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};
export default withTable(EmissionApproval);
