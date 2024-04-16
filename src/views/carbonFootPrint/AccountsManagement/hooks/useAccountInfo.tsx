/*
 * @@description: 核算模型详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-14 23:13:28
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 17:37:45
 */
import { useState, useEffect } from 'react';

import {
  getFootprintProductionBusinessId,
  ProductionBusiness,
} from '@/sdks/footprintV2ApiDocs';

export const useAccountInfo = (id?: string) => {
  const [accountInfo, setAccountInfo] = useState<ProductionBusiness>();

  useEffect(() => {
    if (id) {
      getFootprintProductionBusinessId({ id }).then(({ data }) => {
        if (data.code === 200) {
          setAccountInfo(data?.data);
        }
      });
    }
  }, [id]);
  return accountInfo;
};
