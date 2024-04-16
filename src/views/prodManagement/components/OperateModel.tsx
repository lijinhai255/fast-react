import {
  Cascader,
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';
import { useEffect, useMemo } from 'react';

import {
  OperationMetrics,
  OperationMetricsReq,
  postComputationOperationMetricsAdd,
  postComputationOperationMetricsEdit,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import { CurrentModalObj, PageType } from '../type';

/*
 * @@description:
 */
export const OperateModel = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseFn: () => void;
  currentData: OperationMetrics;
  currentModal: PageType;
}) => {
  const { open, setOpen, onCloseFn, currentData, currentModal } = props;
  const form = useMemo(() => {
    return createForm<OperationMetricsReq>({
      readPretty: currentModal === 'SHOW',
    });
  }, [open]);
  // 枚举值分别为 分母单位
  const enums = useAllEnumsBatch(`factorUnitM`);

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormLayout,
      Cascader,
      Select,
    },
  });
  useEffect(() => {
    // currentData 编辑使用的缓存数据
    if (currentData?.metricsUnit) {
      form.setValues({
        ...currentData,
        metricsUnit: (currentData.metricsUnit as string)?.split(','),
      });
    }
    form.setFieldState('metricsUnit', {
      dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
    });
  }, [enums, open, currentData]);
  return (
    <Modal
      title={`${CurrentModalObj[currentModal]}运营指标`}
      centered
      open={open}
      onOk={() => {
        form.submit(
          async (
            values: OperationMetricsReq & {
              metricsUnit?: string | string[]; // 此处使用联合类型，支持字符串或字符串数组
            },
          ) => {
            const req = {
              ...values,
              metricsUnit:
                typeof values?.metricsUnit === 'object'
                  ? (values?.metricsUnit as string[]).join(',')
                  : values?.metricsUnit,
            };
            // 新增和编辑 区分
            const { data } = currentData.id
              ? await postComputationOperationMetricsEdit({
                  req: {
                    ...req,
                    id: Number(currentData.id),
                  },
                })
              : await postComputationOperationMetricsAdd({
                  req,
                });
            if (data.code === 200) {
              setOpen(false);
              onCloseFn();
              form.reset();
            } else {
              data.msg && Toast('error', data.msg);
            }
          },
        );
      }}
      onCancel={() => {
        setOpen(false);
        form.reset();
        onCloseFn();
      }}
    >
      <Form form={form}>
        <SchemaField
          schema={{
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  layout: 'vertical',
                },
                properties: {
                  metricsName: {
                    type: 'string',
                    title: '指标名称',
                    'x-validator': [
                      { required: true, message: '请输入指标名称' },
                    ],
                    'x-component': 'Input',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      placeholder: '请输入指标名称',
                      maxLength: 100,
                    },
                  },
                  metricsUnit: {
                    type: 'string',
                    title: '指标单位',
                    'x-validator': [
                      { required: true, message: '请选择指标单位' },
                    ],
                    'x-component': 'Cascader',
                    'x-decorator': 'FormItem',
                    'x-component-props': {
                      placeholder: '请选择指标单位',
                    },
                  },
                },
              },
            },
          }}
        />
      </Form>
    </Modal>
  );
};
