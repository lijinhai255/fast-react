/**
 * @@description: 基础表单组件
 * TODO：增加文档
 */
import classNames from 'classnames';
import type { FormInstance } from 'form-render';
import { useEffect, useRef } from 'react';
import { Search, Table, useTable } from 'table-render';
import type {
  SearchProps,
  TableContext,
  TableRenderProps,
  SearchApi,
} from 'table-render/dist/src/types';

import { usePageNumberInfo } from '@/hooks';
import { changeTableColumsNoText } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { CustomSearchProps } from './types';
import style from './xrender.module.less';

interface CustomTableRenderProps<RecordType extends object, S extends object> {
  /** 透传给  table-render Search 组件的参数*/
  searchProps: Omit<SearchProps<RecordType>, 'api'> & {
    api?: CustomSearchProps<RecordType, S>;
    onSearch?: (values: TableContext<RecordType>['doSearch']) => void;
  };
  /** 透传给  table-render Table 组件的参数*/
  tableProps: TableRenderProps<RecordType>;
  /** 是否自动将页面和表单搜索信息存储指 url SearchParams */
  autoSaveSearchInfo?: boolean;
  /** 是否自动增加序号 */
  autoAddIndexColumn?: boolean;
  /** 是否自动处理表单空值，默认占位符为 '-' */
  autoFixNoText?: boolean;
  /** 自定义表单空值的占位符 */
  customNoText?: string;
}

export const TableRender = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RecordType extends object = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends object = any,
>({
  searchProps,
  tableProps,
  autoSaveSearchInfo = false,
  autoAddIndexColumn = false,
  autoFixNoText = false,
  customNoText = '-',
}: CustomTableRenderProps<RecordType, S>) => {
  const { pageNum, pageSize, getParamsByKeys, setSearchParams } =
    usePageNumberInfo();

  const { doSearch, form } = useTable() as {
    doSearch: TableContext<RecordType>['doSearch'];
    form: FormInstance;
  };

  const indexColumn = useIndexColumn<RecordType>((pageNum - 1) * pageSize);

  let tableColumns = tableProps?.columns || [];
  if (autoAddIndexColumn) {
    tableColumns = [...indexColumn, ...tableColumns];
  }
  if (autoFixNoText) {
    tableColumns = changeTableColumsNoText(tableColumns, customNoText);
  }

  /**
   * form onMount 回调存在多次调用的问题。
   * schema 更新变动后重新调用 onMount，参考：https://github.com/alibaba/x-render/blob/1.x/packages/form-render/src/form-render-core/src/index.js#L136
   * 业务组件有动态更新 schema 的情况。
   * 暂时使用 useEffect 解决。在 schema 有值后，只需调用一次 doSearch。
   */
  const isNeedDoSearch = useRef(true);
  useEffect(() => {
    if (form.schema && isNeedDoSearch.current) {
      isNeedDoSearch.current = false;
      const formKeys = Object.keys(form.formData);
      const customSearch = getParamsByKeys(formKeys);
      const currentFormValue = form.getValues();
      const formValues = { ...currentFormValue, ...customSearch };
      doSearch?.({ current: pageNum, pageSize }, formValues);
      form.setValues(formValues);
    }
  }, [!!form.schema]);

  const searchApi = async (args: { current: number; pageSize: number }) => {
    const result = await (searchProps?.api as SearchApi<RecordType>)?.({
      ...args,
      pageNum: args.current,
    });
    if (autoSaveSearchInfo) {
      const formValues = form.getValues();

      setSearchParams({
        pageNum: String(args.current),
        pageSize: String(args.pageSize),
        ...formValues,
      });
    }
    return result;
  };

  return (
    <>
      <Search
        {...searchProps}
        searchOnMount={!autoSaveSearchInfo && searchProps.searchOnMount}
        api={
          Array.isArray(searchProps?.api)
            ? searchProps.api.map(item => ({ ...item, api: searchApi }))
            : searchApi
        }
        className={classNames(style.search, searchProps.className)}
      />
      <Table
        rowKey='id'
        {...tableProps}
        columns={tableColumns}
        className={classNames(style.table, tableProps.className)}
      />
    </>
  );
};
