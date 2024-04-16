/**
 * @deprecated TOP排放源/排放类别
 */
import {
  LightFilter,
  ProFormInstance,
  ProFormRadio,
} from '@ant-design/pro-components';
import { Col, Row, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { FC, useEffect, useRef, useState } from 'react';

import {
  SimpleBarChartResp,
  getComputationDataDashboardEmissionSourceList,
  getComputationDataDashboardTopEmissionClassify,
  getComputationDataDashboardTopEmissionSource,
  postComputationDataDashboardDownloadEmissionSourceList,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { changeTableColumnsNoText } from '@/utils';

import { EmissionListType, columns } from './columns';
import style from './index.module.less';
import {
  downloadFile,
  generateImgName,
  getMergeData,
  useDownloadHandler,
} from '../commonFn';
import DownloadIcon from '../component/DownloadIcon';
import { ProYearSelect } from '../component/ProSelect';
import {
  BUTTON,
  BUTTON_OPTION,
  COMMON_BAR_WIDTH,
  EMISSION_BUTTON,
  EMISSION_BUTTON_OPTION,
} from '../constant';
import { CommonProps } from '../type';

type GetOptionType = ({
  emissionData,
  barColor,
}: {
  emissionData: SimpleBarChartResp;
  barColor?: string;
}) => echarts.EChartsOption;

/** 组织名称 */
let orgName = '';

const TopEmission: FC<CommonProps> = ({
  topSearchFormValues,
  selectOrgName,
}) => {
  const topEmissionSearchForm = useRef<ProFormInstance>();

  const listSearchForm = useRef<ProFormInstance>();

  /** top5排放源数据 */
  const [topEmissionData, setTopEmissionData] = useState<SimpleBarChartResp>();

  /** top5排放类别数据 */
  const [topTypeData, setTopTypeData] = useState<SimpleBarChartResp>();

  /** 排放源清单 */
  const [list, setList] = useState<EmissionListType[]>([]);

  /** 获取echarts option */
  const getOption: GetOptionType = ({ emissionData, barColor }) => ({
    tooltip: {
      axisPointer: {
        axis: 'auto',
      },
    },
    title: {
      subtext: '(单位：tCO₂e)',
      textStyle: {
        color: '#999EA4',
        fontWeight: 400,
        fontSize: 12,
      },
    },
    grid: {
      containLabel: true,
      left: 10,
      right: 16,
      bottom: 0,
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
        // 修改网格线为虚线并设置颜色
        lineStyle: {
          type: 'dashed',
          color: '#D2D6DA',
        },
      },
    },
    yAxis: {
      inverse: true,
      type: 'category',
      data: emissionData?.dataX || [],
      axisLabel: {
        color: '#343A40',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: '#D2D6DA',
        },
      },
    },
    series: [
      {
        type: 'bar',
        barWidth: COMMON_BAR_WIDTH,
        data: emissionData?.dataY || [],
        color: barColor || '#0CBF9F',
      },
    ],
  });

  /** 下载top5排放源图片 */
  const downloadEmissionImgFn = useDownloadHandler(
    () =>
      generateImgName(
        orgName,
        topEmissionSearchForm,
        'TOP5排放源柱状图',
        true,
        true,
      ),
    'topEmissionPng',
  );

  /** 下载top5排放类别图片 */
  const downloadTypeImgFn = useDownloadHandler(
    () =>
      generateImgName(
        orgName,
        topEmissionSearchForm,
        'TOP5排放类别柱状图',
        true,
      ),
    'topTypePng',
  );

  /** 获取top排放源 */
  const getTopEmission = async () => {
    const { data } = await getComputationDataDashboardTopEmissionSource({
      ...topSearchFormValues,
      year: topEmissionSearchForm?.current?.getFieldValue('year'),
    });
    setTopEmissionData(data.data);
  };

  /** 获取top排放类别 */
  const getTopType = async () => {
    const { data } = await getComputationDataDashboardTopEmissionClassify({
      ...topSearchFormValues,
      ...topEmissionSearchForm?.current?.getFieldsValue(),
    });
    setTopTypeData(data.data);
  };

  /** 获取排放源清单 */
  const getList = async () => {
    const { categoryOrEmissionType } =
      listSearchForm?.current?.getFieldsValue() || EMISSION_BUTTON.SORT;

    const { data } = await getComputationDataDashboardEmissionSourceList({
      categoryOrEmissionType,
      ...topSearchFormValues,
      ...topEmissionSearchForm?.current?.getFieldsValue(),
    });
    if (categoryOrEmissionType === EMISSION_BUTTON.SORT) {
      const resData = data?.data || [];
      const mergeData = getMergeData(resData, ['categoryName', 'classifyName']);
      setList(mergeData);
    } else {
      setList(data?.data || []);
    }
  };

  /** 下载清单功能 */
  const getTableExcel = async () => {
    await postComputationDataDashboardDownloadEmissionSourceList(
      {
        ...topSearchFormValues,
        ...listSearchForm?.current?.getFieldsValue(),
        ...topEmissionSearchForm?.current?.getFieldsValue(),
      },
      {
        responseType: 'blob',
      },
    ).then(res => {
      downloadFile(res?.data, res);
    });
  };

  useEffect(() => {
    orgName = selectOrgName || '';
    getTopEmission();
    getTopType();
    getList();
  }, [topSearchFormValues]);

  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <div className={style.cardTitle}>TOP排放源/排放类别</div>
        <LightFilter
          formRef={topEmissionSearchForm}
          onValuesChange={() => {
            getTopEmission();
            getTopType();
            getList();
          }}
        >
          <ProFormRadio.Group
            name='standardType'
            radioType='button'
            options={BUTTON_OPTION}
            initialValue={BUTTON.GHG}
          />
          <ProYearSelect />
        </LightFilter>
      </div>
      <Row gutter={16} className={style.chart}>
        {/* TOP排放源 */}
        <Col span={12}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>TOP5排放源</div>
            <DownloadIcon onClick={downloadEmissionImgFn} />
          </div>
          <div className={style.mulletLine} id='topEmissionPng'>
            <ReactECharts
              option={getOption({ emissionData: topEmissionData || {} })}
              className={style.lineChart}
            />
          </div>
        </Col>
        {/* TOP排放类别 */}
        <Col span={12}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>TOP5排放类别</div>
            <DownloadIcon onClick={downloadTypeImgFn} />
          </div>
          <div className={style.mulletLine} id='topTypePng'>
            <ReactECharts
              option={getOption({
                emissionData: topTypeData || {},
                barColor: '#3491FA',
              })}
              className={style.lineChart}
            />
          </div>
        </Col>
      </Row>
      <div className={style.cardHeader}>
        <div className={style.cardTitle}>排放源清单</div>
        <LightFilter formRef={listSearchForm} onValuesChange={getList}>
          <ProFormRadio.Group
            name='categoryOrEmissionType'
            radioType='button'
            options={EMISSION_BUTTON_OPTION}
            initialValue={EMISSION_BUTTON.SORT}
          />
          <DownloadIcon onClick={getTableExcel} />
        </LightFilter>
      </div>
      <Table
        columns={changeTableColumnsNoText(columns(), '-')}
        dataSource={list}
        pagination={false}
      />
    </div>
  );
};
export default TopEmission;
