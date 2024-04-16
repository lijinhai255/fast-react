/**
 * @description: 供应链碳管理-低碳问卷-问卷预览
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  Questionnaire,
  QuestionnaireQuestion,
  getSupplychainQuestionnaireId,
  getSupplychainQuestionnairePreviewQuestionnaireId,
} from '@/sdks_v2/new/supplychainV2ApiDocs';

import style from './index.module.less';
import QuestionCard from '../components/QuestionCard';

const Preview = () => {
  const { id } = useParams();

  /** 基本信息 */
  const [headData, setHeadData] = useState<Questionnaire>();

  /** 获取基本信息 */
  const getHeadDataFn = () => {
    getSupplychainQuestionnaireId({ id: Number(id) }).then(({ data }) => {
      if (data.code === 200) {
        setHeadData(data?.data);
      }
    });
  };

  /** 题目列表 */
  const [questionArr, setQuestionArr] = useState<QuestionnaireQuestion[]>([]);

  /** 获取题目列表 */
  const getQuestionArr = async () => {
    await getSupplychainQuestionnairePreviewQuestionnaireId({
      questionnaireId: Number(id),
    }).then(({ data }) => {
      setQuestionArr(data?.data);
    });
  };

  useEffect(() => {
    if (id) {
      getHeadDataFn();
      getQuestionArr();
    }
  }, [id]);

  /** 题目卡片 */
  const getCards = () => {
    return questionArr?.map((item: QuestionnaireQuestion, index) => {
      return <QuestionCard questionItem={item} index={index} showOnly />;
    });
  };

  return (
    <div className={style.supplyQuestionnaireInfoWrapper}>
      <div className={style.designHead}>
        <h3>{headData?.questionnaireName || ''}</h3>
        <p>{headData?.questionnaireDesc || ''}</p>
      </div>

      <div className={style.previewCards}>{getCards()}</div>

      <FormActions
        place='center'
        buttons={[
          {
            title: '返回',
            onClick: async () => {
              history.back();
            },
          },
        ]}
      />
    </div>
  );
};
export default Preview;
