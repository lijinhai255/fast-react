/*
 * @@description: 排行榜
 */

import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  getAccountsystemRankRankDeptPage,
  getAccountsystemRankRankUserPage,
  getAccountsystemRankRankUserPageProps,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';

import { columns, SearchSchema } from './columns';

const ExchangeRecords = () => {
  const { title, type } = useParams<{
    title: string;
    type: string;
  }>();

  const DATE = dayjs(new Date()).format('YYYY-MM-DD');

  // 弹窗表单赋值
  const [searchParams, setSearchParams] =
    useState<getAccountsystemRankRankUserPageProps>(
      getSearchParams<getAccountsystemRankRankUserPageProps>()[0],
    );
  const { form } = useTable();

  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getAccountsystemRankRankUserPageProps>['api'] =
    ({ current, ...args }) => {
      const pageNum =
        (isFirstLoad.current ? searchParams.pageNum : current) || current;
      let newSearch = {
        ...args,
        ...searchParams,
        pageNum,
      } as getAccountsystemRankRankUserPageProps;
      if (!isFirstLoad.current) {
        newSearch = {
          ...args,
          pageNum,
        } as getAccountsystemRankRankUserPageProps;
        updateUrl(args);
      } else {
        form.setValues(newSearch);
      }
      setSearchParams({
        ...newSearch,
      });
      isFirstLoad.current = false;
      const searchVals = {
        ...newSearch,
        dataType: title?.includes('积分') ? 0 : 1, // 数据类型:0,积分;1,减碳量
        dateType: type?.includes('日榜') ? 0 : 1, // 日期类型:0,日排行榜;1,总榜
      };
      const url = title?.includes('个人')
        ? getAccountsystemRankRankUserPage
        : getAccountsystemRankRankDeptPage;
      return url(searchVals).then(({ data }) => {
        return {
          rows: data?.data?.records,
          total: data?.data?.total,
        };
      });
    };

  return (
    <Page
      title={`排行榜：${title}-${type} ${
        type === '日榜' ? `日期：${DATE}` : ''
      }`}
    >
      <TableRender
        searchProps={{
          schema: SearchSchema(title as string),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...columns(title as string, type as string)],
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
    </Page>
  );
};

export default withTable(ExchangeRecords);
