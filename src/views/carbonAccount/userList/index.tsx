/*
 * @@description:用户列表
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import { checkAuth } from '@/layout/utills';
import { CaRouteMaps } from '@/router/utils/caEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  getAccountsystemAccountFileDownloadFile,
  getAccountsystemUser,
  getAccountsystemUserProps,
  User,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';

import { columns, SearchSchema } from './columns';
import style from './index.module.less';
import { modelFooterBtnStyle } from '../util';

const Users = () => {
  // 弹窗表单赋值
  const [searchParams, setSearchParams] = useState<getAccountsystemUserProps>(
    getSearchParams<getAccountsystemUserProps>()[0],
  );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getAccountsystemUserProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    const search = {
      ...getSearchParams()[0],
    } as Partial<SearchParamses> & Partial<getAccountsystemUserProps>;
    let newSearch = {
      ...args,
      ...search,
      pageNum,
    } as getAccountsystemUserProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        current: pageNum,
        pageNum,
      } as getAccountsystemUserProps;
      updateUrl(newSearch);
    } else {
      form.setValues({ ...search });
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getAccountsystemUser({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.records,
        total: data?.data?.total,
      };
    });
  };
  // 复制、编辑 查看
  const editFn = (record: User) => {
    navigate(
      virtualLinkTransform(
        CaRouteMaps.userListInfo,
        [PAGE_TYPE_VAR, ':id'],
        [PageTypeInfo.edit, record.id || 0],
      ),
    );
  };

  /** 导出排放源 */
  const exportExcel = () => {
    Modal.confirm({
      title: '导出数据',
      icon: '',
      content: (
        <div className={style.confirmContentWrapper}>
          {/* <img className={style.icon} src={submitSuccess} alt='' /> */}
          {/* <p className={style.content}>导出排放源任务已创建</p> */}
          <p className={style.tips}>
            导出排放源任务已创建，点击“确定”跳转到“下载管理”中下载
          </p>
        </div>
      ),
      ...modelFooterBtnStyle,
      onOk: () => {
        const search = {
          ...getSearchParams()[0],
        };
        // console.log(search, 'search');
        const newVal = {
          userInfo: search?.userInfo,
          deptId: Number(search?.deptId),
          userStatus: Number(search?.userStatus),
          userNumber: search?.userNumber,
        };
        return getAccountsystemAccountFileDownloadFile({ ...newVal }).then(
          ({ data }) => {
            if (data.code === 200) {
              navigate(RouteMaps.systemDownload);
            }
          },
        );
      },
    });
  };

  return (
    <Page
      wrapperClass={style.wrapper}
      title='用户列表'
      onBtnClick={async () => {
        navigate(
          virtualLinkTransform(
            CaRouteMaps.userListInfo,
            [PAGE_TYPE_VAR, ':id'],
            [PageTypeInfo.add, 0],
          ),
        );
      }}
      actionBtnChild={checkAuth(
        '/carbonAccount/userList/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
      rightRender={[
        checkAuth(
          '/carbonAccount/userList/import',
          <Button
            type='default'
            onClick={() => {
              navigate(CaRouteMaps.userListImport);
            }}
          >
            导入
          </Button>,
        ),
        checkAuth(
          '/carbonAccount/userList/export',
          <Button type='default' onClick={exportExcel}>
            导出
          </Button>,
        ),
      ]}
    >
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [...indexColumn, ...columns({ refresh, navigate, editFn })],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1500 },
        }}
      />
    </Page>
  );
};

export default withTable(Users);
