/*
 * @@description: 供应链碳管理-碳数据填报-详情-数据填报-企业碳核算-核算过程-详情-排放源详情
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import { EmissionSource } from '@/sdks_v2/new/computationV2ApiDocs';
import {
  getSupplychainDataProcessComputationChooseSourceApplyInfoIdDataSourceId,
  getSupplychainDataProcessComputationSourceApplyInfoIdId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import EmissionSourceComponent from '@/views/components/EmissionSource';

function EmissionSourceInfo() {
  const { id, pageType, factorPageInfo, factorId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    pageType: string;
    basicInfo: string;
    factorPageInfo: PageTypeInfo;
    factorId: string;
  }>();

  // 是否为详情页面
  const isDetail = factorPageInfo === PageTypeInfo.show;

  // 排放源id
  const emissionSourceId = Number(factorId);

  /** 是否为企业碳核算的选择页面 */
  const isSelect = pageType === 'enterpriseSelect';

  /** 排放源详情 */
  const [emissionSourceData, setEmissionSourceData] =
    useState<EmissionSource>();

  /** 排放源详情的api */
  const emissionSourceDetailApi = isSelect
    ? getSupplychainDataProcessComputationChooseSourceApplyInfoIdDataSourceId
    : getSupplychainDataProcessComputationSourceApplyInfoIdId;

  /** 排放源详情接口 */
  useEffect(() => {
    if (id && factorId) {
      emissionSourceDetailApi({
        applyInfoId: Number(id),
        dataSourceId: Number(factorId),
        id: Number(factorId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setEmissionSourceData(data.data as EmissionSource);
        }
      });
    }
  }, [id, factorId]);

  return (
    <EmissionSourceComponent
      readPretty={isDetail}
      emissionSourceId={emissionSourceId}
      activityDataVisible
      emissionSourceDetailData={{
        ...emissionSourceData,
      }}
      isSetSupportFiles
      onCancelFn={() => {
        history.back();
      }}
    />
  );
}
export default EmissionSourceInfo;
