/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-产品碳足迹-核算过程-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-05 10:59:33
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:55:55
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
  ProcessModel,
  getSupplychainDataProcessFootprintApplyInfoId,
  getSupplychainDataProcessFootprintChooseDetail,
  getSupplychainDataProcessFootprintChooseSourceList,
  getSupplychainDataProcessFootprintSourceList,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { SearchParamses } from '@/views/carbonFootPrint/utils/types';
import CarbonFootPrintProcess from '@/views/supplyChainCarbonManagement/components/CarbonFootPrintProcess';
import {
  TypeFootprintBase,
  TypeFootprintProcess,
} from '@/views/supplyChainCarbonManagement/utils/type';

import style from '../../CarbonAccounting/Info/index.module.less';

function Info() {
  const navigate = useNavigate();
  const { pageTypeInfo, id, pageType, productionBusinessId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    pageType: string;
    productionBusinessId: string;
  }>();

  /** 是否为产品碳足迹的填报核算的页面 */
  const isProductInfo = pageType === 'productInfo';

  /** 当前生命周期阶段 */
  const [currentMenu, changeCurrentMenu] = useState<ProcessModel>();

  /** 页码配置 */
  const [searchParams, setSearchParams] = useState<SearchParamses>({
    current: 1,
    pageSize: 10,
  });

  /** 产品碳足迹核算过程列表数据 */
  const [footprintProcess, setFootprintProcess] =
    useState<TypeFootprintProcess[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 表格loading */
  const [loading, changeLoading] = useState(false);

  /** 基本信息详情 */
  const [basicCathRecord, setBasicCathRecord] = useState<TypeFootprintBase>();

  /** 排放源列表接口的api */
  const emissionSourceListApi = isProductInfo
    ? getSupplychainDataProcessFootprintSourceList
    : getSupplychainDataProcessFootprintChooseSourceList;

  /** 核算基本信息的接口 */
  const basicInfoApi = isProductInfo
    ? getSupplychainDataProcessFootprintApplyInfoId
    : getSupplychainDataProcessFootprintChooseDetail;

  /** 获取产品碳足迹核算过程列表数据 */
  useEffect(() => {
    if (id && currentMenu && currentMenu.id) {
      changeLoading(true);
      emissionSourceListApi({
        applyInfoId: Number(id),
        pageNum: searchParams?.current || 1,
        pageSize: searchParams?.pageSize || 10,
        processModelId: currentMenu.id,
        productionBusinessId: Number(productionBusinessId),
      }).then(({ data }) => {
        if (data.code === 200) {
          changeLoading(false);
          setFootprintProcess(data.data?.list);
          setTotal(data.data?.total || 0);
        }
      });
    }
  }, [id, currentMenu, searchParams, productionBusinessId]);

  /** 获取基本信息详情 */
  useEffect(() => {
    if (id) {
      basicInfoApi({
        applyInfoId: Number(id),
        productionBusinessId: Number(productionBusinessId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setBasicCathRecord(data.data);
        }
      });
    }
  }, [id, productionBusinessId]);

  const basicInfo = {
    stage: currentMenu?.id,
    stageName: currentMenu?.modelName,
    functionalUnit: basicCathRecord?.functionalUnit,
    beginDate: basicCathRecord?.beginDate,
    endTime: basicCathRecord?.endTime,
  };

  return (
    <main className={style.wrapper}>
      <div className={style.wrapper_main}>
        <CarbonFootPrintProcess
          footprinProcess={footprintProcess}
          loading={loading}
          total={total}
          searchParams={searchParams}
          basicCathRecord={basicCathRecord}
          onChangeMenu={item => {
            changeCurrentMenu(item);
          }}
          onchange={(current: number, pageSize: number) => {
            setSearchParams({
              current,
              pageSize,
            });
          }}
          onDetailFactorClick={row => {
            if (isProductInfo) {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmFillInfoProductInfoEmissionSourceInfo,
                  [
                    PAGE_TYPE_VAR,
                    ':id',
                    ':pageType',
                    ':factorPageInfo',
                    ':factorId',
                    ':factorInfo',
                  ],
                  [
                    pageTypeInfo,
                    id,
                    pageType,
                    PageTypeInfo.show,
                    row?.id,
                    JSON.stringify(basicInfo),
                  ],
                ),
              );
            } else {
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmFillInfoProductSelectInfoEmissionSourceInfo,
                  [
                    PAGE_TYPE_VAR,
                    ':id',
                    ':pageType',
                    ':productionBusinessId',
                    ':factorPageInfo',
                    ':factorId',
                    ':factorInfo',
                  ],
                  [
                    pageTypeInfo,
                    id,
                    pageType,
                    productionBusinessId,
                    PageTypeInfo.show,
                    row?.id,
                    JSON.stringify(basicInfo),
                  ],
                ),
              );
            }
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
