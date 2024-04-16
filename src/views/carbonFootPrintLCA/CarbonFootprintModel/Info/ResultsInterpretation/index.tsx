/**
 * @description 结果解释
 */

import { Tabs, Table } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { IconFont } from '@/components/IconFont';
import { usePageInfo, useTableScrollHeight } from '@/hooks';

import { columns } from './columns';
import { TAB_OPTIONS, TAB_TYPE } from './constant';
import style from './index.module.less';
import { getContributionAnalysisList } from '../../service';
import { ContributionAnalysisNode } from '../../type';

const { CONTRIBUTION_ANALYSIS } = TAB_TYPE;

const ResultsInterpretation = ({
  onBackClick,
}: {
  /** 返回的方法 */
  onBackClick: () => void;
}) => {
  const { id } = usePageInfo();

  const scrollY = useTableScrollHeight();

  /** 当前的Tab */
  const [currentTab, setCurrentTab] = useState<string>(CONTRIBUTION_ANALYSIS);

  /** 贡献度分析的表格数据 */
  const [contributionAnalysisDataSource, setContributionAnalysisDataSource] =
    useState<ContributionAnalysisNode[]>();

  /** 获取表格数据 */
  useEffect(() => {
    if (id && currentTab) {
      switch (currentTab) {
        /** 贡献度分析 */
        case CONTRIBUTION_ANALYSIS:
          getContributionAnalysisList({
            modelId: id,
          }).then(({ data }) => {
            setContributionAnalysisDataSource(data?.data);
          });
          break;
        default:
          break;
      }
    }
  }, [id, currentTab]);

  return (
    <div className={style.wrap}>
      <Tabs
        activeKey={currentTab}
        items={TAB_OPTIONS}
        onChange={key => {
          setCurrentTab(key);
        }}
      />
      <div className={style.tableWrapper}>
        {currentTab === CONTRIBUTION_ANALYSIS && (
          <Table
            columns={columns()}
            dataSource={contributionAnalysisDataSource}
            pagination={false}
            scroll={{ y: scrollY }}
            expandable={{
              expandRowByClick: true,
              indentSize: 22,
              // eslint-disable-next-line react/no-unstable-nested-components
              expandIcon: ({ expanded, record }) => {
                // eslint-disable-next-line no-nested-ternary
                return record.children ? (
                  expanded ? (
                    <IconFont
                      className={style.icon}
                      icon='icon-icon-fucengshouqi'
                    />
                  ) : (
                    <IconFont
                      className={classNames(style.icon, style.expandIcon)}
                      icon='icon-icon-fucengshouqi'
                    />
                  )
                ) : (
                  ''
                );
              },
            }}
            rowKey='id'
          />
        )}
      </div>
      <FormActions
        className='footWrapper'
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              onBackClick();
            },
          },
        ])}
      />
    </div>
  );
};
export default ResultsInterpretation;
