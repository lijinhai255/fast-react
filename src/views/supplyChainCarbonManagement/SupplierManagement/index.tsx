/*
 * @@description:
 */
/*
 * @@description: 供应链碳管理-供应商管理-列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  Supplier,
  getSupplychainSupplierPage,
  getSupplychainSupplierPageProps,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import style from './index.module.less';
import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import { useSupplyChainEnums } from '../hooks/useEnums';

function SupplierManagement() {
  const navigate = useNavigate();
  const { form, refresh } = useTable();

  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );

  /** 用于修正第一次页码无法正常设置问题 */
  const isFirstLoad = useRef(true);

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 状态 */
  const supplyStatusOptions = useSupplyChainEnums('SupplierStatus');

  /** 供应商列表 */
  const searchApi: SearchProps<Supplier>['api'] = ({
    current,
    pageSize,
    ...args
  }: {
    current: number;
    pageSize: number;
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;

    const search = {
      ...getSearchParams()[0],
    } as Partial<SearchParamses> & Partial<getSupplychainSupplierPageProps>;
    let newSearch = { ...args, ...search, pageSize };
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        current: pageNum,
        pageSize,
      };
      updateUrl(newSearch);
    } else {
      form.setValues({ ...search });
    }
    setSearchParams({ ...newSearch, current: newSearch.current || 1 });

    isFirstLoad.current = false;
    const searchVals = {
      ...newSearch,
      pageNum: newSearch.current || 1,
      pageSize,
    } as unknown as getSupplychainSupplierPageProps;
    return getSupplychainSupplierPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return {
        ...result,
        rows: result?.list || [{}],
        total: result.total || 0,
      };
    });
  };
  return (
    <Page
      wrapperClass={style.supplyManagementWrapper}
      title='供应商管理'
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            SccmRouteMaps.sccmManagementInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 'null'],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/supplyChain/supplierManagement/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
      rightRender={[
        checkAuth(
          '/supplyChain/supplierManagement/import',
          <Button
            type='default'
            onClick={() => {
              navigate(SccmRouteMaps.sccmManagementImport);
            }}
          >
            导入
          </Button>,
        ),
      ]}
    >
      <TableRender
        searchProps={{
          schema: searchSchema(orgList, supplyStatusOptions),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...columns({ navigate, refresh })],
            '-',
          ),
          scroll: { x: 1600 },
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
}
export default withTable(SupplierManagement);
