import { Progress } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { ContributionAnalysisNode } from '../../type';

/** 贡献度分析 */
export const columns = (): ColumnsType<ContributionAnalysisNode> => [
  {
    title: '过程',
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
    render: value => {
      return (
        <Progress
          strokeColor={value > 0 ? '' : '#fda633'}
          percent={value ? Math.abs(value) : 0}
          format={() => (value ? `${value}%` : 0)}
          size='small'
        />
      );
    },
  },
];
