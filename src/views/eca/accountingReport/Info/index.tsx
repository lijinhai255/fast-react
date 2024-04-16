/*
 * @@description:
 */
/*
 * @@description: 核算报告详情
 */
import {
  ArrayItems,
  ArrayTable,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd';
import {
  createForm,
  onFieldValueChange,
  onFormInit,
  onFormMount,
} from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button } from 'antd';
import { compact } from 'lodash-es';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  CHOOSETYPE,
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ReductionScene,
  getComputationReportId,
  postComputationReportAdd,
  postComputationReportEdit,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import {
  getComputationControlPlanPage,
  getComputationReductionScenePage,
} from '@/sdks/computation/computationV2ApiDocs';
import { getComputationReportComputationYearList } from '@/sdks_v2/new/computationV2ApiDocs';
import { CHOOSE_FACTOR } from '@/views/components/EmissionSource/utils/constant';

import style from './index.module.less';
import {
  accountInformationSchema,
  otherInformSchema,
  reportInformationSchema,
  schema,
} from './utils/schemas';
import { TextArea } from '../../component/TextArea';
import { UseOrgs } from '../../hooks';
import { mapProxy } from '../../util/util';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    DatePicker,
    ArrayTable,
    ArrayItems,
    Select,
    NumberPicker,
    TextArea,
  },
});
const OrgInfo = () => {
  // 获取URL里边的formValues和formId
  const formValues = new URLSearchParams(window.location.search).get(
    CHOOSE_FACTOR.FORM_VALUES,
  );
  const screenId = new URLSearchParams(window.location.search).get(
    CHOOSE_FACTOR.SCREEN_ID,
  );
  const navigate = useNavigate();

  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const useOrgArr = UseOrgs();

  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      effects() {
        onFormInit(async current => {
          current.setFieldState('orgId', {
            dataSource: useOrgArr?.map(item => {
              return {
                label: item.orgName,
                value: item.id,
              };
            }),
          });

          if (Number(id) && !formValues) {
            await getComputationReportId({
              id: Number(id),
            }).then(async ({ data }) => {
              if (data.code === 200) {
                const reductionSceneIdsArr =
                  data?.data?.reductionSceneIds || [];
                await getComputationReductionScenePage({
                  pageNum: 1,
                  pageSize: 10000,
                }).then(screenList => {
                  if (screenList.data?.code === 200) {
                    const newArr = screenList.data?.data?.list?.filter(
                      item => reductionSceneIdsArr?.indexOf(item?.id || 0) >= 0,
                    );
                    current?.setValues({
                      ...data.data,
                      reductionSceneIds: [...(newArr || [])],
                    });
                  }
                });
              }
            });
          }
        });
        onFormMount(() => {
          getScreenFn();
        });
        onFieldValueChange('orgId', async field => {
          const { value } = field;
          if (!value) {
            return;
          }

          await getComputationControlPlanPage({
            pageNum: 1,
            pageSize: 100000,
            orgId: value,
          }).then(({ data }) => {
            if (data.code === 200) {
              const newArr = data?.data?.list?.map(item => {
                return {
                  label: item.version,
                  value: item.id,
                };
              });
              const versionValue = form.getValuesIn('controlPlanId');
              if (
                !newArr?.some(
                  item => Number(item.value) === Number(versionValue),
                )
              ) {
                // 清空
                form.setFieldState('controlPlanId', {
                  value: null,
                });
              }
              form.setFieldState('controlPlanId', {
                dataSource: newArr,
              });
            }
          });
          await getComputationReportComputationYearList({
            orgId: value,
          }).then(({ data }) => {
            const versionValue = form.getValuesIn('year');
            const newArr = data.data?.map(item => {
              return {
                label: item,
                value: item,
              };
            });
            if (
              !newArr?.some(item => Number(item.value) === Number(versionValue))
            ) {
              // 清空
              form.setFieldState('year', {
                value: null,
              });
            }
            form.setFieldState('year', {
              dataSource: newArr,
            });
          });
        });
      },
    });
  }, [pageTypeInfo, id, useOrgArr]);
  // 获取减排信息
  const getScreenFn = async () => {
    const searchFormValue =
      typeof formValues === 'string' ? JSON.parse(formValues) : {};
    if (screenId) {
      await getComputationReductionScenePage({
        pageNum: 1,
        pageSize: 10000,
      }).then(({ data }) => {
        const screenIdArr = screenId.split(',');

        const newArr = data.data?.list?.filter(
          item => screenIdArr.indexOf(`${item.id}`) >= 0,
        );
        if (formValues) {
          form.setValues({
            ...searchFormValue,
            reductionSceneIds: [...(newArr || [])],
          });
        }
      });
    } else {
      form.setValues({
        ...searchFormValue,
      });
    }
  };

  return (
    <main className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.card}>
          <h3>核算信息</h3>
          <SchemaField schema={accountInformationSchema(pageTypeInfo)} />
        </section>
        <section className={style.card}>
          <h3>报告负责人信息</h3>
          <SchemaField schema={reportInformationSchema()} />
        </section>
        <section className={style.card}>
          <div className={style.flx}>
            <h3>减排信息</h3>
            {pageTypeInfo !== PageTypeInfo.show && (
              <Button
                type='primary'
                onClick={() => {
                  const value = mapProxy(form.getValuesIn('*'));
                  const urlParamsData = `?${
                    CHOOSE_FACTOR.FORM_VALUES
                  }=${JSON.stringify(value)}`;
                  const baseUrl = virtualLinkTransform(
                    EcaRouteMaps.accountingReportInfoChooseScreen,
                    [PAGE_TYPE_VAR, CHOOSETYPE, ':id'],
                    [PageTypeInfo.edit, 'chooseScreen', id],
                  );
                  navigate(baseUrl + urlParamsData);
                }}
              >
                选择减排场景
              </Button>
            )}
          </div>
          <SchemaField schema={schema({ pageTypeInfo })} />
        </section>
        <section className={style.card}>
          <h3>其他情况说明</h3>
          <SchemaField schema={otherInformSchema()} />
        </section>
      </Form>

      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              return form.submit(async values => {
                const newValue = {
                  ...values,
                  reductionSceneIds: values?.reductionSceneIds.map(
                    (item: ReductionScene) => item?.id,
                  ),
                };
                if (Number(id)) {
                  await postComputationReportEdit({
                    req: {
                      ...newValue,
                      id: Number(id),
                    },
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      navigate(EcaRouteMaps.accountingReport);
                    }
                  });
                  return;
                }
                await postComputationReportAdd({
                  req: {
                    ...newValue,
                  },
                }).then(({ data }) => {
                  if (data.code === 200) {
                    navigate(EcaRouteMaps.accountingReport);
                  }
                });
              });
            },
          },
          {
            title: PageTypeInfo.show !== pageTypeInfo ? '取消' : '返回',
            onClick: async () => {
              navigate(EcaRouteMaps.accountingReport);
            },
          },
        ])}
      />
    </main>
  );
};

export default OrgInfo;
