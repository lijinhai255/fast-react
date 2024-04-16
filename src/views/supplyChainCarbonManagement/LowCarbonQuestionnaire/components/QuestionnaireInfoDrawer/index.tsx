/*
 * @description: 供应链碳管理-低碳问卷列表-查看详情抽屉
 */
import { Drawer, Radio } from 'antd';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Form/Button';
import {
  getSupplychainQuestionnairePreviewQuestionnaireId,
  getSupplychainQuestionnaireSupplierListQuestionnaireId,
  QuestionnaireQuestionResp,
  Supplier,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import TableList from '@/views/supplyChainCarbonManagement/components/Table';
import { RowType } from '@/views/supplyChainCarbonManagement/utils/type';

import style from './index.module.less';
import { columns } from './utils/columns';
import QuestionCard from '../QuestionCard';

const tabs = {
  question: 1,
  supplier: 2,
};

function QuestionnaireInfoDrawer({
  open,
  drawerOpenFn,
  baseInfoData,
}: {
  open: boolean;
  drawerOpenFn: (value: boolean, row?: RowType) => void;
  baseInfoData?: RowType;
}) {
  const id = baseInfoData?.id;

  /** 表格数据 */
  const [tableData, setTableData] = useState<Supplier[]>();

  /** 表格数据总数 */
  const [total, setTotal] = useState<number>(0);

  /** 表格loading */
  const [loading, changeLoading] = useState(false);

  /** 题目列表 */
  const [questionArr, setQuestionArr] = useState<QuestionnaireQuestionResp[]>(
    [],
  );

  const { question, supplier } = tabs;

  useEffect(() => {
    if (id) {
      changeLoading(true);
      /** 获取供应商列表 */
      getSupplychainQuestionnaireSupplierListQuestionnaireId({
        questionnaireId: id,
      }).then(({ data }) => {
        setTableData(data?.data || []);
        setTotal(data?.data?.length || 0);
        changeLoading(false);
      });

      /** 获取题目列表 */
      getSupplychainQuestionnairePreviewQuestionnaireId({
        questionnaireId: id,
      }).then(({ data }) => {
        setQuestionArr(data?.data);
      });
    }
  }, [id]);

  /** 当前切换的顶部Tab栏 */
  const [currentTab, setCurrentTab] = useState<number>(question);

  /** 题目卡片 */
  const getCards = () =>
    questionArr?.map((item: QuestionnaireQuestionResp, index) => (
      <QuestionCard questionItem={item} index={index} showOnly />
    ));

  /** 切换tabs展示的信息 */
  const tabsShowInfo = () => {
    switch (currentTab) {
      /** 问卷信息  */
      case question:
        return (
          <div className={style.questionBasic}>
            <div className={style.infoHead}>
              <div className={style.infobasic}>
                <h3>{baseInfoData?.questionnaireName || ''}</h3>
                <div>
                  <span className={style.designOrg}>
                    所属组织：{baseInfoData?.orgName || '-'}
                  </span>
                  <span>截止日期：{baseInfoData?.deadline || '-'}</span>
                </div>
              </div>
              <div>{baseInfoData?.questionnaireDesc || ''}</div>
            </div>
            {getCards()}
          </div>
        );
      /** 供应商列表  */
      case supplier:
        return (
          <TableList
            loading={loading}
            columns={columns()}
            dataSource={tableData}
            total={total}
          />
        );
      default:
        return '';
    }
  };

  const onClose = () => {
    drawerOpenFn(false);
  };

  return (
    <Drawer
      title='问卷详情'
      placement='right'
      onClose={onClose}
      closable={false}
      open={open}
      width='50%'
    >
      <Radio.Group
        value={currentTab}
        onChange={e => setCurrentTab(e.target.value)}
        className={style.tabGroup}
      >
        <Radio.Button value={question}>问卷信息</Radio.Button>
        <Radio.Button value={supplier}>供应商列表</Radio.Button>
      </Radio.Group>

      {tabsShowInfo()}

      <div className={style.footerStyle}>
        <Button
          className={style.button}
          onClick={async () => {
            onClose();
          }}
        >
          返回
        </Button>
      </div>
    </Drawer>
  );
}
export default QuestionnaireInfoDrawer;
