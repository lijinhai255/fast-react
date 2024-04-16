/*
 * @description: 供应链碳管理-低碳问卷-新增/编辑
 */
import { FileTextOutlined, PlusCircleFilled } from '@ant-design/icons';
import {
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import emptyIcon from '@src/image/icon-empty.svg';
import { Button, Steps } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import { SccmRouteMaps } from '@/router/utils/sccmEnums';
import {
  Questionnaire,
  QuestionnaireQuestionResp,
  QuestionnaireReq,
  getSupplychainQuestionnaireId,
  getSupplychainQuestionnairePreviewQuestionnaireId,
  postSupplychainQuestionOrder,
  postSupplychainQuestionnaireAdd,
  postSupplychainQuestionnaireCopy,
  postSupplychainQuestionnaireEdit,
  postSupplychainQuestionnairePublish,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import style from './index.module.less';
import { infoSchema } from './utils/schemas';
import { DefaultQuestionModal } from '../components/DefaultQuestionModal';
import QuestionDrawer from '../components/QuestionDrawer';
import QuestionnaireShow from '../components/QuestionsShow';
import SupplierList from '../components/SupplierList';

/** 问卷步骤条 */
export const StepsValues = {
  BasicInfo: 0,
  Design: 1,
  Publish: 2,
};

function SupplierManagementInfo() {
  const navigate = useNavigate();

  const { pageTypeInfo, id } = useParams();

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 是否为编辑页面 */
  const isEdit = pageTypeInfo === PageTypeInfo.edit;

  /** 是否为复制页面 */
  const isCopy = pageTypeInfo === PageTypeInfo.copy;

  /** 题目列表 */
  const [questionArr, setQuestionArr] = useState<QuestionnaireQuestionResp[]>(
    [],
  );

  /** 是否有题目 */
  const hasQuestion = questionArr?.length > 0;

  /** 步骤条 */
  const { BasicInfo, Design, Publish } = StepsValues;

  /** 当前steps */
  const [currentStep, setCurrentStep] = useState(BasicInfo);

  /** 步骤条items */
  const stepsItems = [
    {
      title: '创建问卷',
    },
    {
      title: '设计问卷',
      disabled: !isEdit,
    },
    {
      title: '发布问卷',
      disabled: !isEdit || !hasQuestion,
    },
  ];

  /** 是否为基础信息步骤 */
  const isBasicStep = useMemo(() => currentStep === BasicInfo, [currentStep]);

  /** 是否为设计问卷步骤 */
  const isDesign = useMemo(() => currentStep === Design, [currentStep]);

  /** 是否为发布问卷步骤 */
  const isPublish = useMemo(() => currentStep === Publish, [currentStep]);

  /** 控制选择题目弹窗 */
  const [questionModalOpen, setQuestionModalOpen] = useState(false);

  /** 控制选择题目弹窗方法 */
  const questionModalOpenFn = (isOpen: boolean) => {
    setQuestionModalOpen(isOpen);
  };

  /** 控制添加/编辑题目抽屉 */
  const [questionDrawerOpen, setQuestionDrawerOpen] = useState(false);

  /** 控制选择题目弹窗方法 */
  const questionDrawerOpenFn = (isOpen: boolean) => {
    setQuestionDrawerOpen(isOpen);
  };

  /** 判断是否是添加题目 */
  const [isAddQuestion, setIsAddQuestion] = useState(true);

  /** 问卷ID 创建问卷后以这个为准 */
  const [questionnaireId, setQuestionnaireId] = useState<number>(0);

  /** 当前题目ID */
  const [currentQuestionId, setcurrentQuestionId] = useState<number>(0);

  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      NumberPicker,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      TextArea,
      DatePicker,
    },
  });

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 组织ID */
  const [orgId, setOrgId] = useState<number>();

  /** 基本信息 */
  const [basicInfoData, setBasicInfoData] = useState<Questionnaire>();

  const form = useMemo(() => createForm(), [pageTypeInfo]);

  /** 获取基本信息 */
  const getBasicInfoDataFn = (infoId: number) => {
    getSupplychainQuestionnaireId({ id: infoId }).then(({ data }) => {
      const { questionnaireName, orgId } = data?.data || '';
      setOrgId(orgId);
      const isCopyQuestionnaireName = `${questionnaireName}_${moment().format(
        'YYYYMMDDhhmmss',
      )}`;
      form.setValues({
        ...data?.data,
        questionnaireName: isCopy ? isCopyQuestionnaireName : questionnaireName,
        orgId: isCopy ? null : orgId,
      });
      setBasicInfoData(data?.data);
    });
  };

  /** 选中的供应商ID数组 */
  const [selectedsupplier, setSelectedsupplier] = useState<number[]>([]);

  useEffect(() => {
    /** 基本信息 */
    if (!isAdd && id && orgList && orgList.length) {
      getBasicInfoDataFn(Number(id));
    }
    setQuestionnaireId(Number(id));
  }, [pageTypeInfo, id, orgList]);

  useEffect(() => {
    /** 组织列表枚举值 */
    if (orgList && isBasicStep) {
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
          ...item,
        })),
      });
    }
  }, [id, orgList, currentStep]);

  /** 添加/编辑打开题目抽屉 */
  const actionQuestion = (drawerType: boolean, questionId?: number) => {
    setIsAddQuestion(drawerType);
    questionDrawerOpenFn(true);
    if (questionId) setcurrentQuestionId(questionId);
  };

  /** 选择/添加题目按钮 */
  const questionBtn = (hasQuestions: boolean) => {
    return (
      <div
        className={classNames({
          [style.hasQuestionBtn]: hasQuestions,
        })}
      >
        <Button
          type='link'
          icon={<FileTextOutlined />}
          onClick={() => questionModalOpenFn(true)}
        >
          选择题目
        </Button>
        <Button
          type='link'
          icon={<PlusCircleFilled />}
          onClick={() => {
            actionQuestion(true);
          }}
        >
          添加题目
        </Button>
      </div>
    );
  };

  /** 获取/更新题目列表 */
  const getQuestionArr = async () => {
    await getSupplychainQuestionnairePreviewQuestionnaireId({
      questionnaireId,
    }).then(({ data }) => {
      setQuestionArr(data?.data);
    });
  };
  useEffect(() => {
    if (questionnaireId) {
      getQuestionArr();
    }
  }, [questionnaireId]);

  /** 获取当前题目排序 */
  const [questionIdList, setQuestionIdList] = useState<number[]>();
  const getCurrentOrderArr = (orderArr: number[]) => {
    setQuestionIdList(orderArr);
  };

  /** 下一步/发布 方法 */
  const thenFn = (newId: number) => {
    getBasicInfoDataFn(newId);
    setCurrentStep(currentStep + 1);
    setQuestionnaireId(newId);
  };
  const onClickFn = async () => {
    switch (currentStep) {
      case BasicInfo:
        form.submit(async (values: QuestionnaireReq & { deadline: string }) => {
          const deadline = moment(values.deadline).format(
            'YYYY-MM-DD 23:59:59',
          ) as any;
          if (isAdd) {
            await postSupplychainQuestionnaireAdd({
              req: { ...values, deadline },
            }).then(({ data }) => {
              const newId = Number(data?.data);
              navigate(
                virtualLinkTransform(
                  SccmRouteMaps.sccmQuestionnaireInfo,
                  [PAGE_TYPE_VAR, ':id'],
                  [PageTypeInfo.edit, newId],
                ),
              );
              setCurrentStep(currentStep + 1);
            });
          } else if (isCopy) {
            await postSupplychainQuestionnaireCopy({
              req: { ...values, id: Number(id), deadline },
            }).then(({ data }) => {
              const newId = Number(data?.data);
              thenFn(newId);
            });
          } else {
            await postSupplychainQuestionnaireEdit({
              req: { ...values, id: Number(id), deadline },
            }).then(({ data }) => {
              const newId = Number(data?.data);
              thenFn(newId);
            });
          }
        });
        break;
      case Design:
        if (hasQuestion) {
          if (questionIdList) {
            postSupplychainQuestionOrder({
              req: { questionIdList, questionnaireId },
            }).then(() => {
              getQuestionArr();
              setCurrentStep(currentStep + 1);
            });
          } else {
            setCurrentStep(currentStep + 1);
          }
        } else {
          Toast('error', '至少添加一道题目！');
        }
        break;
      case Publish:
        if (selectedsupplier?.length > 0) {
          postSupplychainQuestionnairePublish({
            req: {
              questionnaireId: isCopy ? questionnaireId : Number(id),
              supplierIdList: selectedsupplier,
            },
          }).then(() => {
            Toast('success', '问卷发布成功！');
            navigate(SccmRouteMaps.sccmQuestionnaire);
          });
        } else {
          Toast('error', '发布问卷-至少添加一家供应商！');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={style.supplyQuestionnaireInfoWrapper}>
      <Steps
        className={style.stepsClass}
        current={currentStep}
        onChange={current => setCurrentStep(current)}
        items={stepsItems}
      />

      {isBasicStep && (
        <Form
          form={form}
          previewTextPlaceholder='-'
          className={style.formClass}
        >
          <SchemaField schema={infoSchema(isEdit)} />
        </Form>
      )}

      {isDesign && (
        <div className={style.designClass}>
          <div className={style.designHead}>
            <h3>{basicInfoData?.questionnaireName || ''}</h3>
            <p>{basicInfoData?.questionnaireDesc || ''}</p>
            <div>
              <span className={style.designOrg}>
                所属组织：{basicInfoData?.orgName || '-'}
              </span>
              <span>
                截止日期：
                {(basicInfoData && `${basicInfoData?.deadline}`) || '-'}
              </span>
            </div>
          </div>

          <div
            className={hasQuestion ? style.designMain : style.designMainEmpty}
          >
            <div className={style.emptyIcon} hidden={hasQuestion}>
              <img src={emptyIcon} alt='' />
              <div>暂无内容</div>
            </div>
            {hasQuestion && (
              <QuestionnaireShow
                questionArr={questionArr}
                getQuestionArr={getQuestionArr}
                actionQuestion={actionQuestion}
                getCurrentOrderArr={getCurrentOrderArr}
              />
            )}
            {questionBtn(hasQuestion)}
          </div>
        </div>
      )}

      {isPublish && (
        <SupplierList
          saveSupplierFn={(value: number[]) => setSelectedsupplier(value)}
          orgId={orgId}
        />
      )}

      <FormActions
        place='center'
        buttons={compact([
          {
            title: isPublish ? '发布问卷' : '下一步',
            type: 'primary',
            onClick: onClickFn,
          },
          {
            title: '取消',
            onClick: async () => {
              navigate(SccmRouteMaps.sccmQuestionnaire);
            },
          },
        ])}
      />

      <DefaultQuestionModal
        open={questionModalOpen}
        questionModalOpenFn={questionModalOpenFn}
        id={questionnaireId}
        getQuestionArr={getQuestionArr}
      />

      <QuestionDrawer
        open={questionDrawerOpen}
        drawerOpenFn={questionDrawerOpenFn}
        isAddQuestion={isAddQuestion}
        questionnaireId={questionnaireId}
        getQuestionArr={getQuestionArr}
        currentQuestionId={currentQuestionId}
      />
    </div>
  );
}
export default SupplierManagementInfo;
