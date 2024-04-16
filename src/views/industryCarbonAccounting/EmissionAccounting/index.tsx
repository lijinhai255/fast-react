/*
 * @@description:
 */
/**
 * @description 碳排放核算列表
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
  getEnterprisesystemSysBusinessPage,
  getEnterprisesystemSysBusinessPageProps as SearchApiProps,
  SysBusiness,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { pageTo } from '../utils';

const EmissionAccounting = () => {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  const searchApi: CustomSearchProps<SysBusiness, SearchApiProps> = args => {
    return getEnterprisesystemSysBusinessPage(args).then(({ data }) => {
      return data?.data;
    });
  };

  return (
    <Page
      title='碳排放核算'
      onBtnClick={async () => {
        pageTo(navigate, ICARouteMaps.icaAccountingInfo, PageTypeInfo.add);
      }}
      actionBtnChild={checkAuth(
        '/industryCarbonAccounting/accounting/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<SysBusiness, SearchApiProps>
        searchProps={{
          schema: searchSchema(orgList),
          api: searchApi,
          searchOnMount: false,
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
export default withTable(EmissionAccounting);
