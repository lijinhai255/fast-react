/**
 * @description 审批设置列表页面
 */
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { useAsyncEnums } from '@/hooks';
import { checkAuth } from '@/layout/utills';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';

import { columns } from './columns';
import { searchSchema } from './schemas';
import { getAuditSetList } from './service';
import { AuditResp, Request } from './type';
import { useOrgs } from '../organizations/OrgManage/hooks';

const Approval = () => {
  const navigate = useNavigate();

  const orgs = useOrgs();
  // 审批内容枚举
  const auditTypeEnum = useAsyncEnums('AuditType');

  const searchApi: CustomSearchProps<AuditResp, Request> = args =>
    getAuditSetList(args).then(({ data }) => {
      return data?.data || {};
    });

  return (
    <Page
      title='审批设置'
      actionBtnChild={checkAuth(
        '/sys/approval/add',
        <>
          <PlusOutlined /> 新增
        </>,
      )}
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            RouteMaps.systemApprovalInfo,
            [PAGE_TYPE_VAR, ':orgId', ':auditType'],
            [PageTypeInfo.add, 'null', 'null'],
          ),
        );
      }}
    >
      <TableRender<AuditResp, Request>
        searchProps={{
          schema: searchSchema(orgs, auditTypeEnum),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: columns(navigate),
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
    </Page>
  );
};

export default withTable(Approval);
