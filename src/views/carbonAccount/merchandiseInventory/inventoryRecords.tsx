/*
 * @@description:库存记录
 */
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  getAccountsystemInventoryRecord,
  getAccountsystemInventoryRecordProps,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { columns, SearchSchema } from './utils/columnsRecords';

const MerchandiseInventory = () => {
  const { id, title, num } = useParams<{
    id: string;
    title: string;
    num: string;
  }>();
  // 弹窗表单赋值
  const [searchParams, setSearchParams] =
    useState<getAccountsystemInventoryRecordProps>(
      getSearchParams<getAccountsystemInventoryRecordProps>()[0],
    );
  const { form } = useTable();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getAccountsystemInventoryRecordProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getAccountsystemInventoryRecordProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getAccountsystemInventoryRecordProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getAccountsystemInventoryRecord({
      ...newSearch,
      goodsId: Number(id) || 0,
    }).then(({ data }) => {
      return {
        rows: data?.data?.records,
        total: data?.data?.total,
      };
    });
  };

  return (
    <Page title={`商品名称：${`${title}`}\xa0 \xa0   剩余库存：${num}`}>
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText([...indexColumn, ...columns()], '-'),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1100 },
        }}
      />
      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => history.back(),
          },
        ]}
      />
    </Page>
  );
};

export default withTable(MerchandiseInventory);
