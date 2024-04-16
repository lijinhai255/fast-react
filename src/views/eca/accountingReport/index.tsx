/*
 * @@description:角色列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getComputationReportPage,
  getComputationReportPageProps,
  Report,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { columns, SearchSchema } from './utils/columns';
import { ReportModal } from '../approvalManage/PendReviewModal';

const Users = () => {
  const [searchParams, setSearchParams] =
    useState<getComputationReportPageProps>(
      getSearchParams<getComputationReportPageProps>()[0],
    );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // 控制弹窗
  const [open, getOpen] = useState(false);
  const [catchRecord, getCatchRecord] = useState<Report>({});
  // @ts-ignore
  const searchApi: SearchProps<getComputationReportPageProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getComputationReportPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationReportPageProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationReportPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  const reportFn = (record: Report) => {
    getOpen(true);
    getCatchRecord({ ...record });
  };
  return (
    <Page
      title='核算报告'
      onBtnClick={async () =>
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.accountingReportInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/accountingReportInfo/Add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...columns({ refresh, navigate, reportFn })],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1200 },
        }}
      />
      <ReportModal
        open={open}
        handleCancel={() => {
          getOpen(false);
        }}
        handleOk={() => {
          getOpen(false);
        }}
        id={Number(catchRecord?.id)}
      />
    </Page>
  );
};

export default withTable(Users);
