/**
 * @description 碳足迹报告详情抽屉
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Drawer } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { IconFont } from '@/components/IconFont';
import { PageTypeInfo } from '@/router/utils/enums';
import { OrgPojo } from '@/sdks_v2/new/systemV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { schema } from './schemas';
import { getModelList } from '../../CarbonFootprintModel/service';
import { Model } from '../../CarbonFootprintModel/type';
import { postReportAdd, postReportEdit, getReportDetail } from '../service';
import { Report } from '../type';

const { add, show } = PageTypeInfo;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

export const CarbonFootprintReportInfo = ({
  open,
  actionBtnType,
  reportId,
  orgList,
  onOk,
  onClose,
}: {
  /** 抽屉的显隐 */
  open: boolean;
  /** 列表操作按钮的类型 */
  actionBtnType?: string;
  /** 报告ID */
  reportId?: number;
  /** 所属组织的枚举 */
  orgList: OrgPojo[];
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}) => {
  const isAdd = actionBtnType === add;
  const isDetail = actionBtnType === show;

  /** 抽屉的标题 */
  const title = isDetail ? '报告详情' : reportId ? '编辑报告' : '新增报告';

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  /** 选择的组织ID */
  const [currentOrgId, setCurrentOrgId] = useState<number>();

  /** 模型模型枚举 */
  const [modelOptions, setModelOptions] = useState<Model[]>();

  /** 选择的模型名称id */
  const [currentModelId, setCurrentModelId] = useState<number>();

  /** 报告详情 */
  const [reportDetail, setReportDetail] = useState<Report>();

  /** 保存时的api接口 */
  const api = isAdd ? postReportAdd : postReportEdit;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [actionBtnType],
  );

  /** 监听form的变化 */
  const onAddFormListenerFn = () => {
    form.addEffects('modelId', () => {
      onFieldValueChange('orgId', field => {
        form.reset('*(modelId, functionalUnit, productName, productionCycle)');
        setModelOptions(undefined);
        setCurrentOrgId(field.value);
      });
      onFieldValueChange('modelId', field => {
        form.reset('*(functionalUnit, productName, productionCycle)');
        setCurrentModelId(field.value);
      });
    });
  };

  /** 获取模型名称的枚举 */
  useEffect(() => {
    if (!currentOrgId) {
      setModelOptions(undefined);
      return;
    }
    getModelList({
      pageNum: 1,
      pageSize: 1000000,
      orgId: currentOrgId,
    }).then(({ data }) => {
      setModelOptions(data?.data?.list);
    });
  }, [currentOrgId]);

  /** 根据选择的模型名称，带出功能单位、产品名称、生产周期 */
  useEffect(() => {
    if (currentModelId && modelOptions) {
      const modelItem = modelOptions?.find(v => v.id === currentModelId);
      const { functionalUnit, productName, productionCycle } = modelItem || {};
      form.setValues({
        functionalUnit,
        productName,
        productionCycle,
      });
    }
  }, [currentModelId, modelOptions]);

  useEffect(() => {
    /** 新增时 */
    if (isAdd && !reportId) {
      /** 监听表单 */
      onAddFormListenerFn();
    }
    if (!isAdd && reportId) {
      /** 编辑时，所属组织不能编辑 */
      form.setFieldState('orgId', {
        disabled: true,
        required: false,
      });

      /** 获取报告详情 */
      getReportDetail({ id: reportId }).then(({ data }) => {
        /** 当前所选的组织ID */
        setCurrentOrgId(data?.data?.orgId);
        /** 设置报告详情 */
        setReportDetail(data?.data);
      });
    }
  }, [isAdd, reportId]);

  /** 报告详情反显 */
  useEffect(() => {
    if (modelOptions && reportDetail) {
      form.setValues({
        ...reportDetail,
      });
      /** 监听表单 */
      onAddFormListenerFn();
    }
  }, [reportDetail, modelOptions]);

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

    /** 模型名称 */
    form.setFieldState('modelId', {
      dataSource: modelOptions?.map(item => ({
        ...item,
        label: item.name,
        value: item.id,
      })),
    });
  }, [orgList, modelOptions, actionBtnType]);

  /** 关闭弹窗初始化 */
  const onCloseInit = () => {
    setCurrentModelId(undefined);
    setModelOptions(undefined);
    setCurrentOrgId(undefined);
    setReportDetail(undefined);
    form.reset();
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
        <div
          className={style.closeIcon}
          onClick={() => {
            onCloseInit();
            onClose();
          }}
        >
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => {
        onCloseInit();
        onClose();
      }}
      footer={[
        <Button
          onClick={() => {
            onCloseInit();
            onClose();
          }}
        >
          {isDetail ? '关闭' : '取消'}
        </Button>,
        !isDetail && (
          <Button
            type='primary'
            loading={btnLoading}
            onClick={async () => {
              const values = await form.submit<Report>();
              try {
                setBtnLoading(true);
                await api(values);
                Toast('success', '保存成功');
                setBtnLoading(false);
                onCloseInit();
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
