/*
 * @@description: 添加、编辑、查看角色
 */
import { Form, FormGrid, FormItem, FormLayout, Input } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { Tree } from '@/components/formily/Tree';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getSystemRoleId,
  getSystemPermissionTree,
  postSystemRoleEdit,
  postSystemRoleAdd,
  树,
} from '@/sdks/systemV2ApiDocs';
import { Toast } from '@/utils';

import style from './index.module.less';
import { findParentCodes } from './utils';
import { schema } from './utils/schemas';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    Tree,
  },
});
const OrgInfo = () => {
  const { roleId: id, pageTypeInfo } = useParams<{
    roleId: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const [checkedTreeInfo, setCheckedTreeInfo] = useState<{
    halfCheckedKeys: number[];
  }>({
    halfCheckedKeys: [],
  });
  const [permissionTree, setPermissionTree] = useState<树>();

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
    });
  }, [pageTypeInfo, id]);

  /** 获取组织信息 */
  useEffect(() => {
    // 获取权限树
    getSystemPermissionTree({
      roleId: PageTypeInfo.add !== pageTypeInfo ? Number(id) : undefined,
    }).then(({ data }) => {
      setCheckedTreeInfo({
        halfCheckedKeys: findParentCodes(
          data?.data?.tree || [],
          data?.data?.allCheckedList || [],
        ) as number[],
      });
      setPermissionTree(data?.data);
      if (PageTypeInfo.add !== pageTypeInfo) {
        form.setValues(
          {
            allCheckedList: data?.data?.allCheckedList,
          },
          'merge',
        );
      }
    });

    // 查询节点信息
    if (id && PageTypeInfo.add !== pageTypeInfo) {
      getSystemRoleId({ id: +id }).then(({ data }) => {
        form.setValues(data?.data);
      });
    }
  }, []);

  useEffect(() => {
    form.setFieldState('allCheckedList', {
      dataSource: permissionTree?.tree,
    });
  }, [permissionTree]);

  return (
    <div className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={schema({
            permissionTree: { ...permissionTree },
            onTreeChange: tree => {
              // @ts-ignore
              setCheckedTreeInfo(tree);
            },
          })}
        />
      </Form>

      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              return form.submit(values => {
                if (!values?.allCheckedList) {
                  Toast('error', '请选择功能权限');
                  return;
                }
                if (values?.allCheckedList.length === 0) {
                  Toast('error', '请选择功能权限');
                  return;
                }
                const newValue = {
                  ...values,
                  halfCheckedList: checkedTreeInfo?.halfCheckedKeys || [],
                };
                if (PageTypeInfo.add === pageTypeInfo) {
                  postSystemRoleAdd({
                    req: {
                      ...newValue,
                      pid: id,
                    },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '新增成功');
                      history.back();
                    }
                  });
                  return;
                }
                postSystemRoleEdit({
                  req: {
                    ...newValue,
                    id,
                  },
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', '修改成功');
                    history.back();
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
