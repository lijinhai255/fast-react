/*
 * @@description: 碳账户设置 新增 编辑  详情
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-03-01 18:28:58
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-07-17 19:13:53
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

import { postAccountsystemUserBehaviorRollBackBehavior } from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';

import { schema } from './Info/schemas';

export enum StatusText {
  'ADD' = '新增',
  'EDIT' = '编辑',
}
export const RevokeModel = ({
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

  useEffect(() => {
    setLoading(false);
  }, [visable]);
  const handleOk = async () => {
    modelForm.submit(async value => {
      // console.log(value, 'value', initValue);
      const newVal = {
        id: Number(initValue.id),
        ...value,
      };
      if (status === 'ADD') {
        await postAccountsystemUserBehaviorRollBackBehavior({
          qo: newVal,
        }).then(({ data }) => {
          if (data.code === 200) {
            Toast('success', '撤销成功');
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
      title='撤销活动数据'
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
      撤销活动数据，将同步扣除积分和减排量数据，确认撤销？
      <Form form={modelForm} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>
    </Modal>
  );
};
