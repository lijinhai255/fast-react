/*
 * @@description:商品库存
 */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { Model } from '@/sdks/computation/computationV2ApiDocs';
import {
  getAccountsystemGoodsStock,
  getAccountsystemGoodsStockProps,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { InventoryModel } from './model';
import { columns, SearchSchema } from './utils/columns';

const MerchandiseInventory = () => {
  // 控制核算模型 新增 编辑 详情
  const [status, setStatus] = useState<'IN' | 'OUT'>('IN');
  // 控制弹窗 显隐
  const [visable, changeVisAble] = useState(false);
  // 弹窗表单赋值
  const [initValue, changeInitValue] = useState<Model>({});
  const [searchParams, setSearchParams] =
    useState<getAccountsystemGoodsStockProps>(
      getSearchParams<getAccountsystemGoodsStockProps>()[0],
    );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getAccountsystemGoodsStockProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getAccountsystemGoodsStockProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getAccountsystemGoodsStockProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getAccountsystemGoodsStock({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.records,
        total: data?.data?.total,
      };
    });
  };
  // 复制、编辑 查看
  const inFn = (record: Model) => {
    changeInitValue({ ...record });
    // eslint-disable-next-line no-console
    console.log(initValue, 'initValue');
    setStatus('IN');
    changeVisAble(true);
  };
  const outFn = (record: Model) => {
    changeInitValue({ ...record });
    setStatus('OUT');
    changeVisAble(true);
  };
  return (
    <Page title='商品库存'>
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...columns({ navigate, inFn, outFn })],
            '-',
          ),
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
      <InventoryModel
        status={status}
        visable={visable}
        onCancelFn={() => {
          changeVisAble(false);
        }}
        onOkFn={() => {
          changeVisAble(false);
          refresh?.();
        }}
        initValue={initValue}
      />
    </Page>
  );
};

export default withTable(MerchandiseInventory);
