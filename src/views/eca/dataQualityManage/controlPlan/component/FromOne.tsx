/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-22 10:07:28
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-20 18:22:30
 */
import {
  Form,
  DatePicker,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { FormOneSchema } from '@views/eca/dataQualityManage/utils/chema';
import { useImperativeHandle } from 'react';

import {
  ControlPlanResp,
  postComputationControlPlanEditVersion,
} from '@/sdks/computation/computationV2ApiDocs';
import { Toast } from '@/utils';
import { TextArea } from '@/views/eca/component/TextArea';
import { UseOrgs } from '@/views/eca/hooks';

export type SubmitFormOneRef = {
  submitFormOne: () => void;
};
export const FormOne = ({
  isEdit,
  currentPlanIndex,
  childRefFormOne,
  formValue,
  controlPlanIdFn,
}: {
  isEdit: boolean;
  childRefFormOne?: React.MutableRefObject<SubmitFormOneRef | undefined>;
  currentPlanIndex: number;
  formValue: ControlPlanResp;
  controlPlanIdFn: () => void;
}) => {
  const useOrgArr = UseOrgs();
  // 版本及修订表单
  const formOne = createForm<{
    id: number;
    orgId: number;
    planContent: string;
    planDate: string;
    remark: string;
    version: string;
  }>({
    readPretty: !isEdit,
    visible: currentPlanIndex === 1,
    values: formValue,
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
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
      TextArea,
    },
  });
  // 父组件主动触发
  useImperativeHandle(childRefFormOne, () => ({
    /** 重新加载数据 */
    submitFormOne: async () => {
      formOne.submit(async value => {
        const submitValue = {
          id: value.id,
          orgId: value.orgId,
          planContent: value.planContent,
          planDate: value.planDate,
          remark: value.remark,
          version: value.version,
        };
        await postComputationControlPlanEditVersion({
          req: {
            ...submitValue,
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            controlPlanIdFn();
            Toast('success', '保存成功');
          }
        });
      });
    },
  }));
  return (
    <Form form={formOne} previewTextPlaceholder='-'>
      <SchemaField schema={FormOneSchema()} />
    </Form>
  );
};
