/*
 * @@description: 碳数据的详情（供应商碳数据和碳数据审核的详情）
 */
import { Tabs } from 'antd';
import { useEffect, useState } from 'react';

import { getSupplychainApplyId } from '@/sdks_v2/new/supplychainV2ApiDocs';

import {
  CarbonDataPropsType,
  CarbonDataType,
  TypeApplyInfoResp,
} from '../../utils/type';
import ApproveInfo from '../ApproveInfo';
import CarbonAccountingInfo from '../CarbonAccountingInfo';
import CarbonDataOverview from '../CarbonDataOverview';
import CarbonDataQuestionnaire from '../CarbonDataQuestionnaire';
import CarbonDataRequire from '../CarbonDataRequire';
import CarbonFootPrintInfo from '../CarbonFootPrintInfo';

function CarbonDataInfo({
  /** 申请id */
  id,
  /** 表单数据禁用 */
  disabled,
  /** 审核记录数据 */
  approvalRecord,
  /** 审核流程数据 */
  approvalProcess,
  /** 列表查看操作按钮事件 */
  onDetailClick,
}: CarbonDataPropsType) {
  /** 当前切换的顶部Tab栏 */
  const [currentTab, changeCurrentTab] = useState<string>('1');

  /** 供应商碳数据概览和数据要求的详情 */
  const [cathRecord, setCathRecord] = useState<TypeApplyInfoResp>();

  /** 获取数据类型 1: 企业碳核算 2:产品碳足迹 3:低碳问卷*/
  const [dataType, setDataType] = useState<CarbonDataType>();

  /** 获取数据请求类型 1: 核算结果 2: 核算过程 */
  const [applyType, setApplyType] = useState<'1' | '2'>();

  /** 获取碳数据概览和数据要求的详情 */
  useEffect(() => {
    if (id) {
      getSupplychainApplyId({
        id: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setCathRecord(data.data as TypeApplyInfoResp);
          setDataType(data?.data?.dataType as CarbonDataType);
          setApplyType(data?.data?.applyType);
        }
      });
    }
  }, [id]);

  /** 填报数据展示的信息 */
  const requireShowDom = () => {
    switch (Number(dataType)) {
      /** 企业碳核算 */
      case 1:
        return (
          <CarbonAccountingInfo
            id={id}
            disabled={disabled}
            applyType={applyType}
            cathRecord={cathRecord}
            onDetailClick={onDetailClick}
          />
        );
      /** 低碳问卷 */
      case 3:
        return <CarbonDataQuestionnaire applyInfoId={Number(id)} />;
      /** 产品碳足迹 */
      default:
        return (
          <CarbonFootPrintInfo
            id={id}
            disabled={disabled}
            applyType={applyType}
            cathRecord={cathRecord}
          />
        );
    }
  };

  /** 切换tabs展示的信息 */
  const tabsShowInfo = () => {
    switch (Number(currentTab)) {
      /** 碳数据概览  */
      case 1:
        return <CarbonDataOverview cathRecord={cathRecord} />;
      /** 数据要求 */
      case 2:
        return (
          <CarbonDataRequire dataType={dataType} cathRecord={cathRecord} />
        );
      /** 填报数据 */
      case 3:
        return requireShowDom();
      /** 审核详情 */
      default:
        return (
          <ApproveInfo
            approvalRecord={approvalRecord}
            approvalProcess={approvalProcess}
          />
        );
    }
  };
  return (
    <div>
      <Tabs
        defaultActiveKey='1'
        items={[
          {
            label: '碳数据概览',
            key: '1',
          },
          {
            label: '数据要求',
            key: '2',
          },
          {
            label: '填报数据',
            key: '3',
          },
          {
            label: '审核记录',
            key: '4',
          },
        ]}
        onChange={value => {
          changeCurrentTab(value);
        }}
      />

      {/* 切换tabs展示的不同信息 */}
      {tabsShowInfo()}
    </div>
  );
}
export default CarbonDataInfo;
