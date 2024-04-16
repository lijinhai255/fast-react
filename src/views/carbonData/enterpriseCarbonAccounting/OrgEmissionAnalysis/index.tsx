/**
 * @deprecated 组织排放分析
 */
import { LightFilter, ProFormInstance } from '@ant-design/pro-components';
import { Col, Row, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import {
  getComputationDataDashboardOrgEmissionAnalysis,
  OrgBarChartResp,
  postComputationDataDashboardDownloadorgEmissionAnalysis,
} from '@/sdks_v2/new/computationV2ApiDocs';

import { columns } from './columns';
import style from './index.module.less';
import { downloadFile, generateImgName, useDownloadHandler } from '../commonFn';
import DownloadIcon from '../component/DownloadIcon';
import { ProYearSelect } from '../component/ProSelect';

const OrgEmissionAnalysis: FC<{ orgName: string }> = ({ orgName }) => {
  const orgSearchForm = useRef<ProFormInstance>();

  /** 组织排放数据 */
  const [orgEmissionData, setOrgEmissionData] = useState<OrgBarChartResp>();

  /** echarts option */
  const option: echarts.EChartsOption = {
    title: {
      subtext: `(单位：tCO₂e)`,
      subtextStyle: {
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
    legend: {
      data: ['职场'],
    },
    grid: {
      containLabel: true,
      left: 16,
      right: 16,
      bottom: 16,
    },
    xAxis: [
      {
        type: 'category',
        data: orgEmissionData?.dataX || [],
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#D2D6DA',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: {
          lineStyle: {
            color: '#D2D6DA',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#999EA4',
          fontSize: 12,
        },
      },
    ],
    series: [
      {
        name: '',
        type: 'bar',
        data: orgEmissionData?.dataY?.emissionList || [],
        color: '#0CBF9F',
        barWidth: 16,
      },
    ],
  };

  /** 下载图片 */
  const downloadImgFn = useDownloadHandler(
    () =>
      generateImgName(
        orgName,
        orgSearchForm,
        'TOP5排放量组织柱状图',
        true,
        true,
      ),
    'orgPng',
  );

  /** 下载清单功能 */
  const getTableExcel = async () => {
    await postComputationDataDashboardDownloadorgEmissionAnalysis(
      {
        ...orgSearchForm?.current?.getFieldsValue(),
      },
      {
        responseType: 'blob',
      },
    ).then(res => {
      downloadFile(res?.data, res);
    });
  };

  /** 获取数据 */
  const getOrgEmissionData = async () => {
    const { data } = await getComputationDataDashboardOrgEmissionAnalysis({
      ...orgSearchForm?.current?.getFieldsValue(),
    });
    setOrgEmissionData(data.data);
  };

  /** 处理table数据 */
  const tableData = useMemo(() => {
    const orgNameData = orgEmissionData?.dataX || [];
    const emissionData = orgEmissionData?.dataY?.emissionList || [];
    const proportionData = orgEmissionData?.dataY?.emissionProportionList || [];

    const dataSource = [];

    for (let i = 0; i < orgNameData?.length; i++) {
      const item = {
        orgName: orgNameData[i] || '-',
        emission: emissionData[i] ?? '-',
        proportion: proportionData[i] || '-',
      };
      dataSource.push(item);
    }

    return dataSource || [];
  }, [orgEmissionData]);

  useEffect(() => {
    getOrgEmissionData();
  }, []);

  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <div className={style.cardTitle}>组织排放分析</div>
        <LightFilter
          formRef={orgSearchForm}
          onValuesChange={getOrgEmissionData}
        >
          <ProYearSelect />
        </LightFilter>
      </div>
      <Row gutter={16}>
        {/* TOP排放量组织 */}
        <Col span={12}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>TOP5排放量组织</div>
            <DownloadIcon onClick={downloadImgFn} />
          </div>
          <div className={style.mulletLine} id='orgPng'>
            <ReactECharts option={option} className={style.lineChart} />
          </div>
        </Col>
        {/* TOP排放量清单 */}
        <Col span={12}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>组织排放量清单</div>
            <DownloadIcon onClick={getTableExcel} />
          </div>
          <Table
            dataSource={tableData}
            columns={columns}
            scroll={{ y: 232 }}
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
};
export default OrgEmissionAnalysis;
