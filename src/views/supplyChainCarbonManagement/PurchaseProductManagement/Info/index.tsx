/*
 * @@description: 供应链碳管理-采购产品管理-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-05-23 10:05:53
 * @LastEditors: liuxinxin xinxin@carbonstop.net
 * @LastEditTime: 2023-06-06 16:38:07
 */
import {
  Cascader,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Tabs } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  Product,
  getSupplychainProductId,
  postSupplychainProductAdd,
  postSupplychainProductEdit,
} from '@/sdks_v2/new/supplychainV2ApiDocs';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { infoSchema } from './utils/schemas';
import style from '../../SupplierManagement/Info/index.module.less';
import CarbonFootPrintList from '../components/CarbonFootPrintList';
import SupplierList from '../components/SupplierList';

function PurchaseProductManagementInfo() {
  const { pageTypeInfo, id } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
  }>();

  const SchemaField = createSchemaField({
    components: {
      Input,
      Select,
      TextArea,
      Cascader,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 核算单位的枚举值 */
  const accountsUnitsList = useAllEnumsBatch('factorUnitM');

  /** 当前切换的顶部Tab栏 */
  const [currentTab, changeCurrentTab] = useState<string>('1');

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [pageTypeInfo],
  );

  /** 获取采购产品管理详情 */
  useEffect(() => {
    if (!isAdd && id && accountsUnitsList && orgList && orgList.length) {
      getSupplychainProductId({ id: Number(id) }).then(({ data }) => {
        if (data.code === 200) {
          const result = data?.data;
          const { productUnit = '' } = result || {};

          /** 核算单位相关处理 */
          const productUnitCode = productUnit?.split(',');
          /** 核算单位枚举值 */
          const accountUnitsDicts = accountsUnitsList.factorUnitM;
          /** 匹配到的单位项 */
          const productUnitItem = accountUnitsDicts.find(
            v => v.dictLabel === productUnit,
          );
          /** 导入的采购产品单位的code码 */
          const importProductUnitCode = productUnitItem
            ? [productUnitItem?.sourceType, productUnitItem?.dictValue]
            : [];

          const productUnitBack = productUnitCode
            ? productUnitCode.length === 1
              ? importProductUnitCode
              : productUnitCode
            : [];

          form.setValues({
            ...result,
            productUnit: productUnitBack,
          });
        }
      });
    }
  }, [pageTypeInfo, id, accountsUnitsList, orgList]);

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
    /** 核算单位 */
    if (accountsUnitsList && Number(currentTab) === 1) {
      const accountUnitsDicts = accountsUnitsList.factorUnitM;
      form.setFieldState('.productUnit', {
        dataSource: changeFactorM2cascaderOptions(accountUnitsDicts),
      });
    }
  }, [orgList, accountsUnitsList, currentTab]);

  /** 切换tabs展示的信息 */
  const tabsShowInfo = () => {
    switch (Number(currentTab)) {
      /** 采购产品信息  */
      case 1:
        return (
          <Form form={form} previewTextPlaceholder='-'>
            <SchemaField schema={infoSchema(isAdd)} />
          </Form>
        );
      /** 供应商列表  */
      case 2:
        return <SupplierList hasAction={false} />;
      /** 产品碳足迹 */
      default:
        return <CarbonFootPrintList />;
    }
  };

  return (
    <div className={style.supplyManagementInfoWrapper}>
      {isDetail && (
        <Tabs
          defaultActiveKey='1'
          items={[
            {
              label: '采购产品信息',
              key: '1',
            },
            {
              label: '供应商列表',
              key: '2',
            },
            {
              label: '产品碳足迹',
              key: '3',
            },
          ]}
          onChange={value => {
            changeCurrentTab(value);
          }}
        />
      )}
      {/* 切换tabs展示的信息 */}
      {tabsShowInfo()}
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit((values: Product) => {
                const result = {
                  ...values,
                  productUnit: String(values.productUnit),
                };
                if (isAdd) {
                  return postSupplychainProductAdd({
                    req: result,
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '保存成功');
                      history.back();
                    }
                  });
                }
                return postSupplychainProductEdit({
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
export default PurchaseProductManagementInfo;
