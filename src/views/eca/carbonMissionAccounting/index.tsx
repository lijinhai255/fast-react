/*
 * @@description:碳排放核算
 */
import { PlusOutlined } from '@ant-design/icons';
import style from '@views/carbonFootPrint/AccountsManagement/AccountsModel/index.module.less';
import { Modal } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import submitSuccess from '@/image/submitSuccess.png';
import { checkAuth } from '@/layout/utills';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Computation,
  getComputationComputationExport,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  getComputationComputationPage,
  getComputationComputationPageProps,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  changeTableColumsNoText,
  getSearchParams,
  returnNoIconModalStyle,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { SearchSchema, columns } from './utils/columns';
import { EmissionListModel } from './utils/model';

const Users = () => {
  const [open, changeOpen] = useState(false);
  const [catchRecord, getCatchRecord] = useState<Computation>({});
  const [searchParams, setSearchParams] =
    useState<getComputationComputationPageProps>(
      getSearchParams<getComputationComputationPageProps>()[0],
    );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getComputationComputationPageProps>['api'] = ({
    current,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.pageNum : current) || current;
    let newSearch = {
      ...args,
      ...searchParams,
      pageNum,
    } as getComputationComputationPageProps;
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        pageNum,
      } as getComputationComputationPageProps;
      updateUrl(args);
    } else {
      form.setValues(newSearch);
    }
    setSearchParams({
      ...newSearch,
    });
    isFirstLoad.current = false;
    return getComputationComputationPage({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  const showEmissionListFn = (record: Computation) => {
    changeOpen(true);
    getCatchRecord({ ...record });
  };

  return (
    <Page
      title='碳排放核算'
      actionBtnChildArr={[
        {
          button: checkAuth(
            '/carbonMissionAccountingInfo/add',
            <div>
              <PlusOutlined /> 新增
            </div>,
          ),
          click: () =>
            navigate(
              virtualLinkTransform(
                EcaRouteMaps.carbonMissionAccountingInfo,
                [PAGE_TYPE_VAR, ':id'],
                [PageTypeInfo.add, 0],
              ),
            ),
        },
        {
          button: checkAuth(
            '/carbonMissionAccountingInfo/Export',
            <div>导出</div>,
          ),
          click: () => {
            getComputationComputationExport({
              orgId: searchParams?.orgId,
              year: searchParams?.year,
            }).then(({ data }) => {
              if (data.code === 200) {
                Modal.confirm({
                  title: '导出排放数据',
                  ...returnNoIconModalStyle,
                  content: (
                    <div
                      className={style.confirmContentWrapper}
                      style={{ marginLeft: '-30px' }}
                    >
                      <img className={style.icon} src={submitSuccess} alt='' />

                      <p className={style.content}>导出排放数据的任务已创建</p>
                      <p className={style.tips}>
                        点击“确定”跳转到“下载管理”中下载
                      </p>
                    </div>
                  ),
                  onOk: async () => {
                    navigate(RouteMaps.systemDownload);
                  },
                });
              }
            });
          },
        },
      ]}
    >
      <TableRender
        searchProps={{
          schema: SearchSchema(),
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...columns({ refresh, navigate, showEmissionListFn }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1200 },
        }}
      />
      <EmissionListModel
        onCancel={() => {
          changeOpen(false);
        }}
        open={open}
        catchRecord={{ ...catchRecord }}
      />
    </Page>
  );
};

export default withTable(Users);
