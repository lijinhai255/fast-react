/*
 * @@description:
 */
/*
 * @@description: 产品碳足迹-碳足迹报告-列表
 */

import { PlusOutlined } from '@ant-design/icons';
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
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Report,
  getFootprintReport,
  getFootprintReportProps,
} from '@/sdks/footprintV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { reportColumns } from './utils/columns';
import { searchSchema } from './utils/schemas';

function ReportList() {
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

  /** 碳足迹报告列表 */
  const searchApi: SearchProps<Report>['api'] = ({
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
    } as Partial<SearchParamses> & Partial<getFootprintReportProps>;
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
      page: current,
      size: pageSize,
    } as unknown as getFootprintReportProps;

    return getFootprintReport(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return {
        ...result,
        rows: result?.records || [],
        total: result.total || 0,
      };
    });
  };
  return (
    <Page
      title='碳足迹报告'
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            RouteMaps.carbonFootPrintReportInfo,
            [PAGE_TYPE_VAR, ':id', ':functionUnitId'],
            [PageTypeInfo.add, 'null', 'null'],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/carbonFootPrint/report/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender
        searchProps={{
          schema: searchSchema(orgList),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...reportColumns({ navigate, refresh })],
            '-',
          ),
          scroll: { x: 1400 },
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
export default withTable(ReportList);
