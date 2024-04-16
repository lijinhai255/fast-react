/*
 * @@description: 减排场景 新增 编辑 详情
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-28 15:37:18
 */
import {
  Cascader,
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
} from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import { FormConsumer, createSchemaField } from '@formily/react';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  ReductionSceneReq,
  getComputationReductionSceneId,
  postComputationReductionSceneAdd,
  postComputationReductionSceneEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import style from './index.module.less';
import { schema, totalSchema, unitSchema } from './utils/schemas';
import { Division, H4Compont, Median } from '../../component/Division';
import { CousCheckBox, CousRadio, TextArea } from '../../component/TextArea';
import { ReturnEmissionReductionScenarioOPtion, UseOrgs } from '../../hooks';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
    FormGrid,
    FormLayout,
    Checkbox,
    Radio,
    Median,
    Select,
    Cascader,
    TextArea,
    CousRadio,
    CousCheckBox,
  },
});
const OrgInfo = () => {
  const { id, pageTypeInfo, sercenId, serenPageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
    serenPageTypeInfo: PageTypeInfo;
    sercenId: string;
  }>();
  const [formValue, getFormValue] = useState<ReductionSceneReq>({});

  const useOrgArr = UseOrgs();
  const ReturnEmissionReductionScenarioOPtionArr =
    ReturnEmissionReductionScenarioOPtion();
  // 获取枚举值
  const enums = useAllEnumsBatch(`factorUnitM`);
  const form = useMemo(() => {
    return createForm<ReductionSceneReq>({
      readPretty:
        serenPageTypeInfo === PageTypeInfo.show ||
        pageTypeInfo === PageTypeInfo.show,
      initialValues: {
        sceneType: '1,2',
      },
      values: {
        sceneName: formValue?.sceneName,
        orgId: formValue?.orgId,
        sceneType: formValue?.sceneType,
        sceneDesc: formValue?.sceneDesc,
      },
      effects() {
        onFormInit(current => {
          // 获取当前用户下的组织
          current.setFieldState('orgId', {
            dataSource: useOrgArr?.map(item => {
              return {
                label: item.orgName,
                value: item.id,
              };
            }),
          });
        });
      },
    });
  }, [
    pageTypeInfo,
    id,
    useOrgArr,
    ReturnEmissionReductionScenarioOPtionArr,
    formValue,
  ]);
  const totalForm = useMemo(() => {
    return createForm<ReductionSceneReq>({
      readPretty:
        serenPageTypeInfo === PageTypeInfo.show ||
        pageTypeInfo === PageTypeInfo.show,
      initialValues: {
        totalLessenType: '0',
      },
      values: {
        totalDesc: formValue?.totalDesc,
        totalLessenType: formValue?.totalLessenType,
        totalStartValue: formValue?.totalStartValue,
        totalEndValue: formValue?.totalEndValue,
        totalUnit: formValue?.totalUnit,
      },
      effects() {
        onFormInit(current => {
          // 单位选项
          current.setFieldState('totalUnit', {
            dataSource: ReturnEmissionReductionScenarioOPtionArr,
          });
        });
      },
    });
  }, [pageTypeInfo, id, ReturnEmissionReductionScenarioOPtionArr, formValue]);
  const unitForm = useMemo(() => {
    return createForm<ReductionSceneReq>({
      // disabled: pageTypeInfo === PageTypeInfo.show,
      readPretty:
        serenPageTypeInfo === PageTypeInfo.show ||
        pageTypeInfo === PageTypeInfo.show,
      initialValues: {
        unitLessenType: '0',
      },
      values: {
        unitDesc: formValue?.unitDesc,
        unitLessenType: formValue?.unitLessenType,
        unitStartValue: formValue?.unitStartValue,
        unitEndValue: formValue?.unitEndValue,
        unitNumeratorUnit: formValue?.unitNumeratorUnit,
        unitDenominatorUnit: formValue?.unitDenominatorUnit,
      },
      effects() {
        onFormInit(current => {
          current.setFieldState('*.*.*.unitDenominatorUnit', {
            dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
          });
          current.setFieldState('*.*.*.unitNumeratorUnit', {
            dataSource: ReturnEmissionReductionScenarioOPtionArr,
          });
        });
      },
    });
  }, [
    pageTypeInfo,
    id,
    ReturnEmissionReductionScenarioOPtionArr,
    formValue,
    enums,
  ]);

  /** 获取组织信息 */
  useEffect(() => {
    // 查询节点信息
    if (id && PageTypeInfo.add !== pageTypeInfo) {
      getComputationReductionSceneId({ id: Number(sercenId) || +id }).then(
        ({ data }) => {
          // form.setValues(data?.data);
          getFormValue({
            ...data.data,
            // @ts-ignore
            totalLessenType: `${data?.data?.totalLessenType}`,
            // @ts-ignore
            unitLessenType: `${data?.data?.unitLessenType}`,
            // @ts-ignore
            sceneType: data?.data?.sceneType?.split(','),
            // @ts-ignore
            unitDenominatorUnit: data?.data?.unitDenominatorUnit?.split(','),
          });
        },
      );
    }
  }, []);
  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema(pageTypeInfo)} />
      </Form>
      <FormConsumer>
        {() => (
          <>
            {form?.values?.sceneType &&
              form?.values?.sceneType.indexOf('1') >= 0 && (
                <Form form={totalForm} previewTextPlaceholder='-'>
                  <Division />
                  <H4Compont>总减排量</H4Compont>
                  <SchemaField schema={totalSchema()} />
                </Form>
              )}

            {form?.values?.sceneType &&
              form?.values?.sceneType.indexOf('2') >= 0 && (
                <Form form={unitForm} previewTextPlaceholder='-'>
                  <Division />
                  <H4Compont>单位减排量</H4Compont>
                  <SchemaField schema={unitSchema(pageTypeInfo)} />
                </Form>
              )}
          </>
        )}
      </FormConsumer>
      <FormActions
        place='center'
        buttons={compact([
          (pageTypeInfo !== PageTypeInfo.show &&
            serenPageTypeInfo === PageTypeInfo.show) ||
          pageTypeInfo === PageTypeInfo.show
            ? ''
            : {
                title: '保存',
                type: 'primary',
                onClick: async () => {
                  await form.validate();
                  if (
                    form?.values?.sceneType &&
                    form?.values?.sceneType.indexOf('1') >= 0
                  ) {
                    await totalForm.validate();
                  }
                  if (
                    form?.values?.sceneType &&
                    form?.values?.sceneType.indexOf('2') >= 0
                  ) {
                    await unitForm.validate();
                  }
                  let finalData = {
                    ...form.values,
                  };
                  if (
                    form?.values?.sceneType &&
                    form?.values?.sceneType.indexOf('1') >= 0
                  ) {
                    finalData = {
                      ...finalData,
                      ...totalForm.values,
                    };
                  }
                  if (
                    form?.values?.sceneType &&
                    form?.values?.sceneType.indexOf('2') >= 0
                  ) {
                    finalData = {
                      ...finalData,
                      ...unitForm.values,
                      unitDenominatorUnit:
                        unitForm?.values?.unitDenominatorUnit?.toString() as unknown as ReductionSceneReq['unitNumeratorUnit'],
                    };
                  }
                  finalData = {
                    ...finalData,
                    sceneType: form?.values?.sceneType
                      ? form?.values?.sceneType.toString()
                      : '',
                  };
                  if (Number(id)) {
                    await postComputationReductionSceneEdit({
                      req: {
                        ...finalData,
                        id: Number(id),
                      },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        history.go(-1);
                      }
                    });
                    return;
                  }
                  await postComputationReductionSceneAdd({
                    req: {
                      ...finalData,
                    },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      history.go(-1);
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
