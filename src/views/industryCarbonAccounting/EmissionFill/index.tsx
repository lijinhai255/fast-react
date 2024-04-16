/**
 * @description 排放数据填报列表
 */
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import {
  getEnterprisesystemSysBusinessTenetPage,
  getEnterprisesystemSysBusinessTenetPageProps as SearchApiProps,
  SysBusinessTenet,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { useIndustryCarbonAllEnum } from '../hooks';

const EmissionFill = () => {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 填报状态 */
  const statusList = useIndustryCarbonAllEnum('AuditStatusType');

  const searchApi: CustomSearchProps<
    SysBusinessTenet,
    SearchApiProps
  > = args => {
    return getEnterprisesystemSysBusinessTenetPage(args).then(({ data }) => {
      return data?.data;
    });
  };

  return (
    <Page title='排放数据填报'>
      <TableRender<SysBusinessTenet, SearchApiProps>
        searchProps={{
          schema: searchSchema(orgList, statusList),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};
export default withTable(EmissionFill);
