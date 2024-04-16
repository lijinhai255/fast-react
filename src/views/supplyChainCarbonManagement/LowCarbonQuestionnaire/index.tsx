/*
 * @@description:
 */
/*
 * @@description: 供应链碳管理-低碳问卷-列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  getSupplychainQuestionnairePage,
  getSupplychainQuestionnairePageProps,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import QuestionnaireInfoDrawer from './components/QuestionnaireInfoDrawer';
import style from './index.module.less';
import { ColumnsType, columns } from './utils/columns';
import { searchSchema } from './utils/schemas';
import { RowType } from '../utils/type';

function SupplierManagement() {
  const navigate = useNavigate();
  const { refresh } = useTable();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 状态 */
  const questionnaireStatusOptions = [
    {
      code: 0,
      name: '未发布',
    },
    {
      code: 1,
      name: '已发布',
    },
    {
      code: 2,
      name: '已结束',
    },
  ];

  /** 低碳问卷列表 */
  const searchApi: CustomSearchProps<
    ColumnsType,
    getSupplychainQuestionnairePageProps
  > = async args => {
    const { pageNum, pageSize } = args || {};
    const { data } = await getSupplychainQuestionnairePage({
      ...args,
      pageNum,
      pageSize,
    });
    return {
      ...data?.data,
    };
  };

  /** 查看-抽屉显隐 */
  const [drawerOpen, setDrawerOpen] = useState(false);

  /** 保存当前行信息-带到抽屉 */
  const [baseInfoData, setBaseInfoData] = useState<RowType>();

  /** 查看-抽屉显隐方法 */
  const drawerOpenFn = (value: boolean, row?: RowType) => {
    setBaseInfoData(row);
    setDrawerOpen(value);
  };

  return (
    <Page
      wrapperClass={style.supplyManagementWrapper}
      title='低碳问卷'
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            SccmRouteMaps.sccmQuestionnaireInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 'null'],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/supplyChain/questionnaire/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender
        searchProps={{
          schema: searchSchema(orgList, questionnaireStatusOptions),
          api: searchApi,
        }}
        tableProps={{
          columns: columns({ navigate, refresh, drawerOpenFn }),
          scroll: { x: 1600 },
        }}
        autoAddIndexColumn
        autoFixNoText
        autoSaveSearchInfo
      />

      <QuestionnaireInfoDrawer
        open={drawerOpen}
        drawerOpenFn={drawerOpenFn}
        baseInfoData={baseInfoData}
      />
    </Page>
  );
}
export default withTable(SupplierManagement);
