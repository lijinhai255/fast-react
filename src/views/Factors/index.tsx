/*
 * @@description:排放因子
 */
import { useMemo, useRef, useState } from 'react';
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
  OperLog,
  getSystemFactorPage,
  getSystemFactorPageProps,
} from '@/sdks/systemV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import { SearchParamses } from './utils/types';
import { useAllEnumsBatch } from '../dashborad/Dicts/hooks';

const Factors = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });
  // 联动数据过滤
  const [sourceType, setSourceType] = useState('');
  const firstClassify = useAllEnumsBatch<{
    firstClassify: { dictLabel: string; dictValue: string; dictType: string }[];
  }>('firstClassify');
  const secondClassify = useAllEnumsBatch<{
    secondClassify: {
      dictLabel: string;
      dictValue: string;
      dictType: string;
      sourceType: string;
    }[];
  }>('secondClassify');
  const filteredSecondClassify = useMemo(() => {
    if (!secondClassify) return [];
    if (!sourceType) return secondClassify.secondClassify;
    return secondClassify.secondClassify?.filter(
      c => c.sourceType === sourceType,
    );
  }, [sourceType, secondClassify]);
  const { form, refresh } = useTable();
  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );

  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);

  const searchApi: SearchProps<OperLog>['api'] = ({ current, ...args }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;
    const time = JSON.parse(getSearchParams()[0]?.time || '[]').map(
      (t: string) => t,
    );

    const search = {
      ...getSearchParams()[0],
      time,
    } as Partial<SearchParamses> & Partial<getSystemFactorPageProps>;
    let newSearch = { ...args, ...search };
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        current: pageNum,
        moduleType: form.getValues().moduleType,
      };
      updateUrl(newSearch);
    } else {
      form.setValues({ ...search });
    }

    setSearchParams({ ...newSearch, current: newSearch.current || 1 });

    isFirstLoad.current = false;
    let searchVals = {
      ...newSearch,
      pageNum: current,
    } as unknown as getSystemFactorPageProps;
    if (newSearch?.time?.length) {
      searchVals = {
        ...searchVals,
      };
    }

    return getSystemFactorPage(searchVals).then(({ data }) => {
      const result = data?.data || {};
      return { ...result, rows: result?.list || [], total: result.total || 0 };
    });
  };
  return (
    <Page
      title='排放因子'
      actionBtnChild={checkAuth('/factor/list/info/add', <>新增</>)}
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            RouteMaps.factorInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 'null'],
          ),
        );
      }}
    >
      <TableRender
        searchProps={{
          schema: searchSchema(),
          api: searchApi,
          searchOnMount: false,
          onValuesChange: changedVal => {
            if (changedVal.dataPath === 'firstClassify') {
              const targetFirstClass = firstClassify?.firstClassify?.find(
                c => c.dictValue === changedVal.value,
              );
              setSourceType(targetFirstClass?.dictValue || '');
            }
          },
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...columns({
                navigate,
                refresh,
                secondClassify: filteredSecondClassify,
                firstClassify: firstClassify?.firstClassify || [],
              }),
            ],
            '-',
          ),
          scroll: { x: 1500 },
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
};

export default withTable(Factors);
