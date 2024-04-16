/*
 * @@description:
 */
/*
 * @@description:基准年
 */
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  EmissionStandard,
  getComputationEmissionStandardPage,
  getComputationEmissionStandardPageProps as SearchAPIProps,
} from '@/sdks/computation/computationV2ApiDocs';

import { columns, SearchSchema } from './utils/columns';

const Users = () => {
  const { refresh } = useTable();
  const navigate = useNavigate();

  const searchApi: CustomSearchProps<
    EmissionStandard,
    SearchAPIProps
  > = args => {
    return getComputationEmissionStandardPage(args).then(({ data }) => {
      return {
        rows: data?.data?.list || [],
        total: data?.data?.total || 0,
      };
    });
  };
  return (
    <Page
      title='基准年'
      onBtnClick={async () =>
        // TODO：很多处使用，封装成一个跳转函数。
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.baseYearInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        )
      }
      actionBtnChild={checkAuth(
        '/baseYearInfo/Add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<EmissionStandard, SearchAPIProps>
        searchProps={{
          schema: SearchSchema(),
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

export default withTable(Users);
