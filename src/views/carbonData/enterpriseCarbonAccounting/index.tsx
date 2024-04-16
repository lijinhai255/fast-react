/**
 * @description 碳数据-企业碳核算
 */
import { LightFilter, ProFormInstance } from '@ant-design/pro-components';
import classNames from 'classnames';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { checkAuth } from '@/layout/utills';
import {
  getComputationDataDashboardMetricList,
  getComputationDataDashboardUserList,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { RootState } from '@/store/types';

import EmissionClassification from './EmissionClassification';
import EmissionIntensityAnalysis from './EmissionIntensityAnalysis';
import EmissionTrendAnalysis from './EmissionTrendAnalysis';
import GasPathway from './GasPathway';
import OrgEmissionAnalysis from './OrgEmissionAnalysis';
import TopEmission from './TopEmission';
import { ProSelect } from './component/ProSelect';
import { GROUP, ORG_FITTER, ORG_FITTER_OPTION } from './constant';
import style from './index.module.less';
import { IntensityProps, OrgOptionType, TopSearchFormType } from './type';

function CarbonDataECA(): ReactElement {
  /** 左侧菜单栏 */
  const { sidebar } = useSelector<RootState, RootState['systemOperations']>(
    s => s.systemOperations,
  );

  /** 当前账号组织 */
  const { orgId, orgName, orgType } = useSelector<
    RootState,
    RootState['userInfo']
  >(u => u.userInfo);

  /** 当前账号是否是集团组织 */
  const isGroup = orgType === GROUP;

  /** 所属组织枚举 */
  const [orgOption, setOrgOption] = useState<OrgOptionType[]>([]);
  useEffect(() => {
    getComputationDataDashboardUserList({}).then(({ data }) => {
      const orgs = data?.data?.map(item => {
        return { label: item.orgName, value: item.id };
      });
      setOrgOption(orgs);
    });
  }, []);

  /** 获取orgId对应的label */
  const getOrgName = (targetOrg?: number) => {
    return orgOption.filter(item => item.value === targetOrg)[0]?.label;
  };

  /** 是否有搜索表单 集团账号或有子组织的账号才有搜索表单*/
  const hasSearchForm = isGroup || orgOption.length > 1;

  /** 顶部搜索表单 */
  const topSearchForm = useRef<ProFormInstance>();

  /** 初始值 */
  const initialValues = {
    orgId: Number(orgId),
    includeChild: ORG_FITTER.INCLUDE_SUB_ORG,
  };

  /** 顶部搜索表单值 */
  const [topSearchFormValues, setTopSearchFormValues] =
    useState<TopSearchFormType>(initialValues);

  /** 选中的组织label */
  const [selectOrgName, setSelectOrgName] = useState<string>(orgName || '');

  /** 排放强度下拉框options */
  const [metricsOptions, setMetricsOptions] = useState<
    IntensityProps['metricsOptions']
  >([]);

  /** 展示排放强度趋势分析-排放强度下拉枚举不为空*/
  const hasIntensity = metricsOptions?.length > 0;

  const getMetricsOptions = async () => {
    const { data } = await getComputationDataDashboardMetricList({
      ...topSearchFormValues,
    });
    const options = data?.data?.map(item => {
      const { metricsName, metricsUnitName } = item;
      const label = metricsName
        ? `${metricsName}（tCO₂e/${metricsUnitName || '-'}）`
        : '';
      return {
        label,
        value: item?.id,
        unit: item?.metricsUnitName,
      };
    });
    setMetricsOptions(options);
  };

  useEffect(() => {
    getMetricsOptions();
  }, [topSearchFormValues]);

  return (
    <div
      className={classNames(style.wrapper, {
        [style['bread-warpper']]: hasSearchForm,
        [style.unTopWrapper]: !hasSearchForm,
      })}
    >
      {hasSearchForm && (
        <div
          className={classNames(style.affix, {
            [style.sideOpen]: sidebar.opened,
          })}
        >
          <LightFilter<TopSearchFormType>
            formRef={topSearchForm}
            onValuesChange={(_, values) => {
              setSelectOrgName(getOrgName(values.orgId) || '');
              setTopSearchFormValues(values);
            }}
            initialValues={initialValues}
          >
            <ProSelect
              props={{
                name: 'orgId',
                placeholder: '所属组织',
                options: orgOption,
                width: 192,
              }}
            />
            <ProSelect
              props={{
                name: 'includeChild',
                placeholder: '包含子组织',
                options: ORG_FITTER_OPTION,
                width: 192,
              }}
            />
          </LightFilter>
        </div>
      )}

      {/* 排放量趋势分析 */}
      {checkAuth(
        '/carbonData/eca/emissionTrendAnalysis',
        <EmissionTrendAnalysis
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />,
      )}

      {/* 排放强度趋势分析 */}
      {hasIntensity &&
        checkAuth(
          '/carbonData/eca/emissionIntensityAnalysis',
          <EmissionIntensityAnalysis
            topSearchFormValues={topSearchFormValues}
            selectOrgName={selectOrgName}
            metricsOptions={metricsOptions}
          />,
        )}

      {/* 排放分类占比 */}
      {checkAuth(
        '/carbonData/eca/emissionClassification',
        <EmissionClassification
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />,
      )}

      {/* TOP排放源/排放类别 */}
      {checkAuth(
        '/carbonData/eca/topEmission',
        <TopEmission
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />,
      )}

      {/* 温室气体产生路径 */}
      {checkAuth(
        '/carbonData/eca/gasPathway',
        <GasPathway
          topSearchFormValues={topSearchFormValues}
          selectOrgName={selectOrgName}
        />,
      )}

      {/* 组织排放分析 */}
      {isGroup &&
        checkAuth(
          '/carbonData/eca/orgEmissionAnalysis',
          <OrgEmissionAnalysis orgName={orgName || ''} />,
        )}
    </div>
  );
}

export default CarbonDataECA;
