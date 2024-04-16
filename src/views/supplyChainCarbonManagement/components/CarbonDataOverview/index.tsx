/*
 * @@description: 碳数据概览（供应商碳数据、碳数据审核）
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-01 14:48:25
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-18 22:59:18
 */
import { Form, FormGrid, FormItem, FormLayout, Input } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { useEffect, useMemo } from 'react';

import { infoSchema } from './utils/schemas';
import { CarbonDataPropsType } from '../../utils/type';

function CarbonDataOverview({ cathRecord }: CarbonDataPropsType) {
  const SchemaField = createSchemaField({
    components: {
      Input,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

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
      form.setValues({
        ...cathRecord,
      });
    }
  }, [cathRecord]);

  return (
    <Form form={form} previewTextPlaceholder='-'>
      <SchemaField schema={infoSchema()} />
    </Form>
  );
}
export default CarbonDataOverview;
