import { TabsProps } from 'antd';

export const TAB_TYPE = {
  /** 贡献度分析 */
  CONTRIBUTION_ANALYSIS: '1',
  /** 灵敏度分析 */
  SENSITIVITY_ANALYSIS: '2',
  /** 不确定性分析 */
  UNCERTAINTY_ANALYSIS: '3',
  /** 数据质量评价 */
  DATA_QUALITY_EVALUATION: '4',
} as const;

const {
  CONTRIBUTION_ANALYSIS,
  // SENSITIVITY_ANALYSIS,
  // UNCERTAINTY_ANALYSIS,
  // DATA_QUALITY_EVALUATION,
} = TAB_TYPE;

export const TAB_OPTIONS: TabsProps['items'] = [
  {
    key: CONTRIBUTION_ANALYSIS,
    label: '贡献度分析',
  },
  /** 第二期 */
  // {
  //   key: SENSITIVITY_ANALYSIS,
  //   label: '灵敏度分析',
  //   disabled: true,
  // },
  // {
  //   key: UNCERTAINTY_ANALYSIS,
  //   label: '不确定性分析',
  //   disabled: true,
  // },
  // {
  //   key: DATA_QUALITY_EVALUATION,
  //   label: '数据质量评价',
  //   disabled: true,
  // },
];
