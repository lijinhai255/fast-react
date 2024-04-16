/**
 * @description 碳足迹模型的详情(目标与范围、清单分析、影响评价、结果解释)
 */

import { Modal, Steps, StepProps } from 'antd';
import './index.less';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CommonHeader from '@/components/CommonHeader';
import { usePageInfo } from '@/hooks';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { updateUrl, getSearchParams } from '@/utils';

import ImpactAssessment from './ImpactAssessment';
import InventoryAnalysis from './InventoryAnalysis';
import ObjectivesAndScope from './ObjectivesAndScope';
import ResultsInterpretation from './ResultsInterpretation';
import { STEP_TYPE } from './constant';
import style from './index.module.less';
import BackIcon from '../Image/back.svg';
import { getModelDetail } from '../service';
import { Model } from '../type';

const {
  OBJECTIVES_SCOPE,
  INVENTORY_ANALYSIS,
  IMPACT_ASSESSMENT,
  RESULTS_INTERPRETATION,
} = STEP_TYPE;

const CarbonFootprintModel = () => {
  const navigate = useNavigate();

  /** 模型ID */
  const { id } = usePageInfo();

  /** URL 携带的参数 */
  const search = { ...getSearchParams()[0] };

  /** 模型详情 */
  const [modelDetail, setModelDetail] = useState<Model>();
  const { functionalUnit, baselineFlowCount, baselineFlowUnitName, orgName } =
    modelDetail || {};

  /** 步骤条枚举 */
  const [stepOptions, setStepOptions] = useState<StepProps[]>([
    {
      title: '目标与范围',
    },
    {
      title: '清单分析',
      disabled: true,
    },
    {
      title: '影响评价',
      disabled: true,
    },
    {
      title: '结果解释',
      disabled: true,
    },
  ]);

  /** 当前步骤 */
  const [currentStep, setCurrentStep] = useState<number>(
    Number(search?.currentStep) || OBJECTIVES_SCOPE,
  );

  /** 步骤条状态 当没有模型id时，清单分析、影响评价、结果解释禁用 */
  useEffect(() => {
    const arr = stepOptions.map(item => ({
      ...item,
      disabled: !id,
    }));
    setStepOptions([...arr] as StepProps[]);
  }, [currentStep]);

  /** 获取模型详情 */
  useEffect(() => {
    if (id) {
      getModelDetail({ id }).then(({ data }) => {
        setModelDetail(data?.data);
      });
    }
  }, [id, currentStep]);

  /** 点击返回按钮的方法  返回到列表页 */
  const onBackClick = () => {
    navigate(LCARouteMaps.lcaModel);
  };

  return (
    <div>
      <Modal
        className='carbonFootprintModelWrapper'
        destroyOnClose
        mask={false}
        open
        width='100%'
        title={undefined}
        footer={null}
        closable={false}
        transitionName=''
      >
        <div className={style.wrapper}>
          <div className={style.container}>
            {/* 步骤条 */}
            <div className={style.stepWrapper}>
              <div className={style.backBtn} onClick={() => onBackClick()}>
                <img className={style.backIcon} src={BackIcon} alt='' />
                <span className={style.backName}>碳足迹模型</span>
              </div>
              <div className={style.step}>
                <Steps
                  current={currentStep}
                  size='small'
                  responsive={false}
                  items={stepOptions}
                  onChange={currentStepValue => {
                    updateUrl({
                      ...search,
                      currentStep: currentStepValue,
                    });
                    setCurrentStep(currentStepValue);
                  }}
                />
              </div>
            </div>

            {/* 头部展示信息 目标与范围时不展示 */}
            {currentStep !== OBJECTIVES_SCOPE && (
              <div className={style.headerWrapper}>
                <div className={style.commonHeaderWrapper}>
                  <CommonHeader
                    basicInfo={{
                      功能单位: functionalUnit,
                      基准流:
                        baselineFlowCount && baselineFlowUnitName
                          ? `${baselineFlowCount}${baselineFlowUnitName}`
                          : '-',
                      所属组织: orgName,
                    }}
                  />
                </div>
                {/* 暂时不做 */}
                {/* <div className={style.flowChartBtn}>
                  <img
                    className={style.flowChartIcon}
                    src={FlowChartIcon}
                    alt=''
                  />
                  <span className={style.flowButton}>生命周期流程图</span>
                </div> */}
              </div>
            )}
            {/* 目标与范围 */}
            {currentStep === OBJECTIVES_SCOPE && (
              <ObjectivesAndScope
                modelDetail={modelDetail}
                onSaveAndNextStepClick={({ id: modelId }) => {
                  updateUrl({
                    id: modelId,
                    currentStep: INVENTORY_ANALYSIS,
                  });
                  setCurrentStep(INVENTORY_ANALYSIS);
                }}
                onBackClick={() => onBackClick()}
              />
            )}
            {/* 清单分析 */}
            {currentStep === INVENTORY_ANALYSIS && (
              <InventoryAnalysis
                onNextStepClick={() => {
                  updateUrl({
                    ...search,
                    currentStep: IMPACT_ASSESSMENT,
                  });
                  setCurrentStep(IMPACT_ASSESSMENT);
                }}
                onBackClick={() => onBackClick()}
              />
            )}
            {/* 影响评价 */}
            {currentStep === IMPACT_ASSESSMENT && (
              <ImpactAssessment
                onNextStepClick={() => {
                  updateUrl({
                    ...search,
                    currentStep: RESULTS_INTERPRETATION,
                  });
                  setCurrentStep(RESULTS_INTERPRETATION);
                }}
                onBackClick={() => onBackClick()}
              />
            )}
            {/* 结果解释 */}
            {currentStep === RESULTS_INTERPRETATION && (
              <ResultsInterpretation onBackClick={() => onBackClick()} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CarbonFootprintModel;
