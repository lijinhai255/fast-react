/**
 * @description 碳排放核算详情
 */

import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Radio,
  Select,
} from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Tabs, TabsProps } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import {
  SysBusiness,
  enterpriseBusinessModel,
  getEnterprisesystemSysBusinessQueryById,
  getEnterprisesystemSysBusinessQueryModel,
  getEnterprisesystemSysBusinessTenetQueryTentByBusinessId,
  postEnterprisesystemSysBusinessAdd,
  postEnterprisesystemSysBusinessEdit,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { publishYear } from '@/views/Factors/utils';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import ModelCard from '@/views/industryCarbonAccounting/components/ModelCard';

import { COLLECT_CTCLE_TYPE } from './constant';
import style from './index.module.less';
import { infoSchema } from './schemas';
import AccountingCycle from '../../components/AccountingCycle';
import { CycleDetailInfoType } from '../../utils/type';

const { YEAR } = COLLECT_CTCLE_TYPE;

const SchemaField = createSchemaField({
  components: {
    Select,
    Radio,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

const EmissionAccountingInfo = () => {
  const { isAdd, isEdit, isDetail, id } = usePageInfo();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [isDetail],
  );

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 核算模型列表 */
  const [accountModelOptions, setAccountModelOptions] =
    useState<enterpriseBusinessModel[]>();

  /** 选中的核算模型ID */
  const [selectedBusinessModelId, setSelectedBusinessModelId] =
    useState<number>();

  /** 选择核算模型的提示标志 */
  const [requireFlag, setRequireFlag] = useState(false);

  /** 数据收集周期数据 */
  const [cycleData, setCycleData] = useState<TabsProps['items']>();

  /** 选中的收集周期 */
  const [collectCycle, setCollectCycle] = useState<number>();

  /** 当前选中的周期tab */
  const [currentTab, setCurrentTab] = useState<number>();

  /** 详情排放数据列表头部展示的信息 */
  const [detailInfo, setDetailInfo] = useState<CycleDetailInfoType>();

  /** 获取数据收集周期数据 */
  useEffect(() => {
    if (id && isDetail) {
      getEnterprisesystemSysBusinessTenetQueryTentByBusinessId({
        businessId: id,
      }).then(({ data }) => {
        const result = data?.data?.map(item => ({
          key: item.id,
          label: item.tenetMontage,
          ...item,
        }));

        setCycleData(result as unknown as TabsProps['items']);
        setCurrentTab(result[0]?.id);
      });
    }
  }, [id, isDetail]);

  /** 获取核算模型列表 */
  useEffect(() => {
    getEnterprisesystemSysBusinessQueryModel({}).then(({ data }) => {
      setAccountModelOptions(data?.data);
    });
  }, []);

  /** 获取碳排放核算详情 */
  useEffect(() => {
    if (id && accountModelOptions) {
      getEnterprisesystemSysBusinessQueryById({ id }).then(({ data }) => {
        const {
          businessModelId,
          accountYear,
          orgName,
          orgId,
          collectCycle: collectCycleValue,
        } = data?.data || {};

        form.setValues({
          ...data?.data,
          accountYear: accountYear?.split('年')[0],
        });

        /** 数据收集周期 */
        setCollectCycle(collectCycleValue);

        /** 选中的核算模型id */
        setSelectedBusinessModelId(businessModelId);

        const businessModelItem = accountModelOptions.find(
          v => v.id === businessModelId,
        );
        /** 详情列表头部展示的信息 */
        setDetailInfo({
          orgId,
          orgName,
          accountYear,
          businessName: businessModelItem?.businessName,
        });
      });
    }
  }, [id, accountModelOptions]);

  /** 编辑时：核算组织不可编辑 */
  useEffect(() => {
    if (isAdd) {
      return;
    }
    form.setFieldState('orgId', {
      disabled: true,
      required: false,
    });
  }, [isAdd]);

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
    /** 核算年度 */
    form.setFieldState('accountYear', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });
  }, [orgList]);

  return (
    <main
      className={classNames(style.wrapper, {
        [style.detailWrapper]: isDetail,
      })}
    >
      {(isAdd || isEdit) && (
        <div className={style.createInfoWrapper}>
          <div className={style.content}>
            <Form form={form} previewTextPlaceholder='-'>
              <SchemaField schema={infoSchema()} />
            </Form>
          </div>
          <div className={style.accountModelWrapper}>
            <h3 className={style.label}>
              <span className={style.requireStar}>*</span> 核算模型
            </h3>
            {requireFlag && !selectedBusinessModelId && (
              <p className={style.requireTips}>请选择核算模型</p>
            )}
            <div className={style.modelWrapper}>
              <ModelCard
                currentSelectedCard={selectedBusinessModelId}
                dataSource={accountModelOptions}
                onSelect={data => {
                  setSelectedBusinessModelId(data?.id);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {isDetail && (
        <div className={style.detailInfoWrapper}>
          {collectCycle !== YEAR && (
            <div className={style.cycleTabs}>
              <Tabs
                items={cycleData}
                onChange={currentTabValue => {
                  setCurrentTab(Number(currentTabValue));
                }}
              />
            </div>
          )}
          <div className={style.accountingCycleWrapper}>
            <AccountingCycle
              isViewMode
              tendId={currentTab}
              headerBasicInfo={{
                核算组织: detailInfo?.orgName,
                核算年度: detailInfo?.accountYear,
                核算模型: detailInfo?.businessName,
              }}
              cycleDetailInfo={detailInfo}
            />
          </div>
        </div>
      )}

      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              setRequireFlag(true);
              form.submit(async (values: SysBusiness) => {
                /** 没有选择核算模型 */
                if (!selectedBusinessModelId) {
                  return Promise.reject();
                }
                const result = {
                  ...values,
                  businessModelId: selectedBusinessModelId,
                };
                if (isAdd) {
                  return postEnterprisesystemSysBusinessAdd({
                    req: result,
                  }).then(() => {
                    history.back();
                  });
                }
                return postEnterprisesystemSysBusinessEdit({
                  req: result,
                }).then(() => {
                  history.back();
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
    </main>
  );
};
export default EmissionAccountingInfo;
