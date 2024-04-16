/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 10:52:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-05-22 11:07:24
 */
import { TableRenderProps } from 'table-render/dist/src/types';

import { Product } from '@/sdks_v2/new/supplychainV2ApiDocs';

export const columns = (): TableRenderProps<Product>['columns'] => [
  {
    title: '产品名称',
    dataIndex: 'productName',
  },
  {
    title: '所属组织',
    dataIndex: 'orgName',
  },
  {
    title: '规格/型号',
    dataIndex: 'productModel',
  },
  {
    title: '核算单位',
    dataIndex: 'productUnit',
  },
  {
    title: '产品描述',
    dataIndex: 'productDesc',
  },
];
