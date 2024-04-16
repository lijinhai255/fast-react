/*
 * @@description: 碳账户设置 新增 编辑
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
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';

import {
  getAccountsystemDeptId,
  postAccountsystemDept,
  putAccountsystemDept,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';

import { schema } from './schemas';

export enum StatusText {
  'ADD' = '新增',
  'EDIT' = '编辑',
}
export const SettingsModel = ({
  status,
  visable,
  onCancelFn,
  onOkFn,
  initValue,
}: {
  status: 'ADD' | 'EDIT';
  visable: boolean;
  onCancelFn: () => void;
  onOkFn: () => void;
  initValue: any;
}) => {
  const modelForm = createForm({
    readPretty: !(['ADD', 'EDIT'].indexOf(status) >= 0),
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      DatePicker,
    },
  });
  const [loading, setLoading] = useState(false);

  /** 场景详情 */
  useEffect(() => {
    if (initValue.id) {
      getAccountsystemDeptId({ id: initValue.id }).then(({ data }) => {
        const result = data?.data;
        modelForm.setValues({
          ...result,
          parentName:
            status === 'EDIT'
              ? result.parentName || '-'
              : result.deptName || '-',
          deptName: status === 'EDIT' ? initValue.deptName : undefined,
        });
      });
    }
  }, [initValue]);

  useEffect(() => {
    setLoading(false);
  }, [visable]);
  const handleOk = async () => {
    modelForm.submit(async value => {
      // console.log(value, 'value');
      const newVal = {
        parentId: value.id,
        deptName: value.deptName,
        orderNum: 0,
      };

      if (status === 'ADD') {
        await postAccountsystemDept({ dept: newVal }).then(({ data }) => {
          if (data.code === 200) {
            Toast('success', '新增成功');
            onOkFn();
          }
        });
      }
      if (status === 'EDIT') {
        await putAccountsystemDept({
          dept: {
            ...newVal,
            parentId: value.parentId,
            id: initValue.id,
          },
        }).then(({ data }) => {
          if (data.code === 200) {
            Toast('success', '编辑成功');
            onOkFn();
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
      title={`${status === 'ADD' ? '新增下级' : '编辑分组'}`}
      open={visable}
      maskClosable={false}
      footer={[
        <Button key='back' onClick={handleCancel}>
          取消
        </Button>,
        ['ADD', 'EDIT'].indexOf(status) >= 0 && (
          <Button
            key='submit'
            type='primary'
            loading={loading}
            onClick={handleOk}
          >
            保存
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
        <SchemaField schema={schema()} />
      </Form>
    </Modal>
  );
};
