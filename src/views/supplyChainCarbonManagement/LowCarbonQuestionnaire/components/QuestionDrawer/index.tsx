/*
 * @description: 供应链碳管理-低碳问卷-新增/编辑-设计问卷-添加/编辑题目抽屉
 */
import {
  ArrayItems,
  Checkbox,
  DatePicker,
  Editable,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
  Space,
} from '@formily/antd';
import { createForm, onFieldInputValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Drawer } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useMemo, useState } from 'react';

import {
  getSupplychainQuestionId,
  postSupplychainQuestionAdd,
  postSupplychainQuestionEdit,
  Questionnaire,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { questionTypes } from '@/views/supplyChainCarbonManagement/utils';

import style from './index.module.less';
import { questionSchema } from './utils/schemas';
import RadioButtonCheckbox from '../RadioButtonCheckbox';
import SelectButtons from '../SelectButtons';

function QuestionDrawer({
  open,
  drawerOpenFn,
  isAddQuestion,
  questionnaireId,
  getQuestionArr,
  currentQuestionId,
}: {
  open: boolean;
  drawerOpenFn: (
    value: boolean,
    row?: Questionnaire & { deadline: string },
  ) => void;
  isAddQuestion?: boolean;
  questionnaireId: number;
  getQuestionArr: () => void;
  currentQuestionId?: number;
}) {
  /** 确认按钮loading */
  const [loading, setLoading] = useState(false);

  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      TextArea,
      Radio,
      Space,
      ArrayItems,
      Editable,
      DatePicker,
      Checkbox,
      SelectButtons,
      RadioButtonCheckbox,
    },
  });

  const form = useMemo(
    () =>
      createForm({
        effects(formAll) {
          onFieldInputValueChange('questionType', field => {
            if (field.value === questionTypes.DetermineQuestion) {
              formAll.setValues({
                optionList: [
                  {
                    allowFillBlanks: false,
                    blankRequired: false,
                    content: '是',
                  },
                  {
                    allowFillBlanks: false,
                    blankRequired: false,
                    content: '否',
                  },
                ],
              });
            } else {
              formAll.setValues({
                optionList: [],
              });
            }
          });
        },
      }),
    [isAddQuestion],
  );

  /** 添加/编辑题目确定方法 */
  const okFn = async () => {
    if (isAddQuestion) {
      await form.submit(values => {
        setLoading(true);
        postSupplychainQuestionAdd({
          req: { ...values, questionnaireId },
        }).then(() => {
          drawerOpenFn(false);
          setLoading(false);
          form.reset();
          /** 刷新题目列表 */
          getQuestionArr();
        });
      });
    } else {
      await form.submit(values => {
        setLoading(true);
        postSupplychainQuestionEdit({
          req: { ...values, questionnaireId, id: currentQuestionId },
        }).then(() => {
          drawerOpenFn(false);
          setLoading(false);
          form.reset();
          /** 刷新题目列表 */
          getQuestionArr();
        });
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    /** 获取题目详情 */
    if (currentQuestionId && !isAddQuestion) {
      getSupplychainQuestionId({ id: currentQuestionId }).then(({ data }) => {
        form.setValues({
          ...data?.data,
        });
      });
    }
  }, [currentQuestionId, open]);

  return (
    <Drawer
      title={isAddQuestion ? '添加题目' : '编辑题目'}
      placement='right'
      onClose={() => drawerOpenFn(false)}
      closable={false}
      open={open}
      width='60%'
    >
      <Form form={form} previewTextPlaceholder='-' className={style.formStyle}>
        <SchemaField schema={questionSchema()} />
      </Form>

      <div className={style.footerStyle}>
        <Button
          loading={loading}
          type='primary'
          className={style.button}
          onClick={() => okFn()}
        >
          确定
        </Button>
        <Button className={style.button} onClick={() => drawerOpenFn(false)}>
          返回
        </Button>
      </div>
    </Drawer>
  );
}
export default QuestionDrawer;
