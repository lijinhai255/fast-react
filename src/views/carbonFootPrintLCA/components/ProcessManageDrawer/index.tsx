/**
 * @description 过程管理详情抽屉（产品、输入、输出）
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
  Radio,
} from '@formily/antd';
import { createForm, onFieldValueChange, onFormInit } from '@formily/core';
import { FormConsumer, createSchemaField } from '@formily/react';
import { Button, Drawer } from 'antd';
import classNames from 'classnames';
import { isEmpty } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormilyFileUpload } from '@/components/FormilyFileUpload';
import { IconFont } from '@/components/IconFont';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import { changeFactorM2cascaderOptions } from '@/views/Factors/Info/utils';
import { publishYear } from '@/views/Factors/utils';
import { useAllEnumsBatch } from '@/views/dashborad/Dicts/hooks';

import {
  PRODUCTION_TYPE,
  INPUT_TYPE,
  OUTPUT_TYPE,
  SELECT_BUTTON_TYPE,
} from './constant';
import style from './index.module.less';
import {
  schema,
  upOrDownstreamDataScheams,
  onHandleAddOrEditData,
  onHandleDetailData,
} from './schemas';
import { getUnitConvert } from './service';
import { ProcessManageFormProps, ChooseInputOutputLibrary } from './type';
import { Factor } from '../ChooseFactorModal/type';
import { ChooseProcessLibrary } from '../ChooseProcessModal/type';
import {
  LIFE_CYCLE_LABLE,
  PROCESS_CATATYPE,
  PROCESS_CATATYPE_LABEL,
} from '../ProcessManageTable/constant';
import { InputOutput } from '../ProcessManageTable/type';

/** 新增、编辑、查看 */
const { add, edit, show } = PageTypeInfo;

/** 过程管理类型：产品、输入 */
const { PRODUCTION, INPUT } = PROCESS_CATATYPE;

/** 上下游数据选择按钮类型：过程数据、因子数据 */
const { PROCESS_DATA, FACTOR_DATA } = SELECT_BUTTON_TYPE;

/** 产品类型：避免产品 */
const { AVOID_PRODUCT } = PRODUCTION_TYPE;

/** 输入类型：处置产品 */
const { DISPOSAL_PRODUCTS } = INPUT_TYPE;

/** 输出类型：可再生输出物 */
const { RENEWABLE_OUTPUTS } = OUTPUT_TYPE;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    NumberPicker,
    Cascader,
    Radio,
    FormilyFileUpload,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

interface ProcessManageDrawerProps {
  /** 列表操作按钮的类型 */
  actionBtnType?: string;
  /** 类别:1 输入; 2 输出; 3 产品 */
  categoryType?: number;
  /** 生命周期阶段 */
  lifeStageType?: number;
  /** 支撑材料所处的模块类型 */
  objectType: number;
  /** 控制抽屉的显隐 */
  open: boolean;
  /** 过程管理详情 */
  processManageDataSource?: InputOutput;
  /** 列表数据ID */
  processColumnId?: number;
  /** 是否展示过程数据完整信息 */
  showWholeProcess: boolean;
  /** 是否展示生命周期阶段选择按钮 */
  showLifeStageSelectRadio?: boolean;
  /** 选择的输入 */
  selectedInput?: ChooseInputOutputLibrary;
  /** 选择的过程 */
  selectedProcess?: ChooseProcessLibrary;
  /** 选择的因子 */
  selectedFactor?: Factor;
  /** 当前菜单选中的过程id */
  treeNodeId?: number;
  /** 上下游数据按钮切换的方法 */
  onDataTypeChange: () => void;
  /** 选择输入的方法 */
  onChooseInputClick?: (name?: string) => void;
  /** 选择过程的方法 */
  onChooseProcessClick?: () => void;
  /** 选择因子的方法 */
  onChooseFactorClick?: () => void;
  /** 保存方法 */
  onSave: (
    /** 保存的数据 */
    values: InputOutput,
    /** 成功回调 */
    successCallBack: () => void,
    /** 失败回调 */
    failCallBack: () => void,
  ) => void;
  /** 关闭抽屉的方法 */
  onClose: () => void;
}

const ProcessManageDrawer = ({
  actionBtnType,
  categoryType,
  lifeStageType,
  objectType,
  open,
  processManageDataSource,
  processColumnId,
  showWholeProcess,
  showLifeStageSelectRadio,
  selectedInput,
  selectedProcess,
  selectedFactor,
  treeNodeId,
  onDataTypeChange,
  onChooseProcessClick,
  onChooseFactorClick,
  onChooseInputClick,
  onSave,
  onClose,
}: ProcessManageDrawerProps) => {
  const isAdd = actionBtnType === add;
  const isDetail = actionBtnType === show;

  /** 上下游数据的过程path */
  const upOrDownstreamProcessPath =
    'upOrDownstreamData.processName,upOrDownstreamData.relatedProductName,upOrDownstreamData.relatedProductUnit,upOrDownstreamData.timeRepresent,upOrDownstreamData.areaRepresent,upOrDownstreamData.areaRepresentDetail,upOrDownstreamData.techRepresent,upOrDownstreamData.dataSource';
  /** 上下游数据的因子path */
  const upOrDownstreamFactorPath = `${upOrDownstreamProcessPath},upOrDownstreamData.factorValue,upOrDownstreamData.factorUnitZ`;
  /** 上下游数据的输入path */
  const downStreamInputPath =
    'downStreamInputData.processName,downStreamInputData.relatedInputName,downStreamInputData.relatedInputType,downStreamInputData.relatedInputUnit,downStreamInputData.recyclingCount,downStreamInputData.convertRatio';
  /** 单位换算比例的path */
  const convertRatioPath =
    'upOrDownstreamData.convertRatio,downStreamInputData.convertRatio';
  /** 单位的path */
  const unitPath =
    'unit,energyUnit,upOrDownstreamData.relatedProductUnit,downStreamInputData.relatedInputUnit,downStreamInputData.recyclingUnit';
  /** 抽屉名称 */
  const lifeCycleName =
    LIFE_CYCLE_LABLE[lifeStageType as keyof typeof LIFE_CYCLE_LABLE];
  const categoryName =
    PROCESS_CATATYPE_LABEL[categoryType as keyof typeof PROCESS_CATATYPE_LABEL];
  const title = showWholeProcess ? categoryName : lifeCycleName;

  /** 抽屉标题 */
  const drawerTitle = {
    [add]: `新增${title}`,
    [edit]: `编辑${title}`,
    [show]: `${title}详情`,
  };

  const enumOptions = useAllEnumsBatch(
    'factorUnitM,cequivalentUnitZ,productOrigin',
  );
  /** 单位枚举 */
  const unitOptions = enumOptions?.factorUnitM;

  /** 产品碳足迹-单位 */
  const productCarbonFootPrintUnitOptions = enumOptions?.cequivalentUnitZ;

  /** 地理代表性枚举 */
  const areaRepresentOptions = enumOptions?.productOrigin;

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  /** 输出-类型 */
  const [outputType, setOutputType] = useState<number>();

  /** 数量单位 */
  const [countUnit, setCountUnit] = useState<string>();

  /** 上下游数据的产品单位 */
  const [productUnit, setProductUnit] = useState<string>();

  /** 详情返回的单位换算比例 */
  const [convertRatio, setConvertRatio] = useState<number>();

  /** 可再生输出物-选择输入名称 */
  const [downStreamInputRelatedInputName, setDownStreamInputRelatedInputName] =
    useState<string>();

  /** 可再生输出物-循环利用数量 */
  const [downStreamInputRecyclingCount, setDownStreamInputRecyclingCount] =
    useState<number>();

  /** 可再生输出物-单位换算比例 */
  const [downStreamInputConvertRatio, setDownStreamInputConvertRatio] =
    useState<number>();

  const form = useMemo(
    () =>
      createForm({
        readPretty: isDetail,
        effects() {
          onFormInit(current => {
            current.setFieldState(`*(${unitPath})`, async state => {
              state.componentType = isDetail ? 'Input' : 'Cascader';
            });
          });
        },
      }),
    [lifeStageType, categoryType, actionBtnType],
  );

  /** 表单监听 */
  const onAddFormListenerFn = () => {
    form.removeEffects('*');
    form.addEffects('*', () => {
      /** 切换上下游数据选择按钮，清空上下游数据，打开禁用限制 */
      onFieldValueChange('dataType', () => {
        form.reset('upOrDownstreamData');
        form.setFieldState(`*(${upOrDownstreamFactorPath})`, {
          disabled: false,
          required: true,
        });
        /** 地理代表性详情地址不必填 */
        form.setFieldState(`*(upOrDownstreamData.areaRepresentDetail)`, {
          disabled: false,
          required: false,
        });
        form.setFieldState(
          '*(upOrDownstreamData.productCarbonFootPrint,upOrDownstreamData.area)',
          state => {
            state.decoratorProps = {
              ...state.decoratorProps,
              asterisk: true,
            };
          },
        );
        onDataTypeChange();
      });
      /** 原材料、分销储存、产品使用、产品、输入（非运输类型）、输出的数量单位 */
      onFieldValueChange('unit', field => {
        /** 输出-可再生输出物类型-下游数据-循环利用数量-单位 = 其数量单位 */
        form.setFieldState('*(downStreamInputData.recyclingUnit)', {
          value: field.value,
        });
        setCountUnit(field?.value?.[1]);
        setConvertRatio(undefined);
      });
      /** 输入-运输类型-按里程-货物重量单位 （复合单位） */
      onFieldValueChange('weightUnit', field => {
        const unitLabelName = `${field.inputValues?.[1]?.dictLabel}km`;
        const unitItem = unitOptions?.find(v => v.dictLabel === unitLabelName);
        setCountUnit(unitItem?.dictValue);
        setConvertRatio(undefined);
      });

      /** 输入-运输类型-按能耗-能耗单位 */
      onFieldValueChange('energyUnit', field => {
        setCountUnit(field?.value?.[1]);
        setConvertRatio(undefined);
      });
      /** 上下游数据的产品单位 */
      onFieldValueChange('upOrDownstreamData.relatedProductUnit', field => {
        setProductUnit(field?.value?.[1]);
        setConvertRatio(undefined);
      });

      /** 下游数据-输入的输入单位 */
      onFieldValueChange('downStreamInputData.relatedInputUnit', field => {
        setProductUnit(field?.value?.[1]);
        setConvertRatio(undefined);
      });

      /** 输出类型 */
      onFieldValueChange('inputOutputType', field => {
        /** 切换输出类型，重置下游数据 */
        form.reset(`*(${downStreamInputPath})`);
        setDownStreamInputConvertRatio(undefined);
        setDownStreamInputRecyclingCount(undefined);
        setDownStreamInputRelatedInputName(undefined);
        /** 当输出类型为可再生输出物时，初始循环利用数量和单位换算比例 不必填 */
        if (field.value === RENEWABLE_OUTPUTS) {
          form.setFieldState('*(downStreamInputData.recycling)', state => {
            state.decoratorProps = {
              ...state.decoratorProps,
              asterisk: false,
            };
          });
          form.setFieldState(
            '*(downStreamInputData.recyclingCount,downStreamInputData.convertRatio)',
            {
              required: false,
            },
          );
        }
        setOutputType(field.value);
      });
      /** 选择输入名称 */
      onFieldValueChange('downStreamInputData.relatedInputName', field => {
        setDownStreamInputRelatedInputName(field.value);
      });
      /** 循环利用数量 */
      onFieldValueChange('downStreamInputData.recyclingCount', field => {
        setDownStreamInputRecyclingCount(field.value);
      });
      /** 单位换算比例 */
      onFieldValueChange('downStreamInputData.convertRatio', field => {
        setDownStreamInputConvertRatio(field.value);
      });
    });
  };

  /** 设置单位换算比例 */
  useEffect(() => {
    if (!countUnit || !productUnit) {
      form.setFieldState(`*(${convertRatioPath})`, {
        value: undefined,
      });
    }
    /** 详情返回了单位换算比例，不需要调用接口 */
    if (convertRatio) {
      form.setFieldState(`*(${convertRatioPath})`, {
        value: convertRatio,
      });
      return;
    }
    if (countUnit && productUnit) {
      getUnitConvert({
        unitFrom: countUnit,
        unitTo: productUnit,
      }).then(({ data }) => {
        form.setFieldState(`*(${convertRatioPath})`, {
          value: data?.data,
        });
      });
    }
  }, [countUnit, productUnit, convertRatio]);

  /** 可再生输出物的下游数据 要么要不填写，要不全部填 */
  useEffect(() => {
    if (
      !downStreamInputRecyclingCount &&
      !downStreamInputConvertRatio &&
      !downStreamInputRelatedInputName
    ) {
      form.clearErrors(
        '*(downStreamInputData.recyclingCount,downStreamInputData.convertRatio)',
      );
      form.setFieldState('*(downStreamInputData.recycling)', state => {
        state.decoratorProps = {
          ...state.decoratorProps,
          asterisk: false,
        };
      });
      form.setFieldState(
        '*(downStreamInputData.recyclingCount,downStreamInputData.convertRatio)',
        {
          required: false,
        },
      );
      return;
    }

    form.setFieldState('*(downStreamInputData.recycling)', state => {
      state.decoratorProps = {
        ...state.decoratorProps,
        asterisk: true,
      };
    });
    form.setFieldState(
      '*(downStreamInputData.recyclingCount,downStreamInputData.convertRatio)',
      {
        required: true,
      },
    );
  }, [
    downStreamInputRecyclingCount,
    downStreamInputConvertRatio,
    downStreamInputRelatedInputName,
  ]);

  useEffect(() => {
    if (!categoryType && !actionBtnType) {
      return;
    }

    if (isDetail) {
      form.setFieldState('*(downStreamInputData.recycling)', state => {
        state.decoratorProps = {
          ...state.decoratorProps,
          asterisk: false,
        };
      });
    }
    /** 新增时，监听表单变化 */
    if (isAdd && !processManageDataSource) {
      onAddFormListenerFn();
      return;
    }

    /** 获取详情 */
    if (!isAdd && processManageDataSource && !isEmpty(unitOptions)) {
      /** 详情时产品类型、上下游数据除单位换算比例以外的字段禁用 */
      form.setFieldState(`*(productType,${upOrDownstreamFactorPath})`, {
        disabled: true,
        required: false,
      });

      /** 数量单位、上下数据的产品单位、单位换算比例、输出类型 */
      const {
        unit,
        relatedProductUnit,
        convertRatio: convertRatioBack,
        inputOutputType,
        renewingType,
        recyclingCount,
        relatedProductName,
      } = processManageDataSource;
      /** 数量单位处理 */
      const unitBack = unit ? unit.split(',') : undefined;

      /** 上下游数据关联的产品单位 */
      const relatedProductUnitBack = relatedProductUnit
        ? relatedProductUnit.split(',')
        : undefined;

      form.setValues({
        ...onHandleDetailData({
          categoryType,
          lifeStageType,
          showWholeProcess,
          processManageDataSource,
          unitOptions,
          isDetail,
        }),
      });

      /** 禁用产品碳足迹、地理代表性不需要展示必填符号 */
      form.setFieldState(
        '*(upOrDownstreamData.productCarbonFootPrint,upOrDownstreamData.area)',
        state => {
          state.decoratorProps = {
            ...state.decoratorProps,
            asterisk: false,
          };
        },
      );

      form.setFieldState('supportMaterials', {
        visible: !renewingType,
      });

      /** 设置可再生输出物的可循环利用数量 */
      setDownStreamInputRecyclingCount(recyclingCount);
      /** 设置可再生输出物的单位换算比例 */
      setDownStreamInputConvertRatio(convertRatioBack);
      /** 设置可再生输出物的输入名称 */
      setDownStreamInputRelatedInputName(relatedProductName);
      /** 输出类型 */
      setOutputType(inputOutputType);
      /** 单位 */
      setCountUnit(unitBack?.[1]);
      /** 上下游数据关联单位 */
      setProductUnit(relatedProductUnitBack?.[1]);
      /** 单位换算比例 */
      setConvertRatio(convertRatioBack);

      /** 监听表单变化 */
      onAddFormListenerFn();
    }
  }, [
    isAdd,
    processManageDataSource,
    lifeStageType,
    categoryType,
    actionBtnType,
    unitOptions,
  ]);

  /** 选择的输入赋值 */
  useEffect(() => {
    if (selectedInput) {
      const { processName, name, inputOutputType, unit } = selectedInput || {};
      form.setValues({
        downStreamInputData: {
          processName,
          relatedInputName: name,
          relatedInputType: inputOutputType,
          relatedInputUnit: unit ? unit.split(',') : undefined,
        },
      });

      /** 监听表单变化 */
      onAddFormListenerFn();
    }
  }, [selectedInput]);

  /** 选择过程赋值 */
  useEffect(() => {
    if (selectedProcess) {
      /** 选择过程后除单位换算比例以外都禁用 */
      form.setFieldState(`*(${upOrDownstreamProcessPath})`, {
        disabled: true,
        required: false,
      });
      form.setFieldState('*(upOrDownstreamData.area)', state => {
        state.decoratorProps = {
          ...state.decoratorProps,
          asterisk: false,
        };
      });
      const {
        processName,
        outputProductName,
        productUnit: relatedProductUnit,
        timeRepresent,
        areaRepresent,
        areaRepresentDetail,
        techRepresent,
        dataSource,
      } = selectedProcess || {};
      form.setValues({
        upOrDownstreamData: {
          processName,
          relatedProductName: outputProductName,
          relatedProductUnit: relatedProductUnit
            ? relatedProductUnit.split(',')
            : undefined,
          timeRepresent,
          areaRepresent,
          areaRepresentDetail,
          techRepresent,
          dataSource,
        },
      });

      /** 监听表单变化 */
      onAddFormListenerFn();
    }
  }, [selectedProcess]);

  /** 选择因子赋值 */
  useEffect(() => {
    if (selectedFactor) {
      /** 选择因子后除单位换算比例以外都禁用 */
      form.setFieldState(`*(${upOrDownstreamFactorPath})`, {
        disabled: true,
        required: false,
      });
      form.setFieldState(
        '*(upOrDownstreamData.productCarbonFootPrint,upOrDownstreamData.area)',
        state => {
          state.decoratorProps = {
            ...state.decoratorProps,
            asterisk: false,
          };
        },
      );

      const {
        name,
        productName,
        factorValue,
        unit: relatedFactorUnit,
        year,
        areaRepresent,
        areaRepresentDetail,
        techRepresent,
        institution,
      } = selectedFactor || {};
      const unitBack = relatedFactorUnit?.split('/');
      const unitMItem = unitOptions?.find(
        item => item.dictLabel === unitBack?.[1],
      );
      const unitZItem = productCarbonFootPrintUnitOptions?.find(
        item => item.dictLabel === unitBack?.[0],
      );

      form.setValues({
        upOrDownstreamData: {
          processName: name,
          relatedProductName: productName,
          factorValue,
          factorUnitZ: unitZItem ? unitZItem?.dictValue : undefined,
          relatedProductUnit: unitMItem
            ? [unitMItem?.sourceType, unitMItem?.dictValue]
            : undefined,
          timeRepresent: year,
          areaRepresent,
          areaRepresentDetail,
          techRepresent,
          dataSource: institution,
        },
      });

      /** 监听表单变化 */
      onAddFormListenerFn();
    }
  }, [selectedFactor]);

  /** 表单的枚举值设置 */
  useEffect(() => {
    if (!actionBtnType) {
      return;
    }
    /** 单位的枚举 */
    if (unitOptions) {
      form.setFieldState(`*(${unitPath})`, {
        dataSource: changeFactorM2cascaderOptions(unitOptions),
      });
      form.setFieldState('weightUnit', {
        dataSource: unitOptions
          ?.filter(v => v.sourceType === '1' && v.sourceName === '质量单位')
          ?.slice(0, 3)
          ?.map(item => ({
            ...item,
            label: item.dictLabel,
            value: item.dictValue,
          })),
      });
    }

    /** 因子数据-产品碳足迹-单位 */
    if (productCarbonFootPrintUnitOptions) {
      form.setFieldState('*(upOrDownstreamData.factorUnitZ)', {
        dataSource: productCarbonFootPrintUnitOptions?.map(v => ({
          ...v,
          label: v.dictLabel,
          value: v.dictValue,
        })),
      });
    }

    /** 时间代表性 */
    form.setFieldState('upOrDownstreamData.timeRepresent', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });

    /** 地理代表性 */
    if (areaRepresentOptions) {
      form.setFieldState('upOrDownstreamData.areaRepresent', {
        dataSource: areaRepresentOptions.map(item => ({
          label: item.dictLabel,
          value: item.dictValue,
        })),
      });
    }
  }, [
    unitOptions,
    productCarbonFootPrintUnitOptions,
    areaRepresentOptions,
    actionBtnType,
  ]);

  const onDrawerInit = () => {
    form.reset();
    setOutputType(undefined);
    setCountUnit(undefined);
    setProductUnit(undefined);
    setConvertRatio(undefined);
    setDownStreamInputRelatedInputName(undefined);
    setDownStreamInputRecyclingCount(undefined);
    setDownStreamInputConvertRatio(undefined);
  };

  return (
    <Drawer
      className={`${style.wrapper}`}
      title={drawerTitle[actionBtnType as keyof typeof actionBtnType]}
      open={open}
      closeIcon={false}
      maskClosable={false}
      destroyOnClose
      placement='right'
      size='large'
      extra={
        <div
          className={style.closeIcon}
          onClick={() => {
            onDrawerInit();
            onClose();
          }}
        >
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => {
        onDrawerInit();
        onClose();
      }}
      footer={[
        <Button
          onClick={() => {
            onDrawerInit();
            onClose();
          }}
        >
          {isDetail ? '关闭' : '取消'}
        </Button>,
        !isDetail && (
          <Button
            type='primary'
            loading={btnLoading}
            onClick={async () => {
              const values = await form.submit<ProcessManageFormProps>();

              const {
                inputOutputType,
                count = 0,
                downStreamInputData,
              } = values;
              const {
                recyclingCount = 0,
                convertRatio: convertRatioValue = 0.000001,
              } = downStreamInputData || {};

              /** 输出类型为可再生输出物时 输入的填写提示 */
              if (
                inputOutputType === RENEWABLE_OUTPUTS &&
                (downStreamInputRecyclingCount ||
                  downStreamInputConvertRatio) &&
                !downStreamInputRelatedInputName
              ) {
                Toast('error', '请选择输入');
                return;
              }

              /** 详情反显时没有 选择输入的数量 编辑的时候走接口控制此限制 注：要单位换算之后的数量比对 */
              if (
                outputType === RENEWABLE_OUTPUTS &&
                recyclingCount > count / convertRatioValue
              ) {
                Toast('error', '循环利用数量不能大于可再生输出物的数量');
                return;
              }
              const result = {
                ...onHandleAddOrEditData({
                  categoryType,
                  lifeStageType,
                  showWholeProcess,
                  showLifeStageSelectRadio,
                  objectType,
                  processColumnId,
                  formValues: values,
                }),
                category: categoryType,
                /** 当前所处的过程id = 当前选中菜单的ID = 过程描述ID */
                downstreamProcessId: treeNodeId,
                /** 因子id选择因子时一定要传 */
                factorId: selectedFactor ? selectedFactor?.id : undefined,
                id: processColumnId,
                /** 选择过程时的过程id 如果为输出-可再生输出物-选择输入时 为输入列表中的downstreamProcessId */
                upstreamProcessId:
                  outputType === RENEWABLE_OUTPUTS
                    ? selectedInput?.downstreamProcessId
                    : selectedProcess
                    ? selectedProcess?.id
                    : undefined,
                /** 选择过程时的产品id 如果为输出-可再生输出物-选择输入时=输入列表的id */
                upstreamProcessProductId:
                  outputType === RENEWABLE_OUTPUTS
                    ? selectedInput?.id
                    : selectedProcess
                    ? selectedProcess?.outputProductId
                    : undefined,
              };

              setBtnLoading(true);
              onSave(
                result as unknown as InputOutput,
                () => {
                  Toast('success', '保存成功');
                  setBtnLoading(false);
                  onDrawerInit();
                },
                () => {
                  setBtnLoading(false);
                },
              );
            }}
          >
            保存
          </Button>
        ),
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <SchemaField
          schema={schema({
            categoryType,
            lifeStageType,
            showWholeProcess,
            showLifeStageSelectRadio,
          })}
        />
        <div className={style.upOrDownstreamDataWrap}>
          <FormConsumer>
            {currentForm => {
              /** 上下游数据的选择按钮的类型 */
              const dataType = currentForm.getValuesIn('dataType');

              /** 上下游数据选择按钮为因子数据时 名称为因子名称 */
              form.setFieldState('upOrDownstreamData.processName', {
                title: dataType === FACTOR_DATA ? '因子名称' : '过程名称',
              });

              /** 产品类型 */
              const productType = currentForm.getValuesIn('productType');

              /** 输入、输出类型 */
              const inputOutputType =
                currentForm.getValuesIn('inputOutputType');
              /** 输入名称 */
              const inputName = currentForm.getValuesIn('name');

              /** 查看详情时不展示选择按钮 */
              if (isDetail) {
                return '';
              }

              /** 如果产品类型为非“避免产品” 则不展示按钮 */
              if (
                categoryType === PRODUCTION &&
                productType !== AVOID_PRODUCT
              ) {
                return '';
              }

              /** 如果输入类型为“处置产品” 则不展示按钮 */
              if (
                categoryType === INPUT &&
                inputOutputType === DISPOSAL_PRODUCTS
              ) {
                return '';
              }

              switch (dataType) {
                /** 过程数据 */
                case PROCESS_DATA:
                  return (
                    <div className={style.upOrDownstreamData}>
                      <Button
                        type='primary'
                        onClick={() => {
                          onChooseProcessClick?.();
                        }}
                      >
                        选择过程
                      </Button>
                    </div>
                  );
                /** 因子数据 */
                case FACTOR_DATA:
                  return (
                    <div className={style.upOrDownstreamData}>
                      <Button
                        type='primary'
                        onClick={() => {
                          onChooseFactorClick?.();
                        }}
                      >
                        选择因子
                      </Button>
                    </div>
                  );
                default:
                  /** 输入 */
                  return (
                    <div
                      className={classNames(
                        style.upOrDownstreamData,
                        style.outputData,
                      )}
                    >
                      下游数据
                      <div>
                        <Button
                          type='primary'
                          onClick={() => {
                            onChooseInputClick?.(inputName);
                          }}
                        >
                          选择输入
                        </Button>
                      </div>
                    </div>
                  );
              }
            }}
          </FormConsumer>
          <SchemaField schema={upOrDownstreamDataScheams(categoryType)} />
        </div>
      </Form>
    </Drawer>
  );
};
export default ProcessManageDrawer;
