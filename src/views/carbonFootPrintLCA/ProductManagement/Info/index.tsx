/**
 * @description 产品信息管理详情抽屉
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
import { OrgPojo } from '@/sdks_v2/new/systemV2ApiDocs';
import { Toast } from '@/utils';
import { TextArea } from '@/views/eca/component/TextArea';

import style from './index.module.less';
import { schema } from './schemas';
import {
  postProductionAdd,
  postProductionEdit,
  getProductionDetail,
} from '../service';
import { Product } from '../type';

const { add, edit, show } = PageTypeInfo;

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
interface ProductManagementInfoProps {
  /** 抽屉的显隐 */
  open: boolean;
  /** 列表操作按钮的类型 */
  actionBtnType?: string;
  /** 产品ID */
  productId?: number;
  /** 所属组织的枚举 */
  orgList: OrgPojo[];
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}
export const ProductManagementInfo = ({
  open,
  actionBtnType,
  productId,
  orgList,
  onOk,
  onClose,
}: ProductManagementInfoProps) => {
  const isAdd = actionBtnType === add;
  const isDetail = actionBtnType === show;

  /** 抽屉标题 */
  const titleMap = {
    [add]: '新增产品',
    [edit]: '编辑产品',
    [show]: '产品详情',
  };
  const title = titleMap[actionBtnType as keyof typeof titleMap];

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  /** 保存时的api接口 */
  const postApi = isAdd ? postProductionAdd : postProductionEdit;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [actionBtnType],
  );

  /** 关闭弹窗初始化 */
  const onCloseInit = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    /** 新增时：产品编码自动生成 */
    if (isAdd && !productId) {
      form.setFieldState('code', {
        value: new Date().getTime(),
      });
    }
    /** 获取产品详情 */
    if (!isAdd && productId) {
      /** 编辑时，所属组织不能编辑 */
      form.setFieldState('orgId', {
        disabled: true,
        required: false,
      });

      getProductionDetail({ id: productId }).then(({ data }) => {
        form.setValues({
          ...data?.data,
        });
      });
    }
  }, [isAdd, productId]);

  /** 设置表单枚举值 */
  useEffect(() => {
    if (!actionBtnType) {
      return;
    }
    if (orgList) {
      /** 所属组织 */
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
        })),
      });
    }
  }, [orgList, actionBtnType]);

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
        <div className={style.closeIcon} onClick={() => onCloseInit()}>
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => onCloseInit()}
      footer={[
        <Button onClick={() => onCloseInit()}>
          {isDetail ? '关闭' : '取消'}
        </Button>,
        !isDetail && (
          <Button
            type='primary'
            loading={btnLoading}
            onClick={async () => {
              const values = await form.submit<Product>();
              try {
                setBtnLoading(true);
                await postApi(values);
                Toast('success', '保存成功');
                setBtnLoading(false);
                form.reset();
                onOk();
              } catch (e) {
                setBtnLoading(false);
                throw e;
              }
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
