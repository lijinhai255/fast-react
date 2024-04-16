/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-产品碳足迹-核算过程-详情-排放因子详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-11 19:14:21
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 17:02:02
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import {
  FootprintProcess,
  ProductionMaterialsDto,
  getSupplychainDataProcessFootprintChooseSourceApplyInfoIdId,
  getSupplychainDataProcessFootprintSourceApplyInfoIdId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import EmissionFactor from '@/views/components/EmissionFactor';

type TypeProductionMaterialsDto = ProductionMaterialsDto | FootprintProcess;
function EmissionSourceFactorInfo() {
  const { id, pageType, factorPageInfo, factorInfo, factorId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    pageType: string;
    productionBusinessId: string;
    factorPageInfo: PageTypeInfo;
    factorId: string;
    factorInfo: string;
  }>();

  const { stageName, functionalUnit, beginDate, endTime } = JSON.parse(
    factorInfo || '{}',
  );

  /** 是否为新增页面 */
  const isAdd = factorPageInfo === PageTypeInfo.add;
  /** 是否为详情页面 */
  const isDetail = factorPageInfo === PageTypeInfo.show;

  /** 是否为产品碳足迹的详情页面 */
  const isProcessDetail = pageType === 'productInfo';

  /** 排放源详情 */
  const [emissionSourceFactorData, setEmissionSourceFactorData] =
    useState<TypeProductionMaterialsDto>();

  /** 排放源因子详情的api */
  const emissionSourceDetailApi = isProcessDetail
    ? getSupplychainDataProcessFootprintSourceApplyInfoIdId
    : getSupplychainDataProcessFootprintChooseSourceApplyInfoIdId;

  /** 排放源详情接口 */
  useEffect(() => {
    if (id && factorId) {
      emissionSourceDetailApi({
        applyInfoId: Number(id),
        id: Number(factorId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setEmissionSourceFactorData(data.data);
        }
      });
    }
  }, [id, factorId]);
  return (
    <EmissionFactor
      isAdd={isAdd}
      isDetail={isDetail}
      basicInfo={{
        功能单位: functionalUnit,
        核算周期: beginDate && endTime ? `${beginDate} 至 ${endTime}` : '',
        生命周期阶段: `${stageName}`,
      }}
      cathRecord={emissionSourceFactorData}
    />
  );
}
export default EmissionSourceFactorInfo;
