/*
 * @@description: 新增 编辑  详情
 */
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
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';

import { postAccountsystemInventoryRecord } from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';

import { schema } from './schemas';

export enum StatusText {
  'IN' = '入库',
  'OUT' = '出库',
}

export const InventoryModel = ({
  status,
  visable,
  onCancelFn,
  onOkFn,
  initValue,
}: {
  status: 'IN' | 'OUT';
  visable: boolean;
  onCancelFn: () => void;
  onOkFn: () => void;
  initValue: { [key: string]: any };
}) => {
  const modelForm = createForm({
    readPretty: !(['IN', 'OUT'].indexOf(status) >= 0),
    initialValues: initValue,
    // effects() {
    //   onFormInit(async current => {
    //     const useOrgArr = await UseOrgs();
    //     current.setFieldState('orgId', {
    //       dataSource: useOrgArr?.map(item => {
    //         return {
    //           label: item.orgName,
    //           value: item.id,
    //         };
    //       }),
    //     });
    //   });
    // },
  });
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      FormGrid,
      FormLayout,
      Select,
      NumberPicker,
      DatePicker,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [visable]);
  const handleOk = async () => {
    modelForm.submit(async value => {
      // console.log(value, 'value');
      const newVal = {
        changeType: 0,
        changeCount: value.changeCount,
        goodsId: value.goodsId,
      };
      if (status === 'IN') {
        await postAccountsystemInventoryRecord({
          ro: newVal,
        } as any).then(({ data }) => {
          if (data.code === 200) {
            Toast('success', '入库成功');
            onOkFn();
          }
        });
      }
      if (status === 'OUT') {
        newVal.changeType = 1;
        await postAccountsystemInventoryRecord({
          ro: newVal,
        } as any).then(({ data }) => {
          if (data.code === 200) {
            Toast('success', '出库成功');
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
      title={`商品${StatusText[status]}`}
      open={visable}
      maskClosable={false}
      footer={[
        <Button key='back' onClick={handleCancel}>
          取消
        </Button>,
        ['IN', 'OUT'].indexOf(status) >= 0 && (
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
        <SchemaField schema={schema(status)} />
      </Form>
    </Modal>
  );
};
