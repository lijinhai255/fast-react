/**
 * @description 目标与范围
 */

import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Select,
  NumberPicker,
  Cascader,
  DatePicker,
} from '@formily/antd';
import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import { createSchemaField } from '@formily/react';
import dayjs from 'dayjs';
import { compact, isArray, isEmpty } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { getProductionList } from '@/views/carbonFootPrintLCA/ProductManagement/service';
import { Product } from '@/views/carbonFootPrintLCA/ProductManagement/type';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';
import { useOrgs } from '@/views/dashborad/organizations/OrgManage/hooks';
import { TextArea } from '@/views/eca/component/TextArea';

import { SYSTEM_BOUNDARY_TYPE } from './constant';
import style from './index.module.less';
import { schema } from './schemas';
import FormilyPictureCardUpload from '../../components/FormilyPictureCardUpload';
import FormilySystemBoundaryRadio from '../../components/FormilySystemBoundaryRadio';
import { postModelAdd, postModelEdit } from '../../service';
import { Model, Process } from '../../type';

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    TextArea,
    NumberPicker,
    Cascader,
    DatePicker,
    FormilySystemBoundaryRadio,
    FormilyPictureCardUpload,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

const ObjectivesAndScope = ({
  modelDetail,
  onSaveAndNextStepClick,
  onBackClick,
}: {
  /** 模型详情 */
  modelDetail?: Model;
  /** 保存,下一步方法 */
  onSaveAndNextStepClick: ({ id }: { id?: number }) => void;
  /** 返回方法 */
  onBackClick: () => void;
}) => {
  const { isAdd, isDetail, id } = usePageInfo();

  /** 所属组织枚举 */
  const orgList = useOrgs();

  const enumOptions = useAllEnumsBatch('factorUnitM,productOrigin');
  /** 单位枚举 */
  const unitEnum = enumOptions?.factorUnitM;
  /** 产品产地枚举 */
  const productOriginOptions = enumOptions?.productOrigin;

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  /** 当前选择的组织ID */
  const [currentOrgId, setCurrentOrgId] = useState<number>();

  /** 产品的枚举 */
  const [productionOptions, setProductionOptions] = useState<Product[]>();

  /** 保存的接口 */
  const postApi = id ? postModelEdit : postModelAdd;

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
        effects() {
          onFormInit(current => {
            current.setFieldState('*(baselineFlowUnit)', async state => {
              state.componentType = isDetail ? 'Input' : 'Cascader';
            });
          });
        },
      }),
    [],
  );

  /** 监听表单 */
  const onAddFormListenerFn = () => {
    form.removeEffects('productId');
    /** 切换组织获取组织下的产品列表 */
    form.addEffects('productId', () => {
      onFieldValueChange('orgId', field => {
        form.reset('productId');
        setProductionOptions(undefined);
        setCurrentOrgId(field.value);
      });
    });
  };

  /** 获取产品的枚举 */
  useEffect(() => {
    if (!currentOrgId) {
      setProductionOptions(undefined);
      return;
    }
    getProductionList({
      pageNum: 1,
      pageSize: 100000,
      orgId: currentOrgId,
    }).then(({ data }) => {
      setProductionOptions(data?.data?.list);
    });
  }, [currentOrgId]);

  useEffect(() => {
    /** 新增时、监听表单 */
    if (isAdd && !id && !modelDetail) {
      form.setFieldState('systemBoundaryType', {
        value: SYSTEM_BOUNDARY_TYPE.HALF_LIFE_CYCLE,
      });
      onAddFormListenerFn();
    }
    if (id && modelDetail && !isEmpty(unitEnum)) {
      /** 编辑时，所属组织和产品不可以编辑 */
      form.setFieldState('*(orgId,productId)', {
        disabled: true,
        required: false,
      });

      const { orgId, baselineFlowUnit, systemBoundaryImg } = modelDetail || {};

      /** 获取组织id */
      setCurrentOrgId(orgId);

      /** 基准流数量单位 */
      const baselineFlowUnitArr = baselineFlowUnit
        ? baselineFlowUnit.split(',')
        : [];

      const baselineFlowUnitItem = unitEnum?.find(
        item => item.dictValue === baselineFlowUnitArr[1],
      );

      /** 系统边界图的名称 */
      const nameArr = systemBoundaryImg?.split('/');
      /** 系统边界图 */
      const systemBoundaryImgArr = systemBoundaryImg
        ? [
            {
              url: systemBoundaryImg,
              uid: `${new Date().getTime()}`,
              name: nameArr?.[nameArr.length - 1],
            },
          ]
        : undefined;

      form.setValues({
        ...modelDetail,
        baselineFlowUnit:
          isDetail && baselineFlowUnit
            ? baselineFlowUnitItem?.dictLabel
            : baselineFlowUnitArr,
        systemBoundaryImg: systemBoundaryImgArr,
      });

      /** 监听表单 */
      onAddFormListenerFn();
    }
  }, [isAdd, id, modelDetail, unitEnum]);

  /** 下拉框枚举值 */
  useEffect(() => {
    if (orgList) {
      /** 所属组织 */
      form.setFieldState('orgId', {
        dataSource: orgList.map(item => ({
          label: item.orgName,
          value: item.id,
        })),
      });
    }

    /** 产品 */
    form.setFieldState('productId', {
      dataSource: productionOptions?.map(item => ({
        ...item,
        label: `${item.name} ${item.code}`,
        value: item.id,
      })),
    });

    if (unitEnum) {
      /** 基准流数量单位 */
      form.setFieldState('baselineFlowUnit', {
        dataSource: changeFactorM2cascaderOptions(unitEnum),
      });

      /** 产品重量单位 */
      form.setFieldState('unitProductWeightUnit', {
        dataSource: unitEnum
          ?.filter(
            item => item.sourceType === '1' && item.sourceName === '质量单位',
          )
          ?.map(v => ({
            ...v,
            label: v.dictLabel,
            value: v.dictValue,
          })),
      });
    }

    /** 产品产地 */
    if (productOriginOptions) {
      form.setFieldState('productOrigin', {
        dataSource: productOriginOptions.map(item => ({
          ...item,
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });
    }
  }, [orgList, productionOptions, unitEnum, productOriginOptions]);

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <Form form={form} previewTextPlaceholder='-'>
          <SchemaField schema={schema()} />
        </Form>
      </div>
      <FormActions
        className='footWrapper'
        place='center'
        buttons={compact([
          !isDetail && {
            title: '保存，下一步',
            type: 'primary',
            loading: btnLoading,
            onClick: async () => {
              const values = await form.submit<Model>();
              try {
                const {
                  baselineFlowUnit,
                  systemBoundaryImg,
                  startDate,
                  endDate,
                } = values || {};

                const result = {
                  ...values,
                  baselineFlowUnit: baselineFlowUnit
                    ? String(baselineFlowUnit)
                    : undefined,
                  systemBoundaryImg: isArray(systemBoundaryImg)
                    ? systemBoundaryImg[0]?.url
                    : systemBoundaryImg,
                  startDate: dayjs(startDate).format('YYYY-MM-DD HH:mm:ss'),
                  endDate: dayjs(endDate).format('YYYY-MM-DD HH:mm:ss'),
                };
                setBtnLoading(true);
                const { data } = await postApi(result as Process);
                Toast('success', '保存成功');
                setBtnLoading(false);
                form.reset();
                onSaveAndNextStepClick?.({
                  id: data?.data?.id || id,
                });
              } catch (e) {
                setBtnLoading(false);
                throw e;
              }
            },
          },
          {
            title: '返回',
            onClick: async () => {
              onBackClick();
            },
          },
        ])}
      />
    </div>
  );
};
export default ObjectivesAndScope;
