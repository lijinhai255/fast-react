/**
 * @description 用户列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
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
  Role,
  getSystemUserPageProps as SearchApiProps,
  UserResp,
  getSystemRolePage,
  getSystemUserPage,
} from '@/sdks/systemV2ApiDocs';

import { columns, searchSchema } from './columns';
import { useOrgs } from '../organizations/OrgManage/hooks';

const Users = () => {
  const { refresh } = useTable();
  const navigate = useNavigate();
  /* 组织列表 */
  const orgs = useOrgs();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条 角色列表
    getSystemRolePage({
      pageNum: 1,
      pageSize: 200,
      likeRoleName: '',
    }).then(({ data }) => {
      setRoles(data?.data?.list || []);
    });
  }, []);

  const searchApi: CustomSearchProps<UserResp, SearchApiProps> = args => {
    return getSystemUserPage(args).then(({ data }) => {
      return data?.data || {};
    });
  };
  return (
    <Page
      title='用户管理'
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            RouteMaps.usersInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 'null'],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/sys/user/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <TableRender<UserResp, SearchApiProps>
        searchProps={{
          schema: searchSchema({ orgs, roles }),
          api: searchApi,
          searchOnMount: false,
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
