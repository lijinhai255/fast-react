/*
 * @@description: 供应商碳管理枚举
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 11:17:24
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:47:52
 */
import { useEffect, useState } from 'react';

import {
  EnumResp,
  getSupplychainEnumsEnumName,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

export const useSupplyChainEnums = (enumName: string) => {
  const [supplyChainenum, setSupplyChainenumEnum] = useState<EnumResp[]>();
  useEffect(() => {
    if (enumName) {
      getSupplychainEnumsEnumName({ enumName }).then(({ data }) => {
        if (data.code === 200) {
          setSupplyChainenumEnum(data.data);
        }
      });
    }
  }, [enumName]);
  return supplyChainenum;
};
