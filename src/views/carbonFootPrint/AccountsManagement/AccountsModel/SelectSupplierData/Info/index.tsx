/*
 * @@description: 选择供应商数据
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  FootprintResult,
  getFootprintSupplierDataFootprintApplyInfoId,
} from '@/sdks_v2/new/footprintV2ApiDocs';
import CarbonFootPrintResult from '@/views/supplyChainCarbonManagement/components/CarbonFootPrintResult';

function SelectSupplierDataInfo() {
  const { applyInfoId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    modelId: string;
    stage: string;
    stageName: string;
    applyInfoId: string;
  }>();

  const [footprintResult, setFootprintResult] = useState<FootprintResult>();

  useEffect(() => {
    getFootprintSupplierDataFootprintApplyInfoId({
      applyInfoId: Number(applyInfoId),
    }).then(({ data }) => {
      if (data.code === 200) {
        setFootprintResult(data.data);
      }
    });
  }, []);
  return (
    <div>
      <CarbonFootPrintResult
        currentModalType='supplierSelect'
        disabled
        cathRecord={{
          periodType: footprintResult?.periodType,
        }}
        footprintResult={footprintResult}
      />

      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => {
              history.back();
            },
          },
        ]}
      />
    </div>
  );
}
export default SelectSupplierDataInfo;
