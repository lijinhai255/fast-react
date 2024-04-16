/*
 * @@description: 产品枚举
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-13 18:48:53
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-03-21 15:40:47
 */
import { useEffect, useState } from 'react';

import {
  getFootprintProduction,
  getFootprintProductionProps,
  Production,
} from '@/sdks/footprintV2ApiDocs';

export const useProducts = () => {
  const [products, setProducts] = useState<Production[]>([]);

  const onGetProductsListFn = () => {
    const params = {
      page: 1,
      size: 10000,
    };
    getFootprintProduction(params as getFootprintProductionProps).then(
      ({ data }) => {
        if (data.code === 200) {
          const list = data.data?.records || [];
          const productList = list.map(item => ({
            label: `${item.productionName}  ${item.productionCode} `,
            value: item.id,
            ...item,
          }));
          setProducts(productList);
        }
      },
    );
  };
  useEffect(() => {
    onGetProductsListFn();
  }, []);
  return products;
};
