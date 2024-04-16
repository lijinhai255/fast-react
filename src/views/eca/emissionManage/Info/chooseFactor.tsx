/*
 * @@description:选择排放因子
 */

import { useNavigate, useParams } from 'react-router-dom';
import { withTable } from 'table-render';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { Factor } from '@/sdks/systemV2ApiDocs';
import { updateUrl } from '@/utils';

import ChooseFactorComponent from '../../component/chooseFactor';
import { ParamsProp } from '../../component/chooseFactor/type';

const Factors = () => {
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();
  const navigate = useNavigate();

  return (
    <ChooseFactorComponent
      onDetailClick={(row: Factor) => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.emissionManagInfoChooseDetail,
            [PAGE_TYPE_VAR, ':factorPageInfo', ':id', ':factorId'],
            [pageTypeInfo, PageTypeInfo.show, id, row.id],
          ),
        );
      }}
      onConfirmClick={(data: ParamsProp) => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.emissionManagInfo,
            [PAGE_TYPE_VAR, ':id'],
            [pageTypeInfo, id],
          ),
        );
        updateUrl(data);
      }}
      onCancelClick={(data: ParamsProp) => {
        navigate(
          virtualLinkTransform(
            EcaRouteMaps.emissionManagInfo,
            [PAGE_TYPE_VAR, ':id'],
            [pageTypeInfo, id],
          ),
        );
        updateUrl(data);
      }}
    />
  );
};

export default withTable(Factors);
