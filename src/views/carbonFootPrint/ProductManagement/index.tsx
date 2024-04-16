/*
 * @@description:
 */
/*
 * @@description:
 */
/*
 * @@description: 产品碳足迹-产品管理
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Production,
  getFootprintProductionProps as SearchApiProps,
  getFootprintProduction,
} from '@/sdks/footprintV2ApiDocs';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import style from './index.module.less';
import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';

function Product() {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 产品列表 */
  const searchApi: CustomSearchProps<
    Production,
    SearchApiProps
  > = async args => {
    const { pageNum, pageSize } = args || {};
    const { data } = await getFootprintProduction({
      ...args,
      page: pageNum,
      size: pageSize,
    });
    return {
      ...data?.data,
    };
  };
  return (
    <Page
      wrapperClass={style.productWrapper}
      title='产品管理'
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            RouteMaps.carbonFootPrintProductInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 'null'],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/carbonFootPrint/product/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
      rightRender={[
        checkAuth(
          '/carbonFootPrint/product/import',
          <Button
            type='default'
            onClick={() => {
              navigate(RouteMaps.carbonFootPrintProductImport);
            }}
          >
            导入
          </Button>,
        ),
      ]}
    >
      <TableRender<Production, SearchApiProps>
        searchProps={{
          schema: searchSchema(orgList),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate, refresh }),
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />
    </Page>
  );
}
export default withTable(Product);
