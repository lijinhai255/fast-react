/**
 * @description 碳排放报告列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import {
  getEnterprisesystemSysReportPageProps as SearchApiProps,
  SysReport,
  getEnterprisesystemSysReportPage,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { pageTo } from '../utils';

const Report = () => {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  const searchApi: CustomSearchProps<SysReport, SearchApiProps> = args =>
    getEnterprisesystemSysReportPage(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      title='碳排放报告'
      onBtnClick={async () => {
        pageTo(navigate, ICARouteMaps.icaReportInfo, PageTypeInfo.add);
      }}
      actionBtnChild={checkAuth(
        '/industryCarbonAccounting/report/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<SysReport, SearchApiProps>
        searchProps={{
          schema: searchSchema(orgList),
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
export default withTable(Report);
