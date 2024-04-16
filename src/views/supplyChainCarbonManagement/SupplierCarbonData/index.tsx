/*
 * @description: 供应链碳管理-供应商碳数据
 */

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  ApplyInfo,
  getSupplychainApplyPage,
  getSupplychainApplyPageProps,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import style from '../SupplierManagement/index.module.less';
import { useSupplyChainEnums } from '../hooks/useEnums';

function SupplierCarbonData() {
  const navigate = useNavigate();
  const { form } = useTable();

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

  /** 数据类型枚举 */
  const dataTypeOptions = useSupplyChainEnums('DataType');

  /** 状态枚举 */
  const applyStatusOptions = useSupplyChainEnums('ApplyStatus');

  /** 供应商列表 */
  const searchApi: SearchProps<ApplyInfo>['api'] = ({
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
    } as Partial<SearchParamses> & Partial<getSupplychainApplyPageProps>;
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
    } as unknown as getSupplychainApplyPageProps;
    return getSupplychainApplyPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return {
        ...result,
        rows: result?.list || [{}],
        total: result.total || 0,
      };
    });
  };
  return (
    <Page wrapperClass={style.supplyManagementWrapper} title='供应商碳数据'>
      <TableRender
        searchProps={{
          schema: searchSchema(orgList, dataTypeOptions, applyStatusOptions),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...columns({ navigate })],
            '-',
          ),
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
export default withTable(SupplierCarbonData);
