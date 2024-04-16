/*
 * @@description:账号管理 、 用户管理/编辑、新增、查看
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-05-30 14:13:55
 */

import {
  Checkbox,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Password,
  Select,
  TreeSelect,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { matchPath, useParams } from 'react-router-dom';

import { AntProvider } from '@/components/AntdProvider';
import { Button } from '@/components/Form/Button';
import { FormActions } from '@/components/FormActions';
import { PageTypeInfo, RouteMaps } from '@/router/utils/enums';
import { getAuthTokenRefresh } from '@/sdks/authV2ApiDocs';
import {
  getSystemOrgTree,
  getSystemRolePage,
  getSystemUserId,
  postSystemUserAdd,
  postSystemUserEdit,
  postSystemUserPasswordModify,
  postSystemUserPasswordReset,
} from '@/sdks/systemV2ApiDocs';
import { userInfoActions } from '@/store/module/user';
import { Toast, returnNoIconModalStyle } from '@/utils';
import { PassWordText } from '@/views/base/ChangePWD/components/PassWordText';

import style from './index.module.less';
import { changePwdSchema, schema } from './utils';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    Select,
    FormLayout,
    Button,
    TreeSelect,
    Checkbox,
    Password,
  },
});

function Intro() {
  const dispatch = useDispatch();

  const [changePwdModalVisible, setChangePwdModalVisible] = useState(false);
  const [orgId, UseOrg] = useState<number>();
  const { id, pageTypeInfo, adminFlag } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
    adminFlag: '0' | '1';
  }>();

  const isUserProfilePage = !!matchPath(
    { caseSensitive: true, path: RouteMaps.profile },
    location.pathname,
  );
  const isReadPretty = pageTypeInfo === PageTypeInfo.show || isUserProfilePage;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isReadPretty,
        initialValues: {},
      }),
    [isReadPretty],
  );

  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  角色列表
    getSystemRolePage({
      pageNum: 1,
      pageSize: 200,
      likeRoleName: '',
    }).then(({ data }) => {
      form.setFieldState('roles', {
        dataSource:
          data?.data?.list?.map(role => ({
            label: role.roleName,
            value: role.id,
          })) || [],
      });
    });
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    getSystemOrgTree({ userId: null }).then(({ data }) => {
      form.setFieldState('orgs', {
        dataSource: data?.data?.tree,
      });
    });
    if (!Number.isNaN(Number(id))) {
      getSystemUserId({ id: Number(id) }).then(({ data }) => {
        const result = data?.data || {};
        form.setValues({
          ...result,
          orgs: result.orgList?.map(org =>
            isReadPretty
              ? org.orgName
              : adminFlag === '1'
              ? org.orgName
              : Number(org.id),
          )?.[0],
          roles: result.roleList?.map(role => role.id),
        });
        if (adminFlag === '1') {
          UseOrg(result.orgList?.map(org => Number(org.id))?.[0]);
        }
      });
    }
    if (pageTypeInfo === PageTypeInfo.edit)
      form.setFieldState('username', { editable: false });
    if (adminFlag === '1')
      form.setFieldState('*(orgs,roles)', { editable: false });
  }, [id]);

  const changePwdForm = createForm();
  const refreshFn = async () => {
    await getAuthTokenRefresh({}).then(({ data }) => {
      if (data.code === 200) {
        dispatch(userInfoActions.setUserInfo(data?.data || {}));
      }
    });
  };
  return (
    <AntProvider>
      <div className={style.wrapper}>
        {/* 这里的key 是为了切换 个人中心页面和用户详情页面时dom不会重置问题 */}
        <Form form={form} key={`${pageTypeInfo}${isUserProfilePage}`}>
          <SchemaField
            schema={schema({
              onChangePwd: async () => {
                if (isUserProfilePage) setChangePwdModalVisible(true);
                else {
                  Modal.confirm({
                    title: '提示',
                    content: '确认重置为随机密码，新密码将通过邮件通知。',
                    ...returnNoIconModalStyle,
                    onOk: () => {
                      if (id)
                        postSystemUserPasswordReset({
                          req: { id: Number(id) },
                        }).then(({ data }) => {
                          if (data?.code === 200)
                            Toast('success', '密码重置成功');
                        });
                    },
                  });
                }
              },
              showChangePwd:
                PageTypeInfo.show === pageTypeInfo || isUserProfilePage,
              isUserProfilePage,
            })}
          />
        </Form>
        <Modal
          open={changePwdModalVisible}
          onCancel={() => {
            setChangePwdModalVisible(false);
          }}
          maskClosable={false}
          onOk={() => {
            return changePwdForm.submit(values => {
              return postSystemUserPasswordModify({ req: values }).then(
                ({ data }) => {
                  if (data.code === 200) {
                    Toast('success', '密码修改成功');
                    setChangePwdModalVisible(false);
                  }
                },
              );
            });
          }}
          title='修改密码'
        >
          <Form form={changePwdForm}>
            <SchemaField schema={changePwdSchema()} />
          </Form>
          <PassWordText />
        </Modal>
        <FormActions
          place='center'
          buttons={compact([
            !isReadPretty && {
              title: '保存',
              type: 'primary',
              onClick: async () => {
                form.submit(values => {
                  const submitVals = {
                    ...values,
                    roles: values.roles.join(','),
                    orgs: adminFlag === '1' ? orgId : values.orgs,
                    // orgs: values.orgs.join(','),
                  };
                  // 新增
                  if (Number.isNaN(Number(id))) {
                    postSystemUserAdd({
                      req: submitVals,
                    }).then(({ data }) => {
                      if (data?.code === 200) {
                        refreshFn();
                        Toast('success', '新增成功');
                        history.back();
                      }
                    });
                  }
                  // 修改
                  if (PageTypeInfo.edit === pageTypeInfo) {
                    postSystemUserEdit({
                      req: { ...submitVals, id },
                    }).then(({ data }) => {
                      if (data?.code === 200) {
                        refreshFn();
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
              type: 'default',
              onClick: async () => {
                history.back();
              },
            },
          ])}
        />
      </div>
    </AntProvider>
  );
}

export default Intro;
