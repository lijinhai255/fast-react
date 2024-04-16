/**
 * @description 生产单元列表
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
  Cell,
  getEnterprisesystemSysCellPageProps as SearchApiProps,
  getEnterprisesystemSysCellPage,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { pageTo } from '../utils';

const ProductionUnit = () => {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  const searchApi: CustomSearchProps<Cell, SearchApiProps> = args =>
    getEnterprisesystemSysCellPage(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      title='生产单元'
      onBtnClick={async () => {
        pageTo(navigate, ICARouteMaps.icaProductionUnitInfo, PageTypeInfo.add);
      }}
      actionBtnChild={checkAuth(
        '/industryCarbonAccounting/productionUnit/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<Cell, SearchApiProps>
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
export default withTable(ProductionUnit);
