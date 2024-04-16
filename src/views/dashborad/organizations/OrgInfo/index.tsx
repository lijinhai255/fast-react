/*
 * @@description: 添加、编辑、查看组织
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: lichunxiao 1359758885@aa.com
 * @LastEditTime: 2023-04-27 14:53:06
 */
/**
 * todo 组织类型 / 上级组织 暂时不支持修改
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  TreeSelect,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import { getAuthTokenRefresh } from '@/sdks/authV2ApiDocs';
import {
  Org,
  getSystemOrgId,
  postSystemOrgAdd,
  postSystemOrgEdit,
} from '@/sdks/systemV2ApiDocs';
import { userInfoActions } from '@/store/module/user';
import { Toast } from '@/utils';

import style from './index.module.less';
import { schema } from './utils/schemas';
import { OrgTypes } from '../OrgManage/utils/columns';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    Select,
    FormLayout,
    TreeSelect,
  },
});
const OrgInfo = () => {
  const {
    upOrgId: id,
    pageTypeInfo,
    pId,
  } = useParams<{
    upOrgId: string;
    pId: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const dispatch = useDispatch();
  const [pageInfo, setPageInfo] = useState<Org | undefined>();
  const [parentInfo, setParentInfo] = useState<Org | undefined>();

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      // readPretty: true,
      initialValues: {
        ...pageInfo,
        pId: parentInfo?.orgName,
      },
    });
  }, [pageInfo, parentInfo, pageTypeInfo]);
  const defaultOrgType = String(OrgTypes['分子公司']) as Org['orgType'];
  /** 获取组织信息 */
  useEffect(() => {
    // 查询当前组织信息
    if (id && PageTypeInfo.add !== pageTypeInfo)
      getSystemOrgId({ id: +id }).then(({ data }) => {
        const result = data?.data;
        setPageInfo({
          ...result,
          orgType: `${result?.orgType || 0}` || defaultOrgType,
        });
      });
    else {
      setPageInfo({ orgType: defaultOrgType });
    }
    //  查询上级节点信息
    const pCode = pageTypeInfo === PageTypeInfo.add ? id : pId;
    if (pCode) {
      getSystemOrgId({ id: +pCode }).then(({ data }) => {
        setParentInfo(data?.data);
      });
    }
  }, []);
  const refreshTokenAndBack = () => {
    getAuthTokenRefresh({}).then(({ data }) => {
      if (data.data) dispatch(userInfoActions.setUserInfo({ ...data.data }));
      history.back();
    });
  };
  if (!pageInfo) return null;
  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField schema={schema()} />
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              return form.submit(values => {
                if (PageTypeInfo.add === pageTypeInfo) {
                  return postSystemOrgAdd({
                    req: {
                      ...values,
                      pid: Number(id),
                    },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '新增成功');
                      refreshTokenAndBack();
                    }
                  });
                }
                return postSystemOrgEdit({
                  req: {
                    ...values,
                    pid: Number(pId),
                  },
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', '修改成功');
                    refreshTokenAndBack();
                  }
                });
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
