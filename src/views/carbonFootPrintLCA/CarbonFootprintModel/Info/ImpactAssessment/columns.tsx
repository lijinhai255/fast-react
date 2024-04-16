import type { ProColumns } from '@ant-design/pro-components';
import { compact } from 'lodash-es';

import { StageImpactAssessment } from '../../type';

export const columns = (): ProColumns<StageImpactAssessment>[] =>
  compact([
    {
      title: '生命周期阶段',
      dataIndex: 'name',
      ellipsis: true,
    },

    {
      title: '数值（kgCO₂e）',
      dataIndex: 'value',
      ellipsis: true,
    },
    {
      title: '百分比',
      dataIndex: 'percentage',
      ellipsis: true,
    },
  ]);
