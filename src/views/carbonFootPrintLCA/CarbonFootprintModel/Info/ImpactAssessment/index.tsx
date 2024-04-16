/**
 * @description 影响评价
 */
import { ProTable } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import { cloneDeep, compact, keyBy, reverse } from 'lodash-es';
import { useMemo, useRef, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { IconFont } from '@/components/IconFont';
import { usePageInfo } from '@/hooks';

import { columns } from './columns';
import style from './index.module.less';
import { getImpactAssessmentData } from '../../service';
import { StageImpactAssessment } from '../../type';

const ImpactAssessment = ({
  onNextStepClick,
  onBackClick,
}: {
  /** 点击下一步的方法 */
  onNextStepClick: () => void;
  /** 返回的方法 */
  onBackClick: () => void;
}) => {
  const { isDetail, id } = usePageInfo();

  const tableRef = useRef<ActionType>();

  const columnsStateDefault = useMemo(() => {
    return keyBy(columns, 'dataIndex');
  }, []);

  /** 生命周期阶段的影响评价 */
  const [stageImpactAssessmentsData, setStageImpactAssessmentsData] =
    useState<StageImpactAssessment[]>();

  const stageImpactAssessmentsChartsData = reverse(
    cloneDeep(stageImpactAssessmentsData || []),
  );

  /** 总排放量 */
  const [emissionTotal, setEmissionTotal] = useState<number>();

  const option = {
    title: {
      subtext: '(单位：kgCO₂e)',
      textStyle: {
        color: '#999EA4',
        fontWeight: 400,
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      containLabel: true,
      top: 38,
      left: 0,
      right: 24,
      bottom: 16,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#999EA4',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#D2D6DA',
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#D2D6DA',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: stageImpactAssessmentsChartsData?.map(v => v.name),
      axisLabel: {
        color: '#343A40',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#D2D6DA',
        },
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    series: [
      {
        type: 'bar',
        barWidth: 16,
        data: stageImpactAssessmentsChartsData?.map(v => v.value),
        color: '#0CBF9F',
      },
    ],
  };

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.main}>
          {/* 总排放量 */}
          <div className={style.carbonTotalWrap}>
            <span className={style.iconWrap}>
              <IconFont className={style.icon} icon='icon-ditanguanli' />
            </span>
            <span className={style.totalTitle}>总排放量</span>
            <span className={style.carbonTotal}>
              {emissionTotal ?? '-'}
              <span className={style.unit}>kgCO₂e</span>
            </span>
          </div>
          {/* 图表部分 */}
          {stageImpactAssessmentsData &&
          stageImpactAssessmentsData.length > 0 ? (
            <div className={style.chartWrap}>
              <ReactECharts
                className={style.chart}
                key={new Date().getTime()}
                option={option}
              />
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
        {/* 表格部分 */}
        <ProTable<StageImpactAssessment>
          columns={columns()}
          actionRef={tableRef}
          pagination={false}
          search={false}
          columnsState={{
            persistenceKey: 'ProcessModalTable',
            persistenceType: 'localStorage',
            defaultValue: columnsStateDefault,
          }}
          toolBarRender={false}
          params={{
            modelId: id,
          }}
          request={async params => {
            const { modelId } = params || {};
            return getImpactAssessmentData({
              modelId,
            }).then(({ data }) => {
              setStageImpactAssessmentsData(data?.data?.stageImpactAssessments);
              setEmissionTotal(data?.data?.total);
              return {
                data: data?.data?.stageImpactAssessments,
                success: true,
              };
            });
          }}
        />
      </div>

      <FormActions
        className='footWrapper'
        place='center'
        buttons={compact([
          !isDetail && {
            title: '下一步',
            type: 'primary',
            onClick: async () => {
              onNextStepClick();
            },
          },
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
export default ImpactAssessment;
