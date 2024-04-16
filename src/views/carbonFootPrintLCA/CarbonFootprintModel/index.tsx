/*
 * @@description:
 */
/**
 * @description 碳足迹模型列表页
 */

import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getModelList } from './service';
import { Model, Request } from './type';

const CarbonFootprintModel = () => {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  const searchApi: CustomSearchProps<Model, Request> = args =>
    getModelList(args).then(({ data }) => {
      return data?.data;
    });

  return (
    <Page
      title='碳足迹模型'
      onBtnClick={async () => {
        navigate(
          LCARouteMaps.lcaModelInfo.replace(
            ':pageTypeInfo',
            `${PageTypeInfo.add}`,
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/carbonFootprintLCA/model/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<Model, Request>
        searchProps={{
          schema: searchSchema(orgList),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ refresh, navigate }),
          scroll: { x: 1800 },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};
export default withTable(CarbonFootprintModel);
