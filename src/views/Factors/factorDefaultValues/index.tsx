/*
 * @@description:
 */
/**
 * @description 行业缺省值列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import {
  DefaultYear,
  getEnterprisesystemSysDefaultYear,
  getEnterprisesystemSysDefaultYearSelectBusinessPage,
  getEnterprisesystemSysDefaultYearProps as SearchApiProps,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { EnumType } from './types';
import { pageTo } from '../utils';

/** 应用类型 */
const APPTYPE = {
  /** 管理端 */
  BOSS: 0,
  /** 应用端 */
  APPLICATION: 1,
};

const FactorDefaultValues = () => {
  const navigate = useNavigate();
  const { refresh } = useTable();

  const searchApi: CustomSearchProps<DefaultYear, SearchApiProps> = args =>
    getEnterprisesystemSysDefaultYear({
      ...args,
      appType: APPTYPE.APPLICATION,
    }).then(({ data }) => {
      return data?.data;
    });

  /** 核算模型列表 */
  const [modelList, setModelList] = useState<EnumType[]>([]);
  useEffect(() => {
    getEnterprisesystemSysDefaultYearSelectBusinessPage({
      pageNum: 1,
      pageSize: 100,
    }).then(({ data }) => {
      const { records } = data.data;
      const newModelList = records?.map(item => ({
        value: item.id || 0,
        label: item.businessName,
      }));
      setModelList(newModelList || []);
    });
  }, []);

  return (
    <Page
      title='行业缺省值'
      onBtnClick={async () => {
        pageTo(navigate, RouteMaps.factorDefaultValuesAdd, PageTypeInfo.add);
      }}
      actionBtnChild={checkAuth(
        '/factor/defaultValues/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<DefaultYear, SearchApiProps>
        searchProps={{
          schema: searchSchema(modelList),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};
export default withTable(FactorDefaultValues);
