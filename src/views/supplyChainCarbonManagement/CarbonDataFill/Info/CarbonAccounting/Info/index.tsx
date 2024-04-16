/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-企业碳核算-核算过程-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-05 11:39:03
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:57:56
 */
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  ComputationProcess,
  getSupplychainDataProcessComputationChooseSourceList,
  getSupplychainDataProcessComputationSourceList,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import CarbonAccountingProcess from '@/views/supplyChainCarbonManagement/components/CarbonAccountingProcess';

import style from './index.module.less';

function Info() {
  const navigate = useNavigate();
  const { pageTypeInfo, id, pageType, basicInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    pageType: string;
    basicInfo: string;
  }>();

  /** 是否为企业碳核算的选择页面 */
  const isSelect = pageType === 'enterpriseSelect';

  /** 页码配置 */
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 核算过程列表 */
  const [computationProcess, setComputationProcess] =
    useState<ComputationProcess[]>();

  /** 表格数据总数 */
  const [tabaleTotal, setTabaleTotal] = useState<number>(0);

  /** 表格loading */
  const [loading, changeLoading] = useState(false);

  /** 页面顶部的基本信息 */
  const { orgName, year, total } = JSON.parse(basicInfo || '{}');

  /** 排放源列表的api */
  const emissionSourceListApi = isSelect
    ? getSupplychainDataProcessComputationChooseSourceList
    : getSupplychainDataProcessComputationSourceList;

  /** 获取核算过程列表 */
  useEffect(() => {
    if (id) {
      changeLoading(true);
      emissionSourceListApi({
        applyInfoId: Number(id),
        pageNum: searchParams?.current || 1,
        pageSize: searchParams?.pageSize || 10,
      }).then(({ data }) => {
        if (data.code === 200) {
          changeLoading(false);
          setComputationProcess(data.data?.list as ComputationProcess[]);
          setTabaleTotal(data.data?.total || 0);
        }
      });
    }
  }, [id, searchParams]);
  return (
    <main className={style.wrapper}>
      <div className={style.wrapper_main}>
        <CarbonAccountingProcess
          basicInfo={{
            核算组织: orgName || '-',
            核算年份: year || '-',
            '排放量汇总（tCO₂e）': total || '-',
          }}
          computationProcess={computationProcess}
          total={tabaleTotal}
          loading={loading}
          searchParams={searchParams}
          onchange={(current: number, pageSize: number) => {
            setSearchParams({
              current,
              pageSize,
            });
          }}
          onDetailClick={row => {
            navigate(
              virtualLinkTransform(
                isSelect
                  ? SccmRouteMaps.sccmFillInfoEnterpriseSelectInfoEmissonSourceInfo
                  : SccmRouteMaps.sccmFillInfoEnterpriseInfoEmissionSourceInfo,
                [
                  PAGE_TYPE_VAR,
                  ':id',
                  ':pageType',
                  ':basicInfo',
                  ':factorPageInfo',
                  ':factorId',
                ],
                [
                  pageTypeInfo,
                  id,
                  pageType,
                  basicInfo,
                  PageTypeInfo.show,
                  isSelect ? row?.emissionSourceId : row?.id,
                ],
              ),
            );
          }}
        />
      </div>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </main>
  );
}
export default Info;
