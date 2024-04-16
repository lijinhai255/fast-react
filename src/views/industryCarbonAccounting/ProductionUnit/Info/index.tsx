/**
 * @description 生产单元详情
 */
import {
  Cascader,
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Radio,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import {
  Cell,
  getEnterprisesystemSysCellId,
  getEnterprisesystemSysCellQueryAllCell,
  postEnterprisesystemSysCellAdd,
  postEnterprisesystemSysCellEdit,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { Toast } from '@/utils';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import style from './index.module.less';
import { infoSchema } from './schemas';

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    NumberPicker,
    Radio,
    Cascader,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
    Checkbox,
  },
});
const ProductionUnitInfo = () => {
  const navigate = useNavigate();

  const { isAdd, isDetail, id } = usePageInfo();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail],
  );

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 获取生产单元详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getEnterprisesystemSysCellId({ id }).then(({ data }) => {
        form.setValues({
          ...data?.data,
        });
      });
    }
  }, [isAdd, id]);

  /** 设置表单枚举值 */
  useEffect(() => {
    if (orgList) {
      /** 核算组织 */
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
        })),
      });
    }
  }, [orgList]);

  /** 生产单元类型 */
  useEffect(() => {
    getEnterprisesystemSysCellQueryAllCell({}).then(({ data }) => {
      const cellTypeList = data?.data || [];
      form.setFieldState('cellId', {
        dataSource: cellTypeList.map(item => ({
          label: item.cellName,
          value: item.id,
        })),
      });
    });
  }, []);

  return (
    <main className={style.infoWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.schemas_card}>
          <SchemaField schema={infoSchema(isAdd)} />
        </section>
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              const values = await form.submit<Cell>();
              if (isAdd) {
                await postEnterprisesystemSysCellAdd({
                  req: values,
                });
                Toast('success', '保存成功');
                navigate(ICARouteMaps.icaProductionUnit);
              } else {
                await postEnterprisesystemSysCellEdit({
                  req: values,
                });
                Toast('success', '保存成功');
                navigate(ICARouteMaps.icaProductionUnit);
              }
            },
          },
          {
            title: isDetail ? '返回' : '取消',
            onClick: async () => {
              navigate(ICARouteMaps.icaProductionUnit);
            },
          },
        ])}
      />
    </main>
  );
};
export default ProductionUnitInfo;
