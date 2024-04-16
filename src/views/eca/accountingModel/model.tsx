/*
 * @@description: 核算模型 新增 编辑  详情
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-01 18:28:58
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-28 20:40:34
 */
import {
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
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { virtualLinkTransform } from '@/router/utils/enums';
import {
  postComputationModelAdd,
  postComputationModelCopy,
  postComputationModelEdit,
} from '@/sdks/computation/computationV2ApiDocs';

import { schema } from './Info/utils/schemas';
import { TextArea } from '../component/TextArea';
import { UseOrgs } from '../hooks';

export enum StatusText {
  'ADD' = '新增',
  'SHOW' = '显示',
  'EDIT' = '编辑',
  'COPY' = '复制',
  'DEL' = '删除',
}
export const AccountingModel = ({
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
  const modelForm = createForm({
    readPretty: !(['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0),
    initialValues: initValue,
    effects() {
      onFormInit(async current => {
        const useOrgArr = await UseOrgs();
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, [visable]);
  const handleOk = async () => {
    modelForm.submit(async value => {
      if (status === 'ADD') {
        await postComputationModelAdd({ req: value }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
            navigate(
              virtualLinkTransform(
                EcaRouteMaps.accountingModelEmissionSource,
                [':id'],
                [data?.data as string],
              ),
            );
          }
        });
      }
      if (status === 'EDIT') {
        await postComputationModelEdit({
          req: {
            ...value,
            id: initValue.id,
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
          }
        });
      }
      if (status === 'COPY') {
        await postComputationModelCopy({
          req: {
            ...value,
            id: initValue.id,
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            onOkFn();
            navigate(
              virtualLinkTransform(
                EcaRouteMaps.accountingModelEmissionSource,
                [':id'],
                [data?.data as string],
              ),
            );
          }
        });
      }
    });
  };
  const handleCancel = () => {
    onCancelFn();
  };
  return (
    <Modal
      centered
      title={`${StatusText[status]}模型`}
      open={visable}
      maskClosable={false}
      footer={[
        <Button key='back' onClick={handleCancel}>
          {' '}
          取消
        </Button>,
        ['ADD', 'EDIT', 'COPY'].indexOf(status) >= 0 && (
          <Button
            key='submit'
            type='primary'
            loading={loading}
            onClick={handleOk}
          >
            {status === 'EDIT' ? '保存' : ' 保存，下一步'}
          </Button>
        ),
      ]}
      onOk={() => {}}
      onCancel={() => {
        onCancelFn();
        setLoading(false);
      }}
    >
      <Form form={modelForm} previewTextPlaceholder='-'>
        <SchemaField schema={schema(status)} />
      </Form>
    </Modal>
  );
};
