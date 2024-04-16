/*
 * @@description: 产品碳足迹-碳足迹核算-核算模型
 */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { TableRender } from '@/components/x-render/TableRender';
import submitSuccess from '@/image/submitSuccess.png';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ProcessModel,
  ProductionMaterials,
  getFootprintProcessModel,
  getFootprintProductionMaterials,
  getFootprintProductionMaterialsDownMaterials,
  getFootprintProductionMaterialsProps,
  putFootprintProductionMaterials,
} from '@/sdks/footprintV2ApiDocs';
import {
  Toast,
  changeTableColumsNoText,
  getSearchParams,
  updateUrl,
} from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import CommonHeader from '@/views/supplyChainCarbonManagement/components/CommonHeader';

import style from './index.module.less';
import { accountsModelTableColumns } from './utils/columns';
import { modelFooterBtnStyle } from '../../utils';
import { useAccountInfo } from '../hooks/useAccountInfo';

function AccountsModel() {
  const navigate = useNavigate();
  const { form, refresh, setTable } = useTable();

  const { pageTypeInfo, modelId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    modelId: string;
  }>();

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
  });

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.current) - 1) * Number(searchParams?.pageSize),
  );

  const processModelIdBack =
    new URLSearchParams(location.search).get('processModelId') || '';

  /** 用于修正第一次页码无法正常设置问题 */
  const isFirstLoad = useRef(true);

  /** 核算详情信息 */
  const accountsInfo = useAccountInfo(modelId);
  const { orgName, functionalUnit, beginDate, endTime } = accountsInfo || {};

  /** 左侧菜单列表 */
  const [menus, setMenus] = useState<ProcessModel[]>([]);

  /** 当前生命周期阶段 */
  const [currentTab, changeCurrentTab] = useState<ProcessModel>({});

  /** 获取左侧菜单列表 */
  useEffect(() => {
    if (accountsInfo && accountsInfo.type) {
      getFootprintProcessModel({
        type: accountsInfo.type,
        parentId: 0,
        page: 1,
        size: 10,
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data.data?.records || [];
          setMenus([...result]);
          const processModelIdBackItem = result.find(
            v => v.id === Number(processModelIdBack),
          );
          changeCurrentTab(processModelIdBackItem || result[0]);
          /** 刷新列表 */
          refresh?.(
            { stay: false, tab: 0 },
            {
              processModelId: processModelIdBack || result[0]?.id,
              productionBusinessId: modelId,
            },
          );
        }
      });
    }
  }, [accountsInfo]);

  /** 排放源列表数据 */
  const searchApi: SearchProps<ProductionMaterials>['api'] = ({
    current,
    pageSize,
    processModelId,
    productionBusinessId,
    ...args
  }) => {
    const pageNum =
      (isFirstLoad.current ? searchParams.current : current) || current;

    const search = {
      ...getSearchParams()[0],
    } as Partial<SearchParamses> &
      Partial<getFootprintProductionMaterialsProps>;
    let newSearch = { ...args, ...search, pageSize };
    if (!isFirstLoad.current) {
      newSearch = {
        ...args,
        current: pageNum,
        pageSize,
        processModelId,
        productionBusinessId,
      };
      updateUrl(newSearch);
    } else {
      form.setValues({ ...search });
    }

    setSearchParams({ ...newSearch, current: newSearch.current || 1 });
    isFirstLoad.current = false;
    const searchVals = {
      ...newSearch,
      page: current,
      size: pageSize,
    } as unknown as getFootprintProductionMaterialsProps;

    if (!processModelId || !productionBusinessId)
      return {
        rows: [],
        total: 0,
      } as unknown as Promise<{
        rows: ProductionMaterials[];
        total: number;
        pageSize?: number | undefined;
      }>;
    setTable?.({
      loading: true,
    });
    return getFootprintProductionMaterials(searchVals).then(({ data }) => {
      const result = data?.data || {};
      setTable?.({
        loading: false,
        dataSource: result?.records || [],
      });
      return {
        ...result,
        rows: result?.records || [],
        total: result.total || 0,
      };
    });
  };

  /** 导出排放源 */
  const exportExcel = () => {
    Modal.confirm({
      title: '导出排放数据',
      icon: '',
      content: (
        <div className={style.confirmContentWrapper}>
          <img className={style.icon} src={submitSuccess} alt='' />
          <p className={style.content}>导出排放源任务已创建</p>
          <p className={style.tips}>点击“确定”跳转到“下载管理”中下载</p>
        </div>
      ),
      ...modelFooterBtnStyle,
      onOk: () => {
        return getFootprintProductionMaterialsDownMaterials({
          pbId: Number(modelId),
        }).then(({ data }) => {
          if (data.code === 200) {
            navigate(RouteMaps.systemDownload);
          }
        });
      },
    });
  };

  /** 更新排放源数量 */
  const updateEmissionAmount = async (data: ProductionMaterials) => {
    const { processModelId, productionBusinessId } = data;
    const result = await putFootprintProductionMaterials({
      productionMaterials: data,
    });
    if (result.data.code === 200) {
      Toast('success', '更新成功');
      /** 刷新当前列表 */
      refresh?.(undefined, {
        processModelId,
        productionBusinessId,
      });
    }
  };
  /**
   * FIXME -  面包屑问题
   * 碳足迹核算->详情  https://carbonstop.feishu.cn/docx/S2DbduUjUoeGj8xJgfkc445unFe 17
   * DATE 20230614
   * 新增的路
   * */
  const culAccountDteail = () => {
    return window.location.pathname.indexOf('modalShow') >= 0;
  };

  return (
    <main className={style.accountsModelWrapper}>
      <div className={style.accountsModelHeader}>
        <CommonHeader
          basicInfo={{
            所属组织: orgName,
            功能单位: functionalUnit,
            核算周期: beginDate && endTime ? `${beginDate} 至 ${endTime}` : '-',
          }}
        />
        <div
          className={style.buttonWrapper}
          onClick={() => {
            navigate(
              virtualLinkTransform(
                RouteMaps.carbonFootPrintAccountsInfo,
                [PAGE_TYPE_VAR, ':id'],
                [PageTypeInfo.show, modelId],
              ),
            );
          }}
        >
          详情
        </div>
      </div>
      <div className={style.accountsModelMain}>
        <div className={style.accountsModelLeft}>
          <div className={style.accountsModelMenu}>
            {menus.map(item => (
              <div
                className={classNames(style.accountsModelMenuItem, {
                  [style.menuItemSelected]: currentTab?.id === item.id,
                })}
                key={item.id}
                onClick={() => {
                  changeCurrentTab(item);
                  refresh?.(
                    { stay: false, tab: 0 },
                    {
                      processModelId: item?.id,
                      productionBusinessId: modelId,
                    },
                  );
                }}
              >
                {item.modelName}
              </div>
            ))}
          </div>
          <div className={style.accountsModelExportBtn}>
            <Button className={style.exportBtn} onClick={exportExcel}>
              导出
            </Button>
          </div>
        </div>
        <div className={style.accountsModelRight}>
          {culAccountDteail()
            ? ''
            : !(pageTypeInfo && pageTypeInfo === 'show') && (
                <div className={style.accountsModelRightBtn}>
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => {
                      navigate(
                        virtualLinkTransform(
                          RouteMaps.carbonFootPrintAccountsModelInfo,
                          [
                            ':modelId',
                            PAGE_TYPE_VAR,
                            ':id',
                            ':stage',
                            ':stageName',
                          ],
                          [
                            modelId,
                            PageTypeInfo.add,
                            'null',
                            currentTab?.id,
                            currentTab?.modelName,
                          ],
                        ),
                      );
                    }}
                  >
                    新增
                  </Button>
                  <Button
                    className={style.importBtn}
                    onClick={() => {
                      navigate(
                        virtualLinkTransform(
                          RouteMaps.carbonFootPrintAccountsModelImport,
                          [':modelId'],
                          [modelId],
                        ),
                      );
                    }}
                  >
                    导入
                  </Button>
                </div>
              )}
          <TableRender
            searchProps={{
              hidden: true,
              schema: { type: 'void', properties: {} },
              searchOnMount: false,
              api: searchApi,
            }}
            tableProps={{
              columns: changeTableColumsNoText(
                [
                  ...indexColumn,
                  ...accountsModelTableColumns({
                    updateEmissionAmount,
                    navigate,
                    refresh,
                    currentTab,
                    isDetail: !!(isDetail || culAccountDteail()),
                  }),
                ],
                '-',
              ),
              scroll: { x: 1200 },
              pageChangeWithRequest: false,
              pagination: {
                pageSize: searchParams?.pageSize
                  ? +searchParams.pageSize
                  : undefined,
                current: searchParams?.current
                  ? +searchParams.current
                  : undefined,
                size: 'default',
                onChange: (page, pageSize) => {
                  searchApi({
                    current: page,
                    pageSize,
                    processModelId: currentTab?.id,
                    productionBusinessId: modelId,
                  });
                },
              },
            }}
          />
        </div>
      </div>
      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => {
              navigate(RouteMaps.carbonFootPrintAccounts);
            },
          },
        ]}
      />
    </main>
  );
}
export default withTable(AccountsModel);
