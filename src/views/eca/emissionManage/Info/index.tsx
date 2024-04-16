/*
 * @description: 添加、编辑、排放源详情
 */

import { useNavigate, useParams } from 'react-router-dom';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  TypeMapRoute,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  postComputationEmissionSourceAdd,
  postComputationEmissionSourceCopy,
  postComputationEmissionSourceEdit,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { updateUrl } from '@/utils';
import EmissionSourceComponent from '@/views/components/EmissionSource';
import { FACTOR_SELECT_WAY } from '@/views/components/EmissionSource/utils/constant';

import { useSetEmissionSourceInfo } from '../../hooks';

const EmissionSourceInfo = () => {
  const navigate = useNavigate();

  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  // 是否为新增页面
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  // 是否为复制页面
  const isCopy = pageTypeInfo === PageTypeInfo.copy;

  // 是否为详情页面
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  // 排放源ID
  const emissionSourceId = Number(id);

  // 排放源详情信息
  const emissionSourceDetailData = useSetEmissionSourceInfo(emissionSourceId);

  /** 确定/取消按钮的跳转 */
  const navigatePageTo = () => {
    navigate(EcaRouteMaps.emissionManage);
  };

  /** 选择按钮的跳转 */
  const navigateSelectPageTo = (path: TypeMapRoute) => {
    navigate(
      virtualLinkTransform(path, [PAGE_TYPE_VAR, ':id'], [pageTypeInfo, id]),
    );
  };

  return (
    <EmissionSourceComponent
      autoCreateSourceCode={isAdd || isCopy}
      readPretty={isDetail}
      emissionSourceId={emissionSourceId}
      activityDataVisible={false}
      noRequiredField='activityRecordWay,activityDept,activityCategory'
      emissionSourceDetailData={emissionSourceDetailData}
      onSelectFn={({ urlParamsData, factorType }) => {
        /** 选择因子 */
        if (factorType === FACTOR_SELECT_WAY.FACTOR) {
          navigateSelectPageTo(EcaRouteMaps.emissionManagInfoChoose);
          updateUrl({
            ...urlParamsData,
          });
        }
        /** 选择供应商数据 */
        if (factorType === FACTOR_SELECT_WAY.SUPPLIER) {
          navigateSelectPageTo(
            EcaRouteMaps.emissionManagInfoChooseSupplierData,
          );
          updateUrl({
            ...urlParamsData,
            likeProductName: urlParamsData.likeName,
          });
        }
      }}
      onConfirmFn={async data => {
        if (isCopy) {
          await postComputationEmissionSourceCopy({
            req: data,
          });
          navigatePageTo();
          return;
        }
        if (isAdd) {
          await postComputationEmissionSourceAdd({
            req: data,
          });
          navigatePageTo();
          return;
        }
        await postComputationEmissionSourceEdit({
          req: data,
        });
        navigatePageTo();
      }}
      onCancelFn={() => {
        navigatePageTo();
      }}
    />
  );
};
export default EmissionSourceInfo;
