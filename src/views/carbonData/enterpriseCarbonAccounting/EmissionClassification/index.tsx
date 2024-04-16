/**
 * @deprecated 排放分类占比
 */
import {
  LightFilter,
  ProFormInstance,
  ProFormRadio,
} from '@ant-design/pro-components';
import { Col, Row, Table } from 'antd';
import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

import {
  EmissionProportionResp,
  getComputationDataDashboardEmissionProportion,
  postComputationDataDashboardDownloadEmissionProportion,
} from '@/sdks_v2/new/computationV2ApiDocs';

import { columns } from './cloumns';
import GHGCards from './component/GHGCards';
import ISOCards from './component/ISOCards';
import style from './index.module.less';
import { downloadFile, generateImgName, useDownloadHandler } from '../commonFn';
import DownloadIcon from '../component/DownloadIcon';
import { ProYearSelect } from '../component/ProSelect';
import { BUTTON, BUTTON_OPTION, COMMON_COLOR } from '../constant';
import { CommonProps } from '../type';

/** 今年 */
const currentYear = new Date().getFullYear();

/** 组织名称 */
let orgName = '';

const EmissionClassification: FC<CommonProps> = ({
  topSearchFormValues,
  selectOrgName,
}) => {
  const classificationSearchForm = useRef<ProFormInstance>();

  const [pieData, setPieData] = useState<EmissionProportionResp>();

  /** 是否是GHG */
  const [isGHG, setIsGHG] = useState(true);

  /** 所选年份 */
  const [selectYear, setSelectYear] = useState(currentYear);

  /** 下载图片 */
  const downloadImgFn = useDownloadHandler(
    () =>
      generateImgName(
        orgName,
        classificationSearchForm,
        '排放分类占比饼图',
        true,
      ),
    'piePng',
  );

  /** 下载清单功能 */
  const getTableExcel = async () => {
    await postComputationDataDashboardDownloadEmissionProportion(
      {
        ...topSearchFormValues,
        ...classificationSearchForm.current?.getFieldsValue(),
      },
      {
        responseType: 'blob',
      },
    ).then(res => {
      downloadFile(res?.data, res);
    });
  };

  /** 获取数据 */
  const getClassificationData = async () => {
    const { data } = await getComputationDataDashboardEmissionProportion({
      ...topSearchFormValues,
      ...classificationSearchForm.current?.getFieldsValue(),
    });

    setPieData({
      ...data?.data,
    });
    orgName = selectOrgName || '';
  };

  const seriesData = useMemo(() => {
    const { pieRespList, trendChartResp } = pieData || {};
    const { dataX, dataY } = trendChartResp || {};
    const xData = [...(dataX || []), `${selectYear}年度合计`];
    const accumulator: { [key: string]: string } = {};
    const tableData = xData?.map(category => {
      const values = dataY?.reduce((res, item) => {
        res[item?.name || ''] = item?.value?.[xData?.indexOf(category)] || '-';
        return res;
      }, accumulator);
      return {
        排放分类: category,
        ...values,
      };
    });
    return { pieRespList, tableData };
  }, [pieData]);

  /** echarts option */
  const option: EChartsOption = {
    color: COMMON_COLOR,
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: '{b}：{d}%,{c}(tCO₂e)',
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '60%'],
        data: seriesData?.pieRespList || [],
        label: {
          fontSize: 12,
          color: '#343A40',
          fontWeight: 400,
          formatter: '{b}：{d}%,{c}(tCO₂e)',
        },
      },
    ],
  };

  useEffect(() => {
    getClassificationData();
  }, [topSearchFormValues]);

  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <div className={style.cardTitle}>排放分类占比</div>
        <LightFilter
          formRef={classificationSearchForm}
          onValuesChange={(_, values) => {
            const { standardType, year } = values;
            setIsGHG(standardType === BUTTON.GHG);
            setSelectYear(year);
            getClassificationData();
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
        {/* 排放分类占比 */}
        <Col span={12}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>排放分类占比</div>
            <DownloadIcon onClick={downloadImgFn} />
          </div>
          <div className={style.mulletLine} id='piePng'>
            <ReactECharts option={option} className={style.lineChart} />
          </div>
        </Col>
        {/* 排放分类占比清单 */}
        <Col span={12}>
          <div className={style.cardHeader}>
            <div className={style.cardTitle}>排放分类占比清单</div>
            <DownloadIcon onClick={getTableExcel} />
          </div>
          <Table
            dataSource={seriesData?.tableData || []}
            columns={columns}
            scroll={{ y: 232, x: 800 }}
            pagination={false}
            rowClassName={(_, index) =>
              index === Number(seriesData?.tableData?.length) - 1
                ? `${style['fixed-last-row']}`
                : ''
            }
          />
        </Col>
      </Row>
      {isGHG ? (
        <GHGCards options={pieData?.trendChartResp} />
      ) : (
        <ISOCards options={pieData?.trendChartResp} />
      )}
    </div>
  );
};
export default EmissionClassification;
