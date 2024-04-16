/**
 * @description 碳排放报告详情
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
import { compact } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { ICARouteMaps } from '@/router/utils/icaEnums';
import {
  SysReport,
  getEnterprisesystemSysReportId,
  getEnterprisesystemSysReportQueryYear,
  postEnterprisesystemSysReportAdd,
  postEnterprisesystemSysReportEdit,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { Toast } from '@/utils';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';

import style from './index.module.less';
import { infoSchema } from './schemas';

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
const ProductionUnitInfo = () => {
  const navigate = useNavigate();

  const { isAdd, isDetail, id } = usePageInfo();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
        effects() {
          onFieldValueChange('orgId', field => {
            const orgId = field.value;
            if (orgId) {
              getEnterprisesystemSysReportQueryYear({ orgId }).then(
                ({ data }) => {
                  const yearList = data.data;
                  /** 核算年度 */
                  form.setFieldState('accountYear', {
                    dataSource: yearList.map(item => ({
                      label: item,
                      value: item,
                    })),
                  });
                },
              );
            }
            if (isAdd) {
              form.setValuesIn('accountYear', undefined);
            }
          });
        },
      }),
    [isDetail],
  );

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 获取详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getEnterprisesystemSysReportId({ id }).then(({ data }) => {
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
              const values = await form.submit<SysReport>();
              if (isAdd) {
                await postEnterprisesystemSysReportAdd({
                  req: values,
                });
                Toast('success', '保存成功');
                navigate(ICARouteMaps.icaReport);
              } else {
                await postEnterprisesystemSysReportEdit({
                  req: values,
                });
                Toast('success', '保存成功');
                navigate(ICARouteMaps.icaReport);
              }
            },
          },
          {
            title: isDetail ? '返回' : '取消',
            onClick: async () => {
              navigate(ICARouteMaps.icaReport);
            },
          },
        ])}
      />
    </main>
  );
};
export default ProductionUnitInfo;
