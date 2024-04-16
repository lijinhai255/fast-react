/*
 * @@description: 获取供应商详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-22 16:29:24
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:41:06
 */
import { useEffect, useState } from 'react';

import {
  Supplier,
  getSupplychainSupplierId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

export const useSupplierManagementDetail = (id?: string) => {
  const [supplyManagementInfo, setSupplyManagementInfo] = useState<Supplier>();
  useEffect(() => {
    if (id && id !== 'null') {
      getSupplychainSupplierId({ id: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          setSupplyManagementInfo(data?.data);
        }
      });
    }
  }, [id]);
  return supplyManagementInfo;
};
