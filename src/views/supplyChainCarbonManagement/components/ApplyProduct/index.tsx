/*
 * @@description: 申请产品碳足迹 （供应商管理-采购产品管理，采购产品管理-供应商管理）
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-24 16:12:42
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-18 22:04:03
 */
import {
  Cascader,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import dayjs from 'dayjs';
import { compact } from 'lodash-es';
import { useEffect, useMemo } from 'react';

import { FormActions } from '@/components/FormActions';
import {
  ApplyFootprintReq,
  ApplyInfoResp,
  postSupplychainApplyProductApply,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { infoSchema } from './utils/schemas';
import style from '../../SupplierManagement/Info/index.module.less';
import { useSupplyChainEnums } from '../../hooks/useEnums';

function ApplyProduct({
  id,
  supplierId,
  productId,
  cathRecord,
}: {
  /** 点击的数据id */
  id?: string;
  /** 供应商id */
  supplierId?: string;
  /** 采购产品id */
  productId?: string;
  /** 默认带过来的数据信息 */
  cathRecord?:
    | ApplyInfoResp
    | {
        productUnit: (string | number)[];
      };
}) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      TextArea,
      DatePicker,
      Radio,
      Cascader,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 核算数量单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 数据请求类型枚举值 */
  const applyTypeEnums = useSupplyChainEnums('ApplyType');

  /** 系统边界要求枚举值  */
  const periodTypeEnums = useSupplyChainEnums('PeriodType');

  const form = useMemo(() => createForm(), []);

  /** 设置枚举值 */
  useEffect(() => {
    /** 数据请求类型 */
    if (applyTypeEnums) {
      form.setFieldState('applyType', {
        dataSource: applyTypeEnums.map(item => ({
          label: `产品碳足迹${item.name}`,
          value: item.code,
        })),
      });
    }
    /** 系统边界要求  */
    if (periodTypeEnums) {
      form.setFieldState('periodType', {
        dataSource: periodTypeEnums.map(item => ({
          label:
            item.code === 1
              ? `${item.name}（从资源开采到产品出厂：原材料获取、生产制造、分销和储存）`
              : `${item.name} （从资源开采到产品废弃：原材料获取、生产制造、分销和储存、产品使用、废弃处置）`,
          value: item.code,
        })),
      });
    }
    /** 默认带过来展示的值 */
    if (cathRecord && accountsUnitsList) {
      form.setValues({
        ...cathRecord,
      });
    }
    /** 核算单位 */
    if (accountsUnitsList) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('.productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [applyTypeEnums, periodTypeEnums, cathRecord, accountsUnitsList]);

  return (
    <div className={style.supplyManagementInfoWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={infoSchema()} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '提交申请',
            type: 'primary',
            onClick: async () => {
              form.submit((values: ApplyFootprintReq) => {
                const { deadline, applyType, periodType, requireDesc } = values;
                const result = {
                  applyType,
                  periodType,
                  requireDesc,
                  id: id ? Number(id) : undefined,
                  supplierId: supplierId ? Number(supplierId) : undefined,
                  productId: productId ? Number(productId) : undefined,
                  deadline: dayjs(deadline).format('YYYY-MM-DD HH:mm:ss'),
                };

                return postSupplychainApplyProductApply({
                  req: result as unknown as ApplyFootprintReq,
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', '已申请，请在供应商碳数据中查看');
                    history.back();
                  }
                });
              });
            },
          },
          {
            title: '取消',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default ApplyProduct;
