/**
 * @description 过程描述详情抽屉
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Drawer } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { IconFont } from '@/components/IconFont';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { publishYear } from '@/views/Factors/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { DRAWER_TITLE } from './constant';
import style from './index.module.less';
import { schema } from './schemas';

const { show } = PageTypeInfo;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    TextArea,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

interface ProcessDescribeProps<T extends object> {
  /** 操作按钮的类型 */
  actionBtnType?: string;
  /** 控制抽屉的显隐 */
  open: boolean;
  /** 过程描述详情 */
  processDescDataSource?: T;
  /** 保存方法 */
  onSave: (
    /** 表单要保存的数据 */
    values: T,
    /** 成功回调 */
    successCallBack: () => void,
    /** 失败回调 */
    failCallBack: () => void,
  ) => void;
  /** 关闭抽屉的方法 */
  onClose: () => void;
}

const ProcessDescribeDrawer = <T extends object = any>({
  actionBtnType,
  open,
  processDescDataSource,
  onSave,
  onClose,
}: ProcessDescribeProps<T>) => {
  const isDetail = actionBtnType === show;

  /** 抽屉标题 */
  const title = DRAWER_TITLE[actionBtnType as keyof typeof DRAWER_TITLE];

  /** 地理代表性枚举 */
  const areaRepresentOptions = useAllEnumsBatch('productOrigin')?.productOrigin;

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail],
  );

  /** 详情展示 */
  useEffect(() => {
    if (!actionBtnType || !processDescDataSource) {
      return;
    }
    form.setValues({
      ...processDescDataSource,
    });
  }, [processDescDataSource, actionBtnType]);

  /** 表单枚举 */
  useEffect(() => {
    if (!actionBtnType) {
      return;
    }

    /** 时间代表性 */
    form.setFieldState('timeRepresent', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });

    /** 地理代表性 */
    if (areaRepresentOptions) {
      form.setFieldState('areaRepresent', {
        dataSource: areaRepresentOptions.map(item => ({
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });
    }
  }, [areaRepresentOptions, actionBtnType]);

  /** 抽屉关闭 */
  const onDrawerClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Drawer
      className={`${style.wrapper}`}
      title={title}
      open={open}
      closeIcon={false}
      maskClosable={false}
      destroyOnClose
      placement='right'
      size='large'
      extra={
        <div className={style.closeIcon} onClick={() => onDrawerClose()}>
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => onDrawerClose()}
      footer={[
        <Button onClick={() => onDrawerClose()}>
          {isDetail ? '关闭' : '取消'}
        </Button>,
        !isDetail && (
          <Button
            type='primary'
            loading={btnLoading}
            onClick={async () => {
              const values = await form.submit<T>();
              setBtnLoading(true);
              onSave(
                values,
                () => {
                  Toast('success', '保存成功');
                  form.reset();
                  setBtnLoading(false);
                },
                () => {
                  setBtnLoading(false);
                },
              );
            }}
          >
            保存
          </Button>
        ),
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>
    </Drawer>
  );
};
export default ProcessDescribeDrawer;
