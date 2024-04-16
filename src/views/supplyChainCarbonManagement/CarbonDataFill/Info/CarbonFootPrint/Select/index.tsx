/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-产品碳足迹-选择碳排放核算
 */

import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  ProductionBusinessDto,
  getSupplychainDataProcessFootprintChoosePage,
  getSupplychainDataProcessFootprintChoosePageProps,
  postSupplychainDataProcessFootprintChoose,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import LocalStore from '@/utils/store';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import style from '@/views/supplyChainCarbonManagement/SupplierManagement/Info/index.module.less';
import { SELECT_BACK_KEY } from '@/views/supplyChainCarbonManagement/utils';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';

function Select() {
  const navigate = useNavigate();
  const { form, setTable } = useTable();
  const { pageTypeInfo, id, pageType } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    pageType: string;
  }>();
  /** ur上的参数  */
  const search = { ...getSearchParams()[0] };

  /** 是否为结果选择 */
  const isResultSelect = pageType === 'resultSelect';

  /** 页码配置 */
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });

  /** 序号列 */
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );

  /** 用于修正第一次页码无法正常设置问题 */
  const isFirstLoad = useRef(true);

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 产品碳足迹选择核算列表 */
  const searchApi: SearchProps<ProductionBusinessDto>['api'] = ({
    current,
    pageSize,
    applyInfoId,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;

    const search = {
      ...getSearchParams()[0],
    } as Partial<SearchParamses> &
      Partial<getSupplychainDataProcessFootprintChoosePageProps>;
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
      ...args,
      pageNum: current,
      pageSize,
      applyInfoId,
    } as unknown as getSupplychainDataProcessFootprintChoosePageProps;
    setTable?.({
      loading: true,
    });
    if (!applyInfoId) {
      setTable?.({
        loading: false,
        dataSource: [],
        pagination: {
          current,
          pageSize,
          total: 0,
        },
      });
      return {
        rows: [],
        total: 0,
      } as unknown as Promise<{
        rows: ProductionBusinessDto[];
        total: number;
        pageSize?: number | undefined;
      }>;
    }

    return getSupplychainDataProcessFootprintChoosePage(searchVals).then(
      ({ data }) => {
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
      },
    );
  };

  /** 存在申请id调用接口 */
  useEffect(() => {
    if (id) {
      searchApi({
        current: 1,
        pageSize: searchParams.pageSize || 10,
        applyInfoId: id,
        likeProductionName: search?.likeProductionName,
      });
    }
  }, [id]);

  /** 选中表格 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /** 选择项配置 */
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Page title='选择核算产品'>
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
                applyInfoId: id,
              });
            },
            onMount: () => {
              /** 默认带过来产品名称 */
              form.setValues({
                likeProductionName: search?.likeProductionName,
              });
            },
          }}
          tableProps={{
            pageChangeWithRequest: false,
            columns: changeTableColumsNoText(
              [
                ...indexColumn,
                ...columns({
                  pageTypeInfo,
                  id,
                  pageType,
                  navigate,
                }),
              ],
              '-',
            ),
            rowSelection: {
              type: 'radio',
              ...rowSelection,
            },
            scroll: { x: 1600 },
            rowKey: 'productionBusinessId',
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
                  applyInfoId: id,
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
              /** 核算结果确定的处理 */
              if (isResultSelect) {
                LocalStore.setValue(SELECT_BACK_KEY, {
                  productionBusinessId: Number(selectedRowKeys[0]),
                  currentTab: '2',
                });
                history.back();
              } else {
                /** 核算过程确定的处理 */
                postSupplychainDataProcessFootprintChoose({
                  req: {
                    applyInfoId: Number(id),
                    productionBusinessId: Number(selectedRowKeys[0]),
                  },
                }).then(({ data }) => {
                  if (data.code === 200) {
                    LocalStore.setValue(SELECT_BACK_KEY, {
                      currentTab: '2',
                    });
                    history.back();
                  }
                });
              }
            },
          },
          {
            title: '取消',
            onClick: async () => {
              LocalStore.setValue(SELECT_BACK_KEY, {
                currentTab: '2',
              });
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default withTable(Select);
