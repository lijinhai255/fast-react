/*
 * @@description:
 */
/*
 * @@description: 添加、编辑、查看
 */
import {
  ArrayTable,
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { cloneDeep, compact, join, split } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getAccountsystemQuestionId,
  postAccountsystemQuestion,
  putAccountsystemQuestion,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { schema, schemaTable } from './schemas';
import { defaultList, optionsArr, trueOfFalseList } from './utils';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    Radio,
    Checkbox,
    ArrayTable,
    FormGrid,
    FormLayout,
  },
});

type AnswerListType = {
  value: number;
  correctAnswer: boolean;
}[];

type QuestionBankFormValue = {
  answerList: AnswerListType;
  questionType: number;
};
const OrgInfo = () => {
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;
  /** 是否为编辑页面 */
  const isEdit = pageTypeInfo === PageTypeInfo.edit;

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      values: { answerList: defaultList },
      effects() {
        onFieldValueChange('questionType', field => {
          // console.log(field, 'field', field.value);
          form.setFieldState('answerList', {
            value:
              field.value === 2
                ? cloneDeep(trueOfFalseList)
                : cloneDeep(defaultList),
          });
        });
        onFieldValueChange('*.*.correctAnswer', (field, newForm) => {
          const { indexes, value } = field;
          if (!value) return;
          const formVal: QuestionBankFormValue = newForm.values;
          const setVal = formVal.answerList.map((val, valIndex) => {
            const copyVal = val;
            if (indexes[0] === valIndex) {
              copyVal.correctAnswer = true;
            } else {
              copyVal.correctAnswer = false;
            }
            return val;
          });
          newForm.setValues(setVal);
        });
      },
    });
  }, [pageTypeInfo, id, defaultList]);

  /** 题库详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getAccountsystemQuestionId({ id: +id }).then(({ data }) => {
        const result = data?.data;
        const answerList = [];
        // answerList.forEach(item => {
        // if (result.answerA) answerObj[answer] = result.answerA;
        if (result.answerA)
          answerList.push({
            answer: result.answerA,
            correctAnswer: false,
            correctAnswer2: false,
          });
        if (result.answerB)
          answerList.push({
            answer: result.answerB,
            correctAnswer: false,
            correctAnswer2: false,
          });
        if (result.answerC)
          answerList.push({
            answer: result.answerC,
            correctAnswer: false,
            correctAnswer2: false,
          });
        if (result.answerD)
          answerList.push({
            answer: result.answerD,
            correctAnswer: false,
            correctAnswer2: false,
          });
        if (result.answerE)
          answerList.push({
            answer: result.answerE,
            correctAnswer: false,
            correctAnswer2: false,
          });
        if (result.answerF)
          answerList.push({
            answer: result.answerF,
            correctAnswer: false,
            correctAnswer2: false,
          });
        if (result.answerG)
          answerList.push({
            answer: result.answerG,
            correctAnswer: false,
            correctAnswer2: false,
          });
        if (result.answerH)
          answerList.push({
            answer: result.answerH,
            correctAnswer: false,
            correctAnswer2: false,
          });
        // })
        answerList.forEach((item, index) => {
          // 多选
          if (Number(result.questionType) === 1) {
            const correctAnswerArr = split(result.correctAnswer, ',');
            correctAnswerArr.forEach(items => {
              optionsArr.forEach((opt, idx) => {
                if (items === opt.label && index === idx)
                  item.correctAnswer2 = true;
              });
            });
            return;
          }
          if (result.correctAnswer === optionsArr[index].label) {
            item.correctAnswer = true;
          }
        });

        form.setValues({
          ...result,
        });
        form.setFieldState('answerList', {
          value: answerList,
        });
      });
    }
  }, [id, pageTypeInfo]);

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
        <SchemaField schema={schemaTable()} />
      </Form>

      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit((values: any) => {
                // console.log(values, 'values', optionsArr);
                const answerObj: any = {};
                const correctAnswerArr: any = [];
                optionsArr.forEach((item, index) => {
                  const key = `answer${optionsArr[index].label}`;
                  answerObj[key] = '';
                  return answerObj;
                });
                values?.answerList?.forEach((item: any, index: number) => {
                  const key = `answer${optionsArr[index].label}`;
                  const value = item.answer;
                  answerObj[key] = value;
                  if (item.correctAnswer)
                    answerObj.correctAnswer = `${optionsArr[index].label}`;
                  // 多选
                  if (item.correctAnswer2) {
                    correctAnswerArr.push(`${optionsArr[index].label}`);
                    answerObj.correctAnswer = join(correctAnswerArr, ',');
                  }
                  return answerObj;
                });

                const { answerA, answerB, answerC, answerD, correctAnswer } =
                  answerObj;
                // 单选
                if (
                  values.questionType === 0 &&
                  (!answerA || !answerB || !answerC || !correctAnswer)
                ) {
                  // Toast('error', '单选题目至少3个选项');
                  Toast('error', '请先完善答案选项，再保存');
                  return;
                }
                // 多选
                if (
                  values.questionType === 1 &&
                  (!answerA ||
                    !answerB ||
                    !answerC ||
                    !answerD ||
                    !correctAnswer ||
                    !correctAnswer.includes(','))
                ) {
                  // Toast('error', '多选题目至少4个选项，且至少选择2个正确答案');
                  Toast('error', '请先完善答案选项，再保存');
                  return;
                }
                // 多选
                if (
                  values.questionType === 2 &&
                  (!answerA || !answerB || !correctAnswer)
                ) {
                  Toast('error', '请先完善答案选项，再保存');
                  return;
                }
                const submitVals = {
                  // ...values,
                  ...answerObj,
                  questionTitle: values.questionTitle,
                  questionType: values.questionType,
                };

                // 新增
                if (isAdd) {
                  postAccountsystemQuestion({
                    ro: { ...submitVals },
                  }).then(({ data }) => {
                    if (data?.code === 200) {
                      Toast('success', '新增成功');
                      history.back();
                    }
                  });
                }
                // 修改
                if (isEdit) {
                  putAccountsystemQuestion({
                    ro: { ...submitVals, id },
                  }).then(({ data }) => {
                    if (data?.code === 200) {
                      Toast('success', '修改成功');
                      history.back();
                    }
                  });
                }
              });
            },
          },
          {
            title: PageTypeInfo.show !== pageTypeInfo ? '取消' : '返回',
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};

export default OrgInfo;
