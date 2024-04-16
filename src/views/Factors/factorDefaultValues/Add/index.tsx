/**
 * @description 新增缺省值
 */
import { Form, FormGrid, FormItem, FormLayout, Select } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import {
  DefaultQo,
  getEnterprisesystemSysDefaultYearSelectBusinessPage,
  postEnterprisesystemSysDefaultYear,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { infoSchema } from './schemas';
import { pageTo } from '../../utils';
import AccountingModelButton from '../components/AccountingModelButton';
import { ModelButtonType } from '../types';

const SchemaField = createSchemaField({
  components: {
    Select,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    AccountingModelButton,
  },
});

const FactorDefaultValuesAdd = () => {
  const navigate = useNavigate();

  /** 核算模型列表 */
  const [modelList, setModelList] = useState<ModelButtonType[]>([]);
  useEffect(() => {
    getEnterprisesystemSysDefaultYearSelectBusinessPage({
      pageNum: 1,
      pageSize: 100,
    }).then(({ data }) => {
      const { records } = data.data;
      const newModelList = records?.map(item => ({
        id: item.id || 0,
        businessName: item.businessName,
        businessInfo: item.businessInfo,
      }));
      setModelList(newModelList || []);
    });
  }, []);

  const form = useMemo(() => createForm(), [modelList]);

  const submitFn = async () => {
    const { businessModelId } = form.values;
    if (!businessModelId) {
      Toast('error', '请选择核算模型');
      return;
    }
    const values = await form.submit<DefaultQo>();
    const { data } = await postEnterprisesystemSysDefaultYear({
      ro: values,
    });
    const id = data.data;
    pageTo(
      navigate,
      RouteMaps.factorDefaultValuesManage,
      PageTypeInfo.edit,
      id,
    );
  };

  return (
    <main className={style.infoWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.schemas_card}>
          <SchemaField schema={infoSchema(modelList)} />
        </section>
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '保存，下一步',
            type: 'primary',
            onClick: async () => {
              submitFn();
            },
          },
          {
            title: '取消',
            onClick: async () => {
              navigate(RouteMaps.factorDefaultValues);
            },
          },
        ])}
      />
    </main>
  );
};
export default FactorDefaultValuesAdd;
