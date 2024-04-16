/*
 * @@description: 质量管理规定 详情 编辑
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-22 10:07:28
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-05-06 14:38:15
 */
import {
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm, onFormMount } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { ControlDetailSchema } from '@views/eca/dataQualityManage/utils/chema';
import { compact } from 'lodash-es';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import {
  getComputationControlPlanDataId,
  postComputationControlPlanEditPlan,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast } from '@/utils';

import { TextArea } from '../../component/TextArea';

export type SubmitFormSixRef = {
  submitFormSix: () => void;
};
const ControlPlan = () => {
  const { id, controlPlanId, standardType } = useParams<{
    id: string;
    controlPlanId: string;
    standardType: string;
  }>();
  // const controlPlanId =
  //   new URLSearchParams(location.search).get('controlPlanId') || '';
  // const standardType =
  // new URLSearchParams(location.search).get('standardType') || '';
  // 版本及修订表单
  const formSix = createForm({
    readPretty: window.location?.pathname.indexOf('show') >= 0,
    // disabled: window.location?.pathname.indexOf('show') >= 0,
    effects() {
      onFormMount(current => {
        current.setFieldState('isoCategory_name', {
          display: Number(standardType) === 2 ? 'visible' : 'hidden',
        });
        current.setFieldState('isoClassify_name', {
          display: Number(standardType) === 2 ? 'visible' : 'hidden',
        });
        current.setFieldState('ghgCategory_name', {
          display: Number(standardType) === 2 ? 'hidden' : 'visible',
        });
        current.setFieldState('ghgClassify_name', {
          display: Number(standardType) === 2 ? 'hidden' : 'visible',
        });
      });
    },
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
      Checkbox,
      TextArea,
    },
  });
  const getControlDetailFn = async () => {
    await getComputationControlPlanDataId({
      id: Number(controlPlanId),
    }).then(({ data }) => {
      if (data.code === 200) {
        formSix.setInitialValues({
          ...data.data,
          calculateType: data?.data?.calculateType?.split(','),
        });
      }
    });
  };
  useEffect(() => {
    getControlDetailFn();
  }, []);

  return (
    <div style={{ marginBottom: '40px' }}>
      <Form form={formSix} previewTextPlaceholder='-'>
        <SchemaField schema={ControlDetailSchema()} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          window.location.pathname.indexOf('show') === -1 && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              formSix.submit(async value => {
                const submitValue = value?.computationFlag
                  ? {
                      activityDesc: value?.activityDesc,
                      calculateDesc: value?.calculateDesc,
                      calculateType: value?.calculateType?.toString(),
                      collectDesc: value?.collectDesc,
                      computationFlag: value?.computationFlag,
                      controlPlanId: Number(id),
                      id: Number(controlPlanId),
                      storageDesc: value?.storageDesc,
                    }
                  : {
                      activityDesc: value?.activityDesc,
                      controlPlanId: Number(id),
                      id: Number(controlPlanId),
                      computationFlag: value?.computationFlag,
                    };
                await postComputationControlPlanEditPlan({
                  req: {
                    ...submitValue,
                  },
                }).then(() => {
                  history.go(-1);
                  Toast('success', '保存成功');
                });
              });
            },
          },
          {
            title: '取消',
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};
export default ControlPlan;
