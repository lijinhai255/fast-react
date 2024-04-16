/*
 * @@description: 产品碳足迹-核算结果
 */
import {
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
import { Modal } from 'antd';
import { compact, omit } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import {
  FootprintResultReq,
  postSupplychainDataFillFootprintSave,
  postSupplychainDataFillFootprintSaveAndSubmit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast, modalText } from '@/utils';
import { publishYear } from '@/views/Factors/utils';
import { modelFooterBtnStyle } from '@/views/carbonFootPrint/utils';
import AuditConfigTable from '@/views/components/AuditConfigTable';
import { ADUDIT_REQUIRED_TYPE } from '@/views/dashborad/Approval/Info/constant';

import { schema } from './utils/schemas';
import { getAuditConfig } from '../../CarbonDataFill/service';
import { onUploadFileFn } from '../../utils';
import { CarbonDataPropsType } from '../../utils/type';

const { NOT_REQUIRED } = ADUDIT_REQUIRED_TYPE;

function CarbonFootPrintResult({
  /** 数据id */
  id,
  /** 上传的报告列表 */
  fileList,
  /** 当前引用的模块类型 */
  currentModalType,
  /** 是否存在底部的操作按钮 */
  hasAction,
  /** 表单是否不可编辑 */
  disabled,
  /** 数据详情 */
  cathRecord,
  /** 结果数据详情 */
  footprintResult,
}: CarbonDataPropsType) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      NumberPicker,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 产品碳足迹系统边界 */
  const [periodType, setPeriodType] = useState<1 | 2>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: disabled,
        initialValues: {
          productName: cathRecord?.productName,
          productUnit: cathRecord?.productUnit,
          productModel: cathRecord?.productModel,
        },
      }),
    [periodType, cathRecord],
  );

  /** 根据申请的产品碳足迹展示具体的阶段 */
  useEffect(() => {
    if (cathRecord) {
      setPeriodType(Number(cathRecord?.periodType) as 1 | 2);
    }
  }, [cathRecord]);

  /** 产品碳足迹结果详情 */
  useEffect(() => {
    if (footprintResult && periodType) {
      form.setValues({
        ...footprintResult,
      });
    }
  }, [periodType, footprintResult]);

  /** 设置枚举值 */
  useEffect(() => {
    if (!periodType) return;
    /** 核算年份 */
    form.setFieldState('year', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });
  }, [periodType]);

  return (
    <div>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema(currentModalType, periodType)} />
      </Form>
      {hasAction && (
        <FormActions
          place='center'
          buttons={compact([
            !disabled && {
              title: '保存并提交',
              type: 'primary',
              onClick: async () => {
                form.submit(
                  async (
                    values: FootprintResultReq & {
                      productName: string;
                      productUnit: string;
                      productModel: string;
                    },
                  ) => {
                    const result = omit(
                      {
                        ...values,
                        applyInfoId: Number(id),
                      },
                      ['productName', 'productUnit', 'productModel'],
                    );

                    const { data } = await getAuditConfig({
                      applyInfoId: Number(id),
                    });

                    const { auditRequired, nodeList } = data?.data || {};

                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content:
                        /** 不需要审批 则展示弹窗提示 否则展示审批路程 */
                        auditRequired === NOT_REQUIRED ? (
                          <span>
                            确认提交该数据：
                            <span className={modalText}>
                              {cathRecord?.productName}: 产品碳足迹核算结果？
                            </span>
                          </span>
                        ) : (
                          <AuditConfigTable dataSource={nodeList} />
                        ),
                      ...modelFooterBtnStyle,
                      onOk: () => {
                        postSupplychainDataFillFootprintSaveAndSubmit({
                          req: result as FootprintResultReq,
                        }).then(({ data }) => {
                          if (data.code === 200) {
                            onUploadFileFn(
                              Number(id),
                              JSON.stringify(fileList),
                            );
                            Toast('success', '已提交，请等待客户反馈');
                            history.back();
                          }
                        });
                      },
                    });
                  },
                );
              },
            },
            !disabled && {
              title: '保存',
              onClick: async () => {
                form.submit(
                  (
                    values: FootprintResultReq & {
                      productName: string;
                      productUnit: string;
                      productModel: string;
                    },
                  ) => {
                    const result = omit(
                      {
                        ...values,
                        applyInfoId: Number(id),
                      },
                      ['productName', 'productUnit', 'productModel'],
                    );
                    postSupplychainDataFillFootprintSave({
                      req: result as FootprintResultReq,
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        onUploadFileFn(Number(id), JSON.stringify(fileList));
                        Toast('success', '保存成功');
                        history.back();
                      }
                    });
                  },
                );
              },
            },
            {
              title: '返回',
              onClick: async () => {
                history.back();
              },
            },
          ])}
        />
      )}
    </div>
  );
}
export default CarbonFootPrintResult;
