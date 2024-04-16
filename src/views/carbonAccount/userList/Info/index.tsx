/*
 * @@description: 添加、编辑、查看
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
import { compact, replace } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getAccountsystemUserId,
  postAccountsystemUser,
  putAccountsystemUser,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { schema } from './schemas';
import { UseGroup } from '../../hooks';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    FormGrid,
    FormLayout,
  },
});
const OrgInfo = () => {
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;
  /** 是否为编辑页面 */
  const isEdit = pageTypeInfo === PageTypeInfo.edit;

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
    });
  }, [pageTypeInfo, id]);

  const depOption = UseGroup();

  useEffect(() => {
    // 获取-枚举值
    form.setFieldState('deptId', { dataSource: depOption });

    if (isAdd) {
      form.setFieldState('userNumber', {
        value: new Date().getTime().toString(),
      });
    }
  }, [depOption]);

  /** 产品详情 */
  useEffect(() => {
    if (!isAdd && id) {
      getAccountsystemUserId({ id: +id }).then(({ data }) => {
        const result = data?.data;
        form.setValues({
          ...result,
        });
      });
    }
  }, [id, pageTypeInfo]);

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema(pageTypeInfo!)} />
      </Form>

      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit(values => {
                const submitVals = {
                  ...values,
                  mobileMask: replace(
                    values.mobile,
                    values.mobile.substr(3, 4),
                    '****',
                  ),
                  // roles: values.roles.join(','),
                  // orgs: adminFlag === '1' ? orgId : values.orgs,
                  // orgs: values.orgs.join(','),
                };
                // 新增
                if (isAdd) {
                  postAccountsystemUser({
                    ro: submitVals,
                  }).then(({ data }) => {
                    if (data?.code === 200) {
                      // refreshFn();
                      Toast('success', '新增成功');
                      history.back();
                    }
                  });
                }
                // 修改
                if (isEdit) {
                  putAccountsystemUser({
                    ro: { ...submitVals, id },
                  }).then(({ data }) => {
                    if (data?.code === 200) {
                      // refreshFn();
                      Toast('success', '修改成功');
                      history.back();
                    }
                  });
                }
              });
            },
          },
          {
            title: PageTypeInfo.show !== pageTypeInfo ? '取消' : '返回',
            onClick: async () => {
              history.go(-1);
            },
          },
        ])}
      />
    </div>
  );
};

export default OrgInfo;
