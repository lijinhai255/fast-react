/*
 * @@description: 排放源填报详情页面
 */
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { withTable } from 'table-render';

import { FormActions } from '@/components/FormActions';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo } from '@/router/utils/enums';
import ApproveInfo from '@/views/components/ApproveInfo';

import { TAB_OPTIONS, TAB_TYPE } from './constant';
import style from './index.module.less';
import EmissionData from '../../component/EmissionData';
import { getAuditProcessList, getAuditRecordList } from '../service';
import { AuditNode, AuditLog } from '../type';

const { EMISSION_DATA, APPROVAL_INFO } = TAB_TYPE;
const FillData = () => {
  const navigator = useNavigate();

  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const computationDataId = Number(id);

  const isDetail = pageTypeInfo === PageTypeInfo.show;

  //  当前Tab
  const [currentTab, setCurrentTab] = useState<string>(EMISSION_DATA);

  // 审批流程
  const [processTableData, setProcessTableData] = useState<AuditNode[]>();

  // 审批记录
  const [recordTableData, setRecordTableData] = useState<AuditLog[]>();

  useEffect(() => {
    if (computationDataId) {
      /** 流程 */
      getAuditProcessList({
        computationDataId,
      }).then(({ data }) => {
        setProcessTableData(data?.data);
      });
      /** 记录 */
      getAuditRecordList({
        computationDataId,
      }).then(({ data }) => {
        setRecordTableData(data?.data);
      });
    }
  }, [computationDataId]);

  return (
    <div className={style.wrapper}>
      {isDetail && (
        <Tabs
          activeKey={currentTab}
          className='customTabs'
          items={TAB_OPTIONS}
          onChange={value => {
            setCurrentTab(value);
          }}
        />
      )}
      {currentTab === EMISSION_DATA && (
        <EmissionData
          id={computationDataId}
          isDetail={isDetail}
          pageTypeInfo={pageTypeInfo}
        />
      )}
      {currentTab === APPROVAL_INFO && (
        <ApproveInfo<AuditNode, AuditLog>
          processDataSource={processTableData}
          recordDataSource={recordTableData}
        />
      )}

      <FormActions
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              navigator(EcaRouteMaps.fillData);
            },
          },
        ])}
      />
    </div>
  );
};

export default withTable(FillData);
