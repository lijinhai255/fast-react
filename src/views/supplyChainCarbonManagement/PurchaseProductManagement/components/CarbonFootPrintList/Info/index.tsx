/*
 * @@description: 供应链碳管理-采购产品管理-详情-产品碳足迹-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-25 15:23:30
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-19 00:24:05
 */
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import { getSupplychainApplyId } from '@/sdks_v2/new/supplychainV2ApiDocs';
import CarbonFootPrintInfo from '@/views/supplyChainCarbonManagement/components/CarbonFootPrintInfo';
import { TypeApplyInfoResp } from '@/views/supplyChainCarbonManagement/utils/type';

import style from '../../../../SupplierManagement/Info/index.module.less';

function Info() {
  const { carbonFootPrintId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    carbonFootPrintPageTypeInfo: PageTypeInfo;
    carbonFootPrintId: string;
  }>();

  /** 供应商碳数据概览和数据要求的详情 */
  const [cathRecord, setCathRecord] = useState<TypeApplyInfoResp>();

  /** 获取数据请求类型 1: 核算结果 2: 核算过程 */
  const [applyType, setApplyType] = useState<'1' | '2'>();

  /** 获取碳数据概览和数据要求的详情 */
  useEffect(() => {
    if (carbonFootPrintId) {
      getSupplychainApplyId({
        id: Number(carbonFootPrintId),
      }).then(({ data }) => {
        if (data.code === 200) {
          setCathRecord(data.data as TypeApplyInfoResp);
          setApplyType(data?.data?.applyType);
        }
      });
    }
  }, [carbonFootPrintId]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <CarbonFootPrintInfo
        id={carbonFootPrintId}
        disabled
        applyType={applyType}
        cathRecord={cathRecord}
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
