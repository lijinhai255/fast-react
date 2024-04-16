/*
 * @@description: 供应链碳管理-供应商管理-详情-企业碳核算-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-11 17:56:11
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:26:52
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
import { getSupplychainApplyId } from '@/sdks_v2/new/supplychainV2ApiDocs';
import CarbonAccountingInfo from '@/views/supplyChainCarbonManagement/components/CarbonAccountingInfo';
import { TypeApplyInfoResp } from '@/views/supplyChainCarbonManagement/utils/type';

import style from '../../../Info/index.module.less';

function Info() {
  const navigate = useNavigate();
  const { pageTypeInfo, id, accountingPageTypeInfo, accountingId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    accountingPageTypeInfo: PageTypeInfo;
    accountingId: string;
  }>();

  /** 供应商碳数据概览和数据要求的详情 */
  const [cathRecord, setCathRecord] = useState<TypeApplyInfoResp>();

  /** 获取数据请求类型 1: 核算结果 2: 核算过程 */
  const [applyType, setApplyType] = useState<'1' | '2'>();

  /** 获取碳数据概览和数据要求的详情 */
  useEffect(() => {
    if (accountingId) {
      getSupplychainApplyId({
        id: Number(accountingId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setCathRecord(data.data as TypeApplyInfoResp);
          setApplyType(data?.data?.applyType);
        }
      });
    }
  }, [accountingId]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <CarbonAccountingInfo
        id={accountingId}
        disabled
        applyType={applyType}
        cathRecord={cathRecord}
        onDetailClick={row => {
          navigate(
            virtualLinkTransform(
              SccmRouteMaps.sccmManagementInfoCarbonAccountingInfoEmissionSourceInfo,
              [
                PAGE_TYPE_VAR,
                ':id',
                ':accountingPageTypeInfo',
                ':accountingId',
                ':factorPageInfo',
                ':factorId',
              ],
              [
                pageTypeInfo,
                id,
                accountingPageTypeInfo,
                accountingId,
                PageTypeInfo.show,
                row?.id,
              ],
            ),
          );
        }}
      />
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
    </div>
  );
}
export default Info;
