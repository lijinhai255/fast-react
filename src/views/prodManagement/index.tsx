/*
 * @@description: 新增 编辑 查看 运营数据
 */

import { PlusOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import { compact, isUndefined } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable, withTable } from 'table-render';

import { Page } from '@/components/Page';
import { TableRender } from '@/components/x-render/TableRender';
import type { CustomSearchProps } from '@/components/x-render/TableRender/types';
import { usePageNumberInfo } from '@/hooks';
import { checkAuth } from '@/layout/utills';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { ProRouteMaps } from '@/router/utils/prodEmums';
import {
  EmissionStandard,
  getComputationEmissionStandardPageProps as SearchAPIProps,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  OperationMetrics,
  getComputationOperationDataPage,
  getComputationOperationMetricsPage,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { updateUrl } from '@/utils';

import { OperateModel } from './components/OperateModel';
import { PageType, TypeChangeProManage, TypeCurrenModal } from './type';
import { SearchSchema, columns, opeSearchSchema } from './utils/columns';
import { prodColumns } from './utils/proDataColumns';
import { UseOrgs } from '../eca/hooks';

const Users = () => {
  const { refresh, doSearch, form } = useTable();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(TypeChangeProManage[0]);
  const { pageNum, pageSize, setSearchParams } = usePageNumberInfo();
  /*
   * 运营指标弹窗 显隐
   * **/
  const [open, setOpen] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [currentModal, setCurrentModal] = useState<PageType>(
    TypeCurrenModal.ADD,
  );
  const searchApi: CustomSearchProps<
    EmissionStandard,
    SearchAPIProps
  > = args => {
    const params = new URLSearchParams(window.location.search).get(
      'currentTab',
    );
    // 运营数据
    if (
      args.currentTab === TypeChangeProManage[1] ||
      (isUndefined(args.currentTab) && params === TypeChangeProManage[1])
    ) {
      return getComputationOperationMetricsPage(args).then(({ data }) => {
        return {
          rows: data?.data?.list || [],
          total: data?.data?.total || 0,
        };
      });
    }
    return getComputationOperationDataPage(args).then(({ data }) => {
      return {
        rows: data?.data?.list || [],
        total: data?.data?.total || 0,
      };
    });
  };
  // 编辑
  const editRecordFn = (record: OperationMetrics) => {
    setCurrentData(record);
    setOpen(true);
    setCurrentModal(TypeCurrenModal.EDIT);
  };
  useEffect(() => {
    updateUrl({
      currentTab: TypeChangeProManage[0],
    });
  }, []);
  const orgs = UseOrgs();

  return (
    <Page
      title='生产运营管理'
      onBtnClick={async () => {
        if (currentTab === TypeChangeProManage[0]) {
          navigate(
            virtualLinkTransform(
              ProRouteMaps.prodManagementOperationalData,
              [PAGE_TYPE_VAR, ':id'],
              [PageTypeInfo.add, 0],
            ),
          );
          return;
        }
        setOpen(true);
        setCurrentModal(TypeCurrenModal.ADD);
      }}
      actionBtnChild={checkAuth(
        currentTab === TypeChangeProManage[0]
          ? 'prodManagementOperationalData/add'
          : 'prodManagementDataOperationalIndicators/add',
        <div>
          <PlusOutlined /> 新增
        </div>,
      )}
    >
      <Tabs
        activeKey={currentTab}
        items={compact([
          checkAuth('/carbonAccounting/productionManagement/operational', {
            label: '运营数据',
            key: TypeChangeProManage[0],
          }),
          checkAuth('/carbonAccounting/productionManagement/indicators', {
            label: '运营指标',
            key: TypeChangeProManage[1],
          }),
        ])}
        onChange={e => {
          setCurrentTab(e);
          const formValues = form.getValues();
          refresh?.(
            {
              stay: false,
              tab: 0,
            },
            {
              ...formValues,
              currentTab: e,
            },
          );
          // 表单组织id 清空
          form.setValues({
            currentTab: e,
          });
          // 更新URL Search
          setSearchParams({
            ...formValues,
            currentTab: e,
          });
        }}
      />
      <TableRender<EmissionStandard, SearchAPIProps>
        searchProps={{
          schema:
            currentTab === TypeChangeProManage[0]
              ? SearchSchema(orgs || [])
              : opeSearchSchema(),
          api: searchApi,
          onSearch: searchInfo => {
            updateUrl({
              current: pageNum,
              pageSize,
              ...{ ...searchInfo },
              ...{
                currentTab,
              },
            });
          },
          searchBtnRender: (_, clearSearch) => {
            return [
              <Button
                onClick={() => {
                  doSearch?.({
                    current: 1,
                    pageSize,
                    ...{
                      currentTab,
                    },
                  });
                }}
              >
                查询
              </Button>,
              <Button
                onClick={() => {
                  clearSearch();
                }}
              >
                重置
              </Button>,
            ];
          },
        }}
        tableProps={{
          columns:
            currentTab === TypeChangeProManage[0]
              ? prodColumns({ refresh, navigate })
              : columns({ refresh, editRecordFn }),
          pagination: {
            size: 'default',
          },
        }}
        autoSaveSearchInfo
        autoAddIndexColumn
        autoFixNoText
      />
      {/* 运营指标弹窗 */}
      <OperateModel
        open={open}
        setOpen={setOpen}
        onCloseFn={() => {
          refresh?.(
            {
              stay: currentModal !== 'ADD',
              tab: 0,
            },
            {
              currentTab,
            },
          );
          setCurrentData({});
        }}
        currentData={currentData}
        currentModal={currentModal}
      />
    </Page>
  );
};

export default withTable(Users);
