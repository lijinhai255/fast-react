/*
 * @@description:
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-04-19 14:12:16
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-15 23:36:18
 */
import type { ColumnsType } from 'antd/es/table';

import { ProductionMaterials } from '@/sdks/footprintV2ApiDocs';
import EmissionAmount from '@/views/carbonFootPrint/AccountsManagement/AccountsModel/EmissionAmount';
import { TypeFootprintProcess } from '@/views/supplyChainCarbonManagement/utils/type';

export const columns = (): ColumnsType<TypeFootprintProcess> => [
  {
    title: '名称',
    dataIndex: 'materialName',
  },
  {
    title: '数量',
    dataIndex: 'weight',
    width: 280,
    render: (_, item) => (
      <EmissionAmount item={item as ProductionMaterials} disabled />
    ),
  },
  {
    title: '类型',
    dataIndex: 'materialsType',
  },
  {
    title: '排放因子',
    dataIndex: 'factorValue',
    render: (value, record) => {
      return value && record?.factorUnit
        ? `${value} ${record?.factorUnit}`
        : '-';
    },
  },
  {
    title: '排放量（kgCO₂e）',
    dataIndex: 'discharge',
  },
];
