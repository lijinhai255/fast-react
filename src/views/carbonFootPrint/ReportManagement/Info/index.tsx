/*
 * @@description: 产品碳足迹-碳足迹报告-详情
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-07 10:27:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-01-10 15:04:09
 */
import {
  ArrayTable,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
} from '@formily/antd';
import { Field, createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { cloneDeep, compact, omit } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { IconFont } from '@/components/IconFont';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  ProductionBusiness,
  Report,
  ReportFactor,
  getFootprintProcessModel,
  getFootprintProductionBusiness,
  getFootprintProductionBusinessProps,
  getFootprintReportId,
  postFootprintReport,
  putFootprintReport,
} from '@/sdks/footprintV2ApiDocs';
import { Toast } from '@/utils';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { ActivityDataModal, FactorDataModal } from './Modal';
import style from './index.module.less';
import { factorDataSource, onFactorOptionsFn } from './utils';
import { activityDataSource, facorSelectTypeWithScore } from './utils/const';
import {
  activityDataTableSchema,
  basicInfoSchema,
  factorTableSchema,
  reportInfoSchema,
} from './utils/schemas';
import { DataSourceType } from './utils/types';

function ReportInfo() {
  const { pageTypeInfo, id, functionUnitId } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    functionUnitId: string;
  }>();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  /** 功能单位枚举 */
  const [functionUnitList, setFunctionUnitList] =
    useState<ProductionBusiness[]>();

  /** 报告详情 */
  const [reportInfo, getReportInfo] = useState<Report>();

  /** 数据质量评价-活动数据-弹窗显隐 */
  const [isActivityDataModalVisibel, changeActivityDataModalVisibel] =
    useState(false);

  /** 数据质量评价-排放因子-弹窗显隐 */
  const [isFactorDataModalVisibel, changeFactorDataModalVisibel] =
    useState(false);

  /** 是否为详情页面 */
  const isDetail = pageTypeInfo === PageTypeInfo.show;

  /** 是否为新增页面 */
  const isAdd = pageTypeInfo === PageTypeInfo.add;

  const SchemaField = createSchemaField({
    components: {
      TextArea,
      Input,
      Select,
      ArrayTable,
      DatePicker,
      Form,
      FormItem,
      FormGrid,
      FormLayout,
    },
  });

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
      }),
    [pageTypeInfo],
  );

  /** 获取表格左侧生命周期 */
  const getTableDataTypeValueFn = (type: number | undefined) => {
    if (type) {
      getFootprintProcessModel({
        type,
        parentId: 0,
        page: 1,
        size: 10,
      }).then(({ data }) => {
        if (data.code === 200) {
          const result = data.data?.records?.map(item => ({
            modelId: item.id,
            modelName: item.reportName,
          }));
          const reportActive = cloneDeep(result);
          const reportFactor = cloneDeep(result);
          /** 数据质量评价-活动数据  */
          form.setFieldState('reportActive', {
            value: reportActive,
          });
          /** 数据质量评价-排放因子  */
          form.setFieldState('reportFactor', {
            value: reportFactor,
          });
        }
      });
    } else {
      form.setFieldState('reportActive', {
        value: [],
      });
      form.setFieldState('reportFactor', {
        value: [],
      });
    }
  };

  /** 功能单位选择联动 */
  const onFunctionalUnitChangeListenFn = () => {
    form.addEffects('functionalUnit', () => {
      onFieldValueChange('functionalUnit', (field: Field) => {
        const {
          productionName = '',
          beginDate = '',
          endTime = '',
          type,
        } = field.dataSource?.find(v => v.id === field?.value) || {};

        /** 产品名称 */
        form.setFieldState('productionName', {
          value: productionName,
        });
        /** 核算周期 */
        form.setFieldState('[beginDate, endTime]', {
          value: [beginDate, endTime],
        });
        /** 生命周期阶段 */
        getTableDataTypeValueFn(type);
      });
    });
  };

  /** 获取功能单位枚举值 */
  const getFunctionUnitList = async (orgId: number) => {
    const params = {
      page: 1,
      size: 100000,
      orgId,
    };
    getFootprintProductionBusiness(
      params as getFootprintProductionBusinessProps,
    ).then(({ data }) => {
      if (data.code === 200) {
        const list = data.data?.records || [];
        const functionUnitData = list.map(item => ({
          label: item.functionalUnit,
          value: item.id,
          ...item,
        }));
        form.setFieldState('functionalUnit', {
          dataSource: functionUnitData,
        });
        setFunctionUnitList(functionUnitData);
      }
    });
  };

  /** 新增时，监听功能单位联动 */
  useEffect(() => {
    if (isAdd && functionUnitList) {
      onFunctionalUnitChangeListenFn();
    }
  }, [pageTypeInfo, functionUnitList]);

  /** 组织切换 获取功能单位列表 */
  const onChangeOrgIdLitener = () => {
    form.addEffects('orgId', () => {
      onFieldValueChange('orgId', (field: Field) => {
        form.reset('functionalUnit');

        getFunctionUnitList(field.value);
      });
    });
  };

  /** 碳足迹报告详情 */
  useEffect(() => {
    if (!isAdd && functionUnitId && id) {
      getFootprintReportId({ id }).then(({ data }) => {
        const result = data?.data || {};
        form.setValues({
          ...result,
        });
        getReportInfo(result);
      });
    }
  }, [id, pageTypeInfo, functionUnitId]);

  /** 详情时 功能单位的显示 */
  useEffect(() => {
    if (reportInfo && functionUnitList) {
      const { reportActive = [], reportFactor = [] } = reportInfo;
      const {
        productionName = '',
        beginDate = '',
        endTime = '',
      } = functionUnitList.find(v => v.id === Number(functionUnitId)) || {};
      form.setValues({
        functionalUnit: Number(functionUnitId),
        productionName,
        beginDate,
        endTime,
        reportActive,
        reportFactor,
      });
      onFunctionalUnitChangeListenFn();
    }
  }, [reportInfo, functionUnitList]);

  /** 详情枚举 */
  useEffect(() => {
    /** 数据质量评价-排放因子-下拉框枚举 */
    facorSelectTypeWithScore.forEach(key => {
      form.setFieldState(`*.*.${key[0]}`, {
        dataSource: factorDataSource(
          onFactorOptionsFn(key[0], false) as DataSourceType,
        ),
      });
    });

    /** 活动数据类型 */
    form.setFieldState('*.*.activeType', {
      dataSource: activityDataSource,
    });

    if (orgList) {
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
        })),
      });
      /** 监听组织切换 */
      onChangeOrgIdLitener();
    }
  }, [orgList]);

  return (
    <div className={style.reportInfoWrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.reportSection}>
          <h3>基本信息</h3>
          <SchemaField schema={basicInfoSchema(isAdd)} />
        </section>
        <section className={style.reportSection}>
          <h3>报告信息</h3>
          <SchemaField schema={reportInfoSchema()} />
        </section>
        <section className={style.reportSection}>
          <h3>
            数据质量评价-活动数据
            <span
              onClick={() => {
                changeActivityDataModalVisibel(true);
              }}
            >
              <IconFont className={style.icon} icon='icon-icon-tishi' />
            </span>
          </h3>
          <SchemaField schema={activityDataTableSchema()} />
        </section>
        <section className={style.reportSection}>
          <h3>
            数据质量评价-排放因子
            <span
              onClick={() => {
                changeFactorDataModalVisibel(true);
              }}
            >
              <IconFont className={style.icon} icon='icon-icon-tishi' />
            </span>
          </h3>
          <SchemaField schema={factorTableSchema()} />
        </section>
      </Form>
      {/* 数据质量评价-活动数据弹窗 */}
      <ActivityDataModal
        isModalOpen={isActivityDataModalVisibel}
        handleCancel={() => changeActivityDataModalVisibel(false)}
      />
      {/* 数据质量评价-排放因子弹窗 */}
      <FactorDataModal
        isModalOpen={isFactorDataModalVisibel}
        handleCancel={() => changeFactorDataModalVisibel(false)}
      />
      <FormActions
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              form.submit((values: Report) => {
                /** 活动数据 */
                const activityList = values?.reportActive?.map(item => {
                  const { activeLevel = '', score } =
                    activityDataSource.find(
                      v => v.value === item?.activeType,
                    ) || {};
                  const params = omit(
                    {
                      ...item,
                      activeLevel,
                      score,
                    },
                    'modelName',
                  );
                  return {
                    ...params,
                  };
                });
                /** 排放因子 */
                const factorList = values?.reportFactor?.map(
                  (item: ReportFactor) => {
                    const factorItem: {
                      [key: string]: string | number | undefined | Date;
                    } = {};
                    facorSelectTypeWithScore.forEach((key: string[]) => {
                      const name = key[0];
                      const value = key[1];
                      const dataSource = factorDataSource(
                        onFactorOptionsFn(name, false) as DataSourceType,
                      );
                      const { score = '' } =
                        dataSource.find(
                          v => v.value === item[name as keyof typeof item],
                        ) || {};
                      factorItem[name] = item[name as keyof typeof item];
                      factorItem[value] = Number(score);
                    });
                    const params = omit(
                      {
                        ...item,
                        ...factorItem,
                      },
                      'modelName',
                    );
                    return {
                      ...params,
                    };
                  },
                );

                const result = {
                  ...values,
                  functionalUnit: functionUnitList?.find(
                    v => v.id === Number(values.functionalUnit),
                  )?.functionalUnit,
                  productionBusinessId: values.functionalUnit,
                  reportActive: activityList,
                  reportFactor: factorList,
                };

                if (isAdd) {
                  return postFootprintReport({
                    report: result as Report,
                  }).then(({ data }) => {
                    if (data.code === 200) {
                      Toast('success', '保存成功');
                      history.back();
                    }
                  });
                }
                return putFootprintReport({
                  report: result as Report,
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
export default ReportInfo;
