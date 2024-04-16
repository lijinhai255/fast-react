/**
 * @description 数据质量控制弹窗
 */
import {
  Cascader,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Modal, message } from 'antd';

import { AntProvider } from '@/components/AntdProvider';
import {
  postComputationControlPlanAdd,
  postComputationControlPlanCopy,
  postComputationControlPlanProductAdd,
  postComputationControlPlanProductEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  changeFactorM2cascaderOptions,
  gasEnumsMap,
} from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import { controlSchema, schema } from './chema';
import { TextArea } from '../../component/TextArea';
import { UseOrgs } from '../../hooks';

export enum StatusText {
  'ADD' = '新增',
  'SHOW' = '查看',
  'EDIT' = '编辑',
  'COPY' = '复制',
  'DEL' = '删除',
}
export const DataQualityModel = ({
  status,
  visable,
  onCancelFn,
  onOkFn,
  initValue,
}: {
  status: 'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL';
  visable: boolean;
  onCancelFn: () => void;
  onOkFn: () => void;
  initValue: { [key: string]: any };
}) => {
  const useOrgArr = UseOrgs();

  const modelForm = createForm({
    readPretty: !(['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0),
    initialValues: initValue,
    effects() {
      onFormInit(async current => {
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
  const handleCancel = () => {
    onCancelFn();
  };
  const handleOk = () => {
    modelForm.submit(async value => {
      if (status === 'ADD') {
        await postComputationControlPlanAdd({
          req: { ...value },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
            message.success('保存成功');
          }
        });
      }
      if (status === 'COPY') {
        await postComputationControlPlanCopy({
          req: { ...value, id: initValue.id },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
            message.success('保存成功');
          }
        });
      }
    });
  };
  return (
    <Modal
      centered
      title={`${StatusText[status]}控制计划`}
      open={visable}
      maskClosable={false}
      footer={[
        <Button key='back' onClick={handleCancel}>
          {' '}
          取消
        </Button>,
        ['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0 && (
          <Button key='submit' type='primary' onClick={handleOk}>
            保存
          </Button>
        ),
      ]}
      onOk={() => {
        handleOk();
      }}
      onCancel={() => {
        onCancelFn();
      }}
    >
      <AntProvider>
        <Form form={modelForm} previewTextPlaceholder='-'>
          <SchemaField schema={schema()} />
        </Form>
      </AntProvider>
    </Modal>
  );
};

export const ProductModel = ({
  status,
  visable,
  onCancelFn,
  onOkFn,
  initValue,
}: {
  status: 'ADD' | 'SHOW' | 'EDIT' | 'COPY' | 'DEL';
  visable: boolean;
  onCancelFn: () => void;
  onOkFn: () => void;
  initValue: { [key: string]: any };
}) => {
  const enums = useAllEnumsBatch(
    `${Object.values(gasEnumsMap).join(',')},factorUnitM`,
  );
  const modelForm = createForm({
    readPretty: !(['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0),
    initialValues: initValue,
    effects() {
      onFormInit(async currentForm => {
        currentForm.setFieldState('serviceUnit', {
          dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
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
      Cascader,
      TextArea,
    },
  });
  const handleCancel = () => {
    onCancelFn();
  };
  const handleOk = () => {
    modelForm.submit(async value => {
      const controlPlanId =
        new URLSearchParams(location.search).get('id') || '';

      if (status === 'ADD') {
        await postComputationControlPlanProductAdd({
          req: {
            ...value,
            controlPlanId: Number(controlPlanId),
            serviceUnit: value?.serviceUnit?.toString(),
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
          }
        });
      }
      if (status === 'EDIT') {
        await postComputationControlPlanProductEdit({
          req: {
            ...value,
            controlPlanId: Number(controlPlanId),
            serviceUnit: value?.serviceUnit?.toString(),
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
          }
        });
      }
    });
  };
  return (
    <Modal
      centered
      title={`${StatusText[status]}产品或服务`}
      open={visable}
      maskClosable={false}
      footer={[
        <Button key='back' onClick={handleCancel}>
          {' '}
          取消
        </Button>,
        ['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0 && (
          <Button key='submit' type='primary' onClick={handleOk}>
            保存
          </Button>
        ),
      ]}
      onOk={() => {
        handleOk();
      }}
      onCancel={() => {
        onCancelFn();
      }}
    >
      <AntProvider>
        <Form form={modelForm} previewTextPlaceholder='-'>
          <SchemaField schema={controlSchema()} />
        </Form>
      </AntProvider>
    </Modal>
  );
};
