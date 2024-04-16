/*
 * @@description: 供应链碳管理-碳数据填报-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-02 16:48:09
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:13:17
 */
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getSupplychainDataFillApplyInfoId,
  getSupplychainAuditSupplierLogList,
  AuditLog,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import LocalStore from '@/utils/store';
import { SELECT_BACK_KEY } from '@/views/supplyChainCarbonManagement/utils';

import CarbonAccounting from './CarbonAccounting';
import CarbonFootPrint from './CarbonFootPrint';
import { columns } from './utils/columns';
import style from '../../SupplierManagement/Info/index.module.less';
import CarbonDataQuestionnaire from '../../components/CarbonDataQuestionnaire';
import CarbonDataRequire from '../../components/CarbonDataRequire';
import TableList from '../../components/Table';
import { CarbonDataType, TypeApplyInfoResp } from '../../utils/type';

function CarbonDataFillInfo() {
  const { id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  /** 选择核算产品后返回的信息 */
  const selectBackData = LocalStore.getValue<{
    productionBusinessId: number;
    currentTab: string;
  }>(SELECT_BACK_KEY);
  const currentTabBack = selectBackData?.currentTab;

  /** 当前切换的顶部Tab栏 */
  const [currentTab, changeCurrentTab] = useState<string>(
    currentTabBack || '1',
  );

  /** 碳数据填报数据请求的详情 */
  const [cathRecord, setCathRecord] = useState<TypeApplyInfoResp>();

  /** 获取数据类型 1: 企业碳核算 2:产品碳足迹 3:低碳问卷*/
  const [dataType, setDataType] = useState<CarbonDataType>();

  /** 获取数据请求类型 1: 核算结果 2: 核算过程 */
  const [applyType, setApplyType] = useState<'1' | '2'>();

  /** 客户的反馈记录 */
  const [feedBackRecord, setFeedBackRecord] = useState<AuditLog[]>();

  useEffect(() => {
    if (id) {
      /** 获取数据请求的详情 */
      getSupplychainDataFillApplyInfoId({
        applyInfoId: Number(id),
      }).then(({ data }) => {
        if (data.code === 200) {
          setCathRecord(data.data as TypeApplyInfoResp);
          setDataType(data?.data?.dataType as CarbonDataType);
          setApplyType(data?.data?.applyType);
          /** 只有客户审核后才会有审核记录 3: 审核通过，4: 审核不通过 */
          if ([3, 4].includes(Number(data.data.applyStatus))) {
            /** 获取客户反馈的记录 */
            getSupplychainAuditSupplierLogList({
              applyInfoId: Number(id),
            }).then(({ data }) => {
              if (data.code === 200) {
                setFeedBackRecord(data.data);
              }
            });
          }
        }
      });
    }
  }, [id]);

  /** 页面销毁前 删除缓存的数据 */
  useEffect(() => {
    return () => {
      LocalStore.removeValue(SELECT_BACK_KEY);
    };
  }, []);

  /** 数据填报展示的信息 */
  const fillInfo = () => {
    switch (Number(dataType)) {
      /** 企业碳核算 */
      case 1:
        return (
          <CarbonAccounting
            currentModalType='fill'
            applyType={applyType}
            cathRecord={cathRecord}
          />
        );
      /** 产品碳足迹 */
      case 2:
        return (
          <CarbonFootPrint
            currentModalType='fill'
            applyType={applyType}
            cathRecord={cathRecord}
          />
        );
      /** 低碳问卷 */
      case 3:
        return <CarbonDataQuestionnaire isFill />;
      default:
        return '';
    }
  };

  /** 切换tabs展示的信息 */
  const tabsShowInfo = () => {
    switch (Number(currentTab)) {
      /** 数据请求 */
      case 1:
        return (
          <>
            <CarbonDataRequire
              currentModalType='fill'
              dataType={dataType}
              cathRecord={cathRecord}
            />
            {feedBackRecord && feedBackRecord.length > 0 && (
              <div>
                <h4>客户反馈</h4>
                <TableList columns={columns()} dataSource={feedBackRecord} />
              </div>
            )}
            <FormActions
              place='center'
              buttons={compact([
                {
                  title: '返回',
                  onClick: async () => {
                    history.back();
                  },
                },
              ])}
            />
          </>
        );
      /** 数据填报 */
      default:
        return fillInfo();
    }
  };

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Tabs
        defaultActiveKey={currentTabBack || '1'}
        items={[
          {
            label: '数据请求',
            key: '1',
          },
          {
            label: '数据填报',
            key: '2',
          },
        ]}
        onChange={value => {
          changeCurrentTab(value);
        }}
      />
      {tabsShowInfo()}
    </div>
  );
}
export default CarbonDataFillInfo;
