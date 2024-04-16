/*
 * @@description: 供应链碳管理-碳数据审核
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  AuditDataResp,
  getSupplychainAuditPage,
  getSupplychainAuditPageProps,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import style from '../SupplierManagement/index.module.less';

function CarbonDataApproval() {
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

  /** 碳数据审核列表 */
  const searchApi: SearchProps<AuditDataResp>['api'] = ({
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
    } as Partial<SearchParamses> & Partial<getSupplychainAuditPageProps>;
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
    } as unknown as getSupplychainAuditPageProps;
    return getSupplychainAuditPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return {
        ...result,
        rows: result?.list || [{}],
        total: result.total || 0,
      };
    });
  };
  return (
    <Page wrapperClass={style.supplyManagementWrapper} title='碳数据审核'>
      <TableRender
        searchProps={{
          schema: searchSchema(),
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
export default withTable(CarbonDataApproval);
