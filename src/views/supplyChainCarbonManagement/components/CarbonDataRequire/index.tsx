/*
 * @@description: 数据请求/数据要求 （供应商碳数据、碳数据审核、碳数据填报）
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-01 17:26:02
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-20 17:12:19
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  DatePicker,
  Radio,
  Checkbox,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { useEffect, useMemo, useState } from 'react';

import { TextArea } from '@/views/eca/component/TextArea';
import { ComputationEnums } from '@/views/eca/hooks';

import {
  enterpriseInfoSchema,
  productInfoSchema,
  questionnaireInfoSchema,
} from './utils/schemas';
import { CarbonFillType } from '../../utils';
import { CarbonDataPropsType } from '../../utils/type';

function CarbonDataRequire({
  /** 模块的类型 fill 为填报页面 */
  currentModalType,
  /** 数据类型 1: 企业碳核算 2:产品碳足迹 3:低碳问卷*/
  dataType,
  /** 数据详情 */
  cathRecord,
}: CarbonDataPropsType) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      DatePicker,
      Radio,
      Checkbox,
      TextArea,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 是否为碳数据填报页面 */
  const isFill = currentModalType === 'fill';

  /** 企业碳核算标准枚举值  */
  const standardTypeEnums = ComputationEnums('StandardType');

  /** GHG核算范围枚举值 */
  const ghgCategoriesEnums = ComputationEnums('GHGCategory');

  /** ISO核算范围枚举值 */
  const isoCategoriesEnums = ComputationEnums('ISOCategory');

  /** 获取企业碳核算标准 */
  const [standardTypes, setStandardTypes] = useState<number[]>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: true,
      }),
    [],
  );

  /** 详情数据 */
  useEffect(() => {
    if (cathRecord) {
      /** 企业核算标准 */
      const standardTypesBack = cathRecord?.standardTypes
        ?.split(',')
        .map(v => Number(v));

      setStandardTypes(standardTypesBack);
    }
  }, [cathRecord]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 企业碳核算标准  */
    if (standardTypeEnums) {
      form.setFieldState('standardTypes', {
        dataSource: standardTypeEnums.map(item => ({
          ...item,
          label: item.value === 1 ? 'GHG Protocol' : 'ISO 14064-1:2018',
        })),
      });
    }
  }, [standardTypeEnums]);

  /** 切换企业碳核算标准 */
  useEffect(() => {
    if (
      standardTypes &&
      ghgCategoriesEnums &&
      isoCategoriesEnums &&
      cathRecord &&
      standardTypeEnums
    ) {
      const {
        applyType_name = '',
        periodType_name = '',
        periodType,
      } = cathRecord || {};

      /** 表单赋值 */
      form.setValues({
        ...cathRecord,
        applyType_name:
          Number(dataType) === 1
            ? `企业碳${applyType_name}`
            : `产品碳足迹${applyType_name}`,
        periodType_name:
          Number(periodType) === 1
            ? `${periodType_name}（从资源开采到产品出厂：原材料获取、生产制造、分销和储存）`
            : `${periodType_name}（从资源开采到产品废弃：原材料获取、生产制造、分销和储存、产品使用、废弃处置）`,
        standardTypes,
      });

      const { ghgCategories, isoCategories } = cathRecord || {};
      /** 核算范围（GHG Protocol）*/
      if (standardTypes.includes(1)) {
        form.setFieldState('ghgCategories', {
          dataSource: ghgCategoriesEnums,
          value: ghgCategories ? ghgCategories?.split(',') : [],
        });
      }
      /** 核算范围（ISO 14064-1:2018）*/
      if (standardTypes.includes(2)) {
        form.setFieldState('isoCategories', {
          dataSource: isoCategoriesEnums,
          value: isoCategories ? isoCategories?.split(',') : [],
        });
      }
    }
  }, [
    standardTypes,
    cathRecord,
    ghgCategoriesEnums,
    isoCategoriesEnums,
    standardTypeEnums,
  ]);

  const { carbonAccounting, questionnaire } = CarbonFillType;

  /** 不同的数据类型展示对应的schemas */
  const schema = () => {
    switch (Number(dataType)) {
      /** 企业碳核算 */
      case carbonAccounting:
        return enterpriseInfoSchema(isFill);
      /** 低碳问卷 */
      case questionnaire:
        return questionnaireInfoSchema(isFill);
      /** 产品碳足迹 */
      default:
        return productInfoSchema(isFill);
    }
  };

  return (
    <Form form={form} previewTextPlaceholder='-'>
      <SchemaField schema={schema()} />
    </Form>
  );
}
export default CarbonDataRequire;
