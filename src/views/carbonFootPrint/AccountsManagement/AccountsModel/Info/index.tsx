/*
 * @@description: 产品碳足迹-碳足迹核算-核算模型-排放源
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-10 11:20:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 15:01:47
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ProductionMaterials,
  getFootprintProductionMaterialsId,
  postFootprintProductionMaterials,
  putFootprintProductionMaterials,
} from '@/sdks/footprintV2ApiDocs';
import { Toast, updateUrl } from '@/utils';
import EmissionFactor from '@/views/components/EmissionFactor';

import { useAccountInfo } from '../../hooks/useAccountInfo';

function AccountsModelInfo() {
  const navigate = useNavigate();
  const { pageTypeInfo, id, modelId, stage, stageName } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    modelId: string;
    stage: string;
    stageName: string;
  }>();

  /** 核算详情信息 */
  const accountsInfo = useAccountInfo(modelId);
  const { functionalUnit, beginDate, endTime, type } = accountsInfo || {};

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 排放因子详情 */
  const [cathRecord, setCathRecord] = useState<ProductionMaterials>();

  /** 排放因子接口 */
  const emissionFactorApi = isAdd
    ? postFootprintProductionMaterials
    : putFootprintProductionMaterials;

  /** 排放源详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getFootprintProductionMaterialsId({ id }).then(({ data }) => {
        if (data.code === 200) {
          setCathRecord(data?.data);
        }
      });
    }
  }, [id, pageTypeInfo]);

  /** 保存/取消 页面跳转 */
  const navigatePageTo = () => {
    navigate(
      virtualLinkTransform(
        RouteMaps.carbonFootPrintAccountsModel,
        [':modelId'],
        [Number(modelId)],
      ),
    );
    updateUrl({ processModelId: stage });
  };

  return (
    <EmissionFactor
      isAdd={isAdd}
      isDetail={isDetail}
      stage={stage}
      basicInfo={{
        功能单位: functionalUnit,
        核算周期: beginDate && endTime ? `${beginDate} 至 ${endTime}` : '',
        生命周期阶段: `${stageName}`,
      }}
      cathRecord={cathRecord}
      onSelectFactorNavigate={emissionDataParams => {
        navigate(
          virtualLinkTransform(
            RouteMaps.carbonFootPrintAccountsSelectEmissionFactor,
            [':modelId', PAGE_TYPE_VAR, ':id', ':stage', ':stageName'],
            [modelId, pageTypeInfo, id, stage, stageName],
          ),
        );
        updateUrl({ ...emissionDataParams });
      }}
      onSelectSupplierNavigate={emissionDataParams => {
        navigate(
          virtualLinkTransform(
            RouteMaps.carbonFootPrintAccountsSelectSupplierData,
            [':modelId', PAGE_TYPE_VAR, ':id', ':stage', ':stageName'],
            [modelId, pageTypeInfo, id, stage, stageName],
          ),
        );
        updateUrl({ ...emissionDataParams });
      }}
      onSave={result => {
        emissionFactorApi({
          productionMaterials: {
            ...result,
            processModelId: Number(stage),
            productionBusinessId: Number(modelId),
            processModelParentId: 0,
            type,
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            Toast('success', '保存成功');
            navigatePageTo();
          }
        });
      }}
      onCancel={() => {
        navigatePageTo();
      }}
    />
  );
}
export default AccountsModelInfo;
