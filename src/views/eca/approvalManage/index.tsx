/*
 * @@description:排放数据审核
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  AuditData,
  getComputationAuditPage,
  getComputationAuditPageProps,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { PendReviewModal } from './PendReviewModal';
import { columns, SearchSchema } from './utils/columns';

const Users = () => {
  const [open, getOpen] = useState(false);
  const [catchRecord, getCatcherRecord] = useState<AuditData>({});
  const [searchParams, setSearchParams] =
    useState<getComputationAuditPageProps>(
      getSearchParams<getComputationAuditPageProps>()[0],
    );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getComputationAuditPageProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getComputationAuditPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationAuditPageProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationAuditPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  const PendReviewModalFn = (record: AuditData) => {
    getOpen(true);
    getCatcherRecord(record);
  };
  return (
    <Page title='排放数据审核'>
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...columns({ refresh, navigate, PendReviewModalFn }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
        }}
      />
      <PendReviewModal
        open={open}
        handleCancel={() => {
          getOpen(false);
        }}
        id={Number(catchRecord?.id)}
      />
    </Page>
  );
};

export default withTable(Users);
