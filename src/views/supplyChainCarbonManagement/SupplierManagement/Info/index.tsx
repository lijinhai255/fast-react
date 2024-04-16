/*
 * @@description: 供应链碳管理-供应商管理-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-19 16:31:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-01 10:28:10
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd';
import { FormPath, createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  Supplier,
  getSupplychainSupplierId,
  postSupplychainSupplierAdd,
  postSupplychainSupplierEdit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import style from './index.module.less';
import { infoSchema } from './utils/schemas';
import ApprovalRecord from '../components/ApprovalRecord';
import CarbonAccountingList from '../components/CarbonAccountingList';
import ProductList from '../components/ProductList';

function SupplierManagementInfo() {
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      NumberPicker,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
      TextArea,
    },
  });

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 当前切换的顶部Tab栏 */
  const [currentTab, changeCurrentTab] = useState<string>('1');

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [pageTypeInfo],
  );

  /** 获取供应商详情 */
  useEffect(() => {
    if (!isAdd && id && orgList && orgList.length) {
      getSupplychainSupplierId({ id: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          form.setValues({
            ...data?.data,
          });
          /** 当状态为启用:1、禁用:2时，所属组织和社会信用代码不可以编辑 */
          if ([1, 2].includes(Number(data?.data?.supplierStatus))) {
            form.setFieldState(FormPath.parse('*(orgId,uscc)'), {
              disabled: true,
            });
          }
        }
      });
    }
  }, [pageTypeInfo, id, orgList]);

  /** 设置枚举值 */
  useEffect(() => {
    /** 组织列表 */
    if (orgList && Number(currentTab) === 1) {
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
          ...item,
        })),
      });
    }
    /** 供应商编码新增自动生成 */
    if (isAdd) {
      form.setFieldState('supplierCode', {
        value: new Date().getTime(),
      });
    }
  }, [orgList, pageTypeInfo, currentTab]);

  /** 切换tabs展示的信息 */
  const tabsShowInfo = () => {
    switch (Number(currentTab)) {
      /** 供应商信息  */
      case 1:
        return (
          <Form form={form} previewTextPlaceholder='-'>
            <SchemaField schema={infoSchema()} />
          </Form>
        );
      /** 采购产品管理 hasAction: table是否显示操作栏  */
      case 2:
        return <ProductList hasAction={false} />;
      /** 企业碳核算 */
      case 3:
        return <CarbonAccountingList />;
      /** 审核记录 */
      default:
        return <ApprovalRecord />;
    }
  };

  return (
    <div className={style.supplyManagementInfoWrapper}>
      {isDetail && (
        <Tabs
          defaultActiveKey='1'
          items={[
            {
              label: '供应商信息',
              key: '1',
            },
            {
              label: '采购产品列表',
              key: '2',
            },
            {
              label: '企业碳核算',
              key: '3',
            },
            {
              label: '审核记录',
              key: '4',
            },
          ]}
          onChange={value => {
            changeCurrentTab(value);
          }}
        />
      )}
      {/* 切换tabs展示的不同信息 */}
      {tabsShowInfo()}
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit((values: Supplier) => {
                const result = {
                  ...values,
                };
                if (isAdd) {
                  return postSupplychainSupplierAdd({
                    req: result,
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '保存成功');
                      history.back();
                    }
                  });
                }
                return postSupplychainSupplierEdit({
                  req: result,
                }).then(({ data }) => {
                  if (data.code === 200) {
                    Toast('success', '保存成功');
                    history.back();
                  }
                });
              });
            },
          },
          {
            title: isDetail ? '返回' : '取消',
            onClick: async () => {
              history.back();
            },
          },
        ])}
      />
    </div>
  );
}
export default SupplierManagementInfo;
