/*
 * @@description: 修改密码
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-27 14:28:32
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-05-30 11:01:07
 */
import { Form, FormItem, FormLayout, Password } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import { LayoutHeader } from '@/components/LayoutHeader';
import { RouteMaps } from '@/router/utils/enums';
import { postSystemUserPasswordModifyDefault } from '@/sdks/systemV2ApiDocs';

import { PassWordText } from './components/PassWordText';
import style from './index.module.less';
import { changePwdSchemas } from './utils';

const SchemaField = createSchemaField({
  components: {
    Password,
    FormLayout,
    FormItem,
  },
});

const ChangePWD = () => {
  const form = createForm();

  const navigate = useNavigate();
  return (
    <div className={style.wrapper}>
      <LayoutHeader />
      <div className={style.main}>
        <div className={style.inner}>
          <header>修改密码</header>
          <div className={style.tip}>
            为了更安全地使用碳应用平台，请修改登录密码：
          </div>
          <Form form={form} className={style.form}>
            <SchemaField
              schema={{
                type: 'object',
                properties: {
                  layout: {
                    type: 'void',
                    'x-component': 'FormLayout',
                    'x-component-props': {
                      layout: 'vertical',
                    },
                    properties: changePwdSchemas(),
                  },
                },
              }}
            />
          </Form>
          <Button
            type='primary'
            className={style.submit}
            onClick={() => {
              return form.submit(values => {
                return postSystemUserPasswordModifyDefault({
                  req: values,
                }).then(({ data }) => {
                  if (data?.code === 200) navigate(RouteMaps.home);
                });
              });
            }}
          >
            确认
          </Button>
          <PassWordText />
        </div>
      </div>
    </div>
  );
};

export default ChangePWD;
