/*
 * @@description: 供应链碳管理-采购产品管理-供应商管理-选择
 */

import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import {
  getSupplychainSupplierPage,
  getSupplychainSupplierPageProps,
  postSupplychainProductSupplierBind,
  Supplier,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import style from '@/views/supplyChainCarbonManagement/SupplierManagement/Info/index.module.less';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';

function SelectSupplierManagement() {
  const { form, setTable } = useTable();
  const { id, orgId } = useParams<{
    id: string;
    orgId: string;
  }>();

  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );

  /** 用于修正第一次页码无法正常设置问题 */
  const isFirstLoad = useRef(true);

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /** 供应商管理列表（只能选择该组织以及启用的供应商） */
  const searchApi: SearchProps<Supplier>['api'] = ({
    current,
    pageSize,
    orgId,
    supplierStatus,
    ...args
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
        orgId,
        supplierStatus: '1',
      };
      updateUrl(newSearch);
    } else {
      form.setValues({ ...search });
    }

    setSearchParams({ ...newSearch, current: newSearch.current || 1 });

    isFirstLoad.current = false;
    const searchVals = {
      ...newSearch,
      ...args,
      pageNum: current,
      pageSize,
      orgId,
      supplierStatus: '1',
    } as unknown as getSupplychainSupplierPageProps;
    setTable?.({
      loading: true,
    });
    if (!orgId || !supplierStatus) {
      setTable?.({
        loading: false,
        dataSource: [{}],
        pagination: {
          current,
          pageSize,
          total: 0,
        },
      });
      return {
        rows: [{}],
        total: 0,
      } as unknown as Promise<{
        rows: Supplier[];
        total: number;
        pageSize?: number | undefined;
      }>;
    }

    return getSupplychainSupplierPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      setTable?.({
        loading: false,
        dataSource: result?.list || [{}],
        pagination: {
          current,
          pageSize,
          total: result.total || 0,
        },
      });
      return {
        ...result,
        rows: result?.list || [{}],
        total: result.total || 0,
      };
    });
  };

  /** 存在组织时调用接口 */
  useEffect(() => {
    if (orgId) {
      searchApi({
        current: searchParams.current,
        pageSize: searchParams.pageSize || 10,
        supplierStatus: '1',
        orgId,
      });
    }
  }, [orgId]);

  /** 选中表格 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys as unknown as number[]);
  };

  /** 选择项配置 */
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Page title='选择供应商'>
        <TableRender
          searchProps={{
            schema: searchSchema(),
            api: searchApi,
            searchOnMount: false,
            onSearch: params => {
              searchApi({
                ...params,
                current: 1,
                pageSize: searchParams.pageSize || 10,
                supplierStatus: '1',
                orgId,
              });
            },
          }}
          tableProps={{
            pageChangeWithRequest: false,
            columns: changeTableColumsNoText(
              [...indexColumn, ...columns()],
              '-',
            ),
            rowSelection: {
              type: 'checkbox',
              ...rowSelection,
            },
            pagination: {
              pageSize: searchParams?.pageSize
                ? +searchParams.pageSize
                : undefined,
              current: searchParams?.current
                ? +searchParams.current
                : undefined,
              size: 'default',
              onChange: (current, pageSize) => {
                searchApi({
                  current,
                  pageSize,
                  supplierStatus: '1',
                  orgId,
                });
              },
            },
          }}
        />
      </Page>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '确定',
            type: 'primary',
            disabled: selectedRowKeys.length === 0,
            onClick: async () => {
              postSupplychainProductSupplierBind({
                req: {
                  supplierIdList: selectedRowKeys,
                  productId: Number(id),
                },
              }).then(({ data }) => {
                if (data.code === 200) {
                  history.back();
                }
              });
            },
          },
          {
            title: '取消',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default withTable(SelectSupplierManagement);
