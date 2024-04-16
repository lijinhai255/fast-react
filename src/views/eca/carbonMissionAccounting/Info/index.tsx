/*
 * @@description: 碳排放核算详情
 * @Date: 2023-01-13 17:16:36
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-15 14:20:58
 */
import {
  Checkbox,
  DatePicker,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd';
import {
  createForm,
  onFieldValueChange,
  onFormInit,
  onFormMount,
} from '@formily/core';
// import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import style from '@views/eca/dataQualityManage/controlPlan/index.module.less';
import { Tabs, TabsProps } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
// import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// import { OrgTree } from '@/sdks/systemV2ApiDocs';
import { FormActions } from '@/components/FormActions';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Computation,
  getComputationComputationId,
  postComputationComputationAdd,
  postComputationComputationEdit,
} from '@/sdks/computation/computationV2ApiDocs';
import {
  OrgTree,
  getComputationComputationOrgList,
} from '@/sdks_v2/new/computationV2ApiDocs';
// import { RootState } from '@/store/types';

import { schema } from './utils/schemas';
import EmissionSource from '../../accountingModel/emissionSource';
import { Median } from '../../component/Division';
import { TextArea } from '../../component/TextArea';
import { UseOrgs } from '../../hooks';
import { culHistoryFn } from '../../util/util';
import { CustomTable } from '../component/CustomTable';
import EmissionSourceList from '../component/EmissionSourceList';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormGrid,
    FormLayout,
    Checkbox,
    Radio,
    Median,
    DatePicker,
    CustomTable,
    Select,
    TextArea,
  },
});

const OrgInfo = () => {
  // 当前 currentValue
  const [currentValue, setCurrentValue] = useState<string>('1');
  const [formValue, getFormValue] = useState<Computation>({ dataPeriod: '1' });
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: PageTypeInfo;
  }>();
  const useOrgArr = UseOrgs();
  const navigate = useNavigate();
  // 获取组织范围
  // const userInfo = useSelector<RootState, RootState['userInfo']>(
  //   s => s.userInfo,
  // );
  const [dataSource, getDataSource] = useState<OrgTree[]>([]);
  const orgArrFn = async () => {
    await getComputationComputationOrgList({
      orgId: Number(useOrgArr[0].id),
      computationId: useOrgArr[0].id,
    }).then(({ data }) => {
      // form.st('dataSource', data?.data?.tree);
      getDataSource([...(data.data?.tree || [])]);
      // form.setFieldState('allCheckedList', {
      //   dataSouce: [...(data?.data?.tree || [])],
      // });
    });
  };
  useEffect(() => {
    if (useOrgArr) {
      orgArrFn();
    }
  }, [useOrgArr]);
  const form = useMemo(() => {
    return createForm({
      readPretty: pageTypeInfo === PageTypeInfo.show,
      values: formValue,
      effects() {
        onFormInit(async current => {
          // 获取当前用户下的组织
          current.setFieldState('orgId', {
            dataSource: useOrgArr?.map(item => {
              return {
                label: item.orgName,
                value: item.id,
              };
            }),
          });
          // 如果是编辑核算
          if (pageTypeInfo === PageTypeInfo.edit) {
            current.setFieldState('orgId', {
              readPretty: true,
            });
          }
        });
        onFormMount(async () => {
          // 碳排放核算
        });
        onFieldValueChange('orgId', async field => {
          const { value } = field;
          getFormValue(form.getValuesIn('*'));
          form.setFieldState('allCheckedList', {
            value: [value],
          });
        });
      },
    });
  }, [pageTypeInfo, id, useOrgArr, dataSource]);
  /** 获取组织信息 */
  useEffect(() => {
    // 如果是选择排放源
    if (
      window.location.pathname.indexOf(
        '/carbonAccounting/carbonMissionAccounting/emissionSource/',
      ) >= 0
    ) {
      setCurrentValue('2');
    }
    if (id && pageTypeInfo !== PageTypeInfo.add) {
      getComputationComputationId({ id: +id }).then(({ data }) => {
        if (data.code === 200) {
          // treeFn(data.data?.orgId || 0);
          getFormValue({
            ...data.data,
            dataPeriod:
              PageTypeInfo.show === pageTypeInfo
                ? data.data?.dataPeriod
                : data.data?.dataPeriod
                ? `${data.data?.dataPeriod}`
                : data.data?.dataPeriod,
          });
        }
      });
    }
  }, []);
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `基本信息`,
    },
    {
      key: '2',
      label: `排放源列表`,
    },
  ];
  return (
    <div className={style.wrapper}>
      {/* 如果是新增核算 Tabs隐藏 */}
      {![
        '/carbonAccounting/carbonMissionAccounting/carbonMission/add',
        '/carbonAccounting/carbonMissionAccounting/carbonMission/edit',
        '/carbonAccounting/carbonMissionAccounting/emissionSource/',
      ].some(item => window.location.pathname.indexOf(item) >= 0) && (
        <Tabs
          defaultActiveKey='1'
          items={items}
          onChange={value => {
            setCurrentValue(value);
          }}
          className='customTabs'
        />
      )}
      {Number(currentValue) === 1 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/carbonMission/',
        ) >= 0 && (
          <Form form={form} previewTextPlaceholder='-'>
            <SchemaField schema={schema(dataSource)} />
          </Form>
        )}
      {/* 排放源列表 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/emissionSource',
        ) >= 0 && <EmissionSource />}
      {/* 碳排放核算详情 */}
      {Number(currentValue) === 2 &&
        window.location.pathname.indexOf(
          '/carbonAccounting/carbonMissionAccounting/carbonMission/',
        ) >= 0 &&
        pageTypeInfo === PageTypeInfo.show && <EmissionSourceList />}
      <FormActions
        place='center'
        buttons={compact([
          pageTypeInfo !== PageTypeInfo.show &&
            window.location.pathname.indexOf('emissionSource') === -1 && {
              title:
                pageTypeInfo === PageTypeInfo.add ? '保存，下一步' : '保存',
              type: 'primary',
              onClick: async () => {
                form.submit(async (value: any) => {
                  const newValue = {
                    allCheckedList: value?.allCheckedList,
                    dataPeriod: value?.dataPeriod,
                    orgId: value?.orgId,
                    year: value?.year,
                  };
                  if (pageTypeInfo === PageTypeInfo.add) {
                    await postComputationComputationAdd({
                      req: { ...newValue },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        // history.go(-1);
                        // 进入排放源
                        navigate(
                          virtualLinkTransform(
                            EcaRouteMaps.carbonMissionAccountingSourceInfo,
                            [PAGE_TYPE_VAR, ':id'],
                            [PageTypeInfo.add, data?.data as string],
                          ),
                        );
                        // window.open(
                        //   virtualLinkTransform(
                        //     EcaRouteMaps.carbonMissionAccountingSourceInfo,
                        //     [PAGE_TYPE_VAR, ':id'],
                        //     [PageTypeInfo.show, data?.data as string],
                        //   ),
                        // );
                      }
                    });
                  }
                  if (pageTypeInfo === PageTypeInfo.edit) {
                    await postComputationComputationEdit({
                      req: { ...newValue, id: Number(id) },
                    }).then(({ data }) => {
                      if (data.code === 200) {
                        history.go(-1);
                      }
                    });
                  }
                });
              },
            },
          {
            title: PageTypeInfo.show !== pageTypeInfo ? '取消' : '返回',
            onClick: async () => {
              // history.go(-1);
              navigate(culHistoryFn());
            },
          },
        ])}
      />
    </div>
  );
};

export default OrgInfo;
