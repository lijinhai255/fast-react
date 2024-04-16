import {
  ArrayTable,
  Cascader,
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
} from '@formily/antd';
import {
  FormPath,
  createForm,
  onFieldValueChange,
  onFormInit,
} from '@formily/core';
import { FormConsumer, createSchemaField } from '@formily/react';
import { Button } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import {
  cloneDeep,
  compact,
  differenceWith,
  isEmpty,
  isEqual,
  omit,
  uniqBy,
} from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import {
  FactorGasRes,
  getSystemFactorId,
  getSystemLibUnitUnitConvert,
} from '@/sdks/systemV2ApiDocs';
import {
  EmissionSource,
  EmissionSourceGas,
  EmissionSourceReq,
  getComputationEnumsRelGhg2iso,
  getComputationEnumsRelGhg2isoProps,
  getComputationEnumsRelIso2ghg,
  getComputationEnumsRelIso2ghgProps,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast, getSearchParams, randomString } from '@/utils';
import {
  changeFactorM2cascaderOptions,
  gasEnumsMap,
  gasTableData,
  setGasSelectOptions,
} from '@/views/Factors/Info/utils';
import { publishYear } from '@/views/Factors/utils';
import { FileListType } from '@/views/carbonFootPrint/utils/types';
import SelectButton from '@/views/components/SelectButton';
import {
  changeEnum2Options,
  useAllEnumsBatch,
} from '@/views/dashborad/Dicts/hooks';
import { ComputationEnums, useGwpOption } from '@/views/eca/hooks';
import Report from '@/views/supplyChainCarbonManagement/components/Report';

import style from './index.module.less';
import { emissionDataFieldState } from './utils';
import {
  CHOOSE_FACTOR,
  FACTOR_SELECT_WAY,
  FACTOR_SELECT_WAY_TEXT,
} from './utils/constant';
import {
  activityFormSchema,
  baseSchema,
  factorBaseSchema,
  factorSchema,
} from './utils/schemas';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    Select,
    Cascader,
    ArrayTable,
    SelectButton,
    NumberPicker,
  },
});
const EmissionSourceComponent = ({
  autoCreateSourceCode = false,
  readPretty = false,
  emissionSourceId,
  activityDataVisible = false,
  noRequiredField = '',
  disabledFieldPath = '',
  emissionSourceDetailData,
  isSetSupportFiles = false,
  onSelectFn,
  onConfirmFn,
  onCancelFn,
}: {
  /** 是否自动创建排放源id */
  autoCreateSourceCode?: boolean;
  /** 页面是否为readPretty模式 */
  readPretty?: boolean;
  /** 排放源id */
  emissionSourceId: number;
  /** 活动数据是否展示 */
  activityDataVisible?: boolean;
  /** 非必填的字段 */
  noRequiredField?: string;
  /** 禁用的字段 */
  disabledFieldPath?: string;
  /** 详情数据 */
  emissionSourceDetailData?: EmissionSource;
  /** 是否设置支撑材料 */
  isSetSupportFiles?: boolean;
  /** 点击选择的方法 选择排放因子/选择供应商数据 */
  onSelectFn?: (data: {
    /** 路由携带参数 */
    urlParamsData: {
      [CHOOSE_FACTOR.FORM_VALUES]: EmissionSource;
      likeName?: string;
    };
    /** 排放选择类型 1: 选择因子 2: 新建因子 3: 供应商数据 */
    factorType: '1' | '2' | '3';
  }) => void;
  /** 点击确定按钮的方法 */
  onConfirmFn?: (data: EmissionSourceReq) => void;
  /** 点击取消或者返回的方法 */
  onCancelFn: () => void;
}) => {
  // 路由携带的参数
  const search = { ...getSearchParams()[0] };

  // 获取选择因子和供应商数据后，表单数据
  const formValuesBack = JSON.parse(search[CHOOSE_FACTOR.FORM_VALUES] || '{}');

  /** 获取排放源ID */
  const [factorSourceId, setFactorSourceId] = useState(
    Number(search[CHOOSE_FACTOR.FACTOR_ID]),
  );

  // 枚举值分别为 排放因子各气体对应的分子单位、 活动数据单位/分母单位、氢氟碳化物（HFCs）、全氟化碳（PFCs）、供应商数据-分子单位
  const enums = useAllEnumsBatch(
    `${Object.values(gasEnumsMap).join(
      ',',
    )},factorUnitM,PFCseNUM,HFCsEnum,cequivalentUnitZ`,
  );
  // GHG类别枚举
  const GHGCategoryArr = ComputationEnums('GHGCategory');
  // ISO类别枚举
  const ISOCategoryArr = ComputationEnums('ISOCategory');
  // 活动数据类别枚举
  const ActivityCategoryArr = ComputationEnums('ActivityCategory');
  // 排放因子类别枚举
  const factorTypeArr = ComputationEnums('factorType');
  // 获取排放因子GWP
  const gwpObj = useGwpOption();

  // 设置ghg或者iso切换后的值
  const [ghgOrIsoValue, setGhgOrIsoValue] = useState<{
    type: string;
    value?: number[];
  }>({
    type: '',
  });

  // 设置排放数据选择方式
  const [factorSelectWay, setFactorSelectWay] = useState<'1' | '2' | '3'>('1');

  /** 上传文件列表 */
  const [fileList, setFileList] = useState<FileListType[]>([]);

  /** 详情获取的文件列表 */
  const [fileListDetail, setFileListDetail] = useState<FileListType[]>([]);

  /** 删除的文件列表 */
  const [delFileList, setDelFileList] = useState<FileListType[]>([]);

  const form = useMemo(() => {
    return createForm({
      readPretty,
      effects() {
        onFormInit(current => {
          current.setFieldState('gasList', {
            title: readPretty
              ? '排放因子'
              : '排放因子（以下温室气体类型必填其一）',
          });
        });
      },
    });
  }, [readPretty]);

  /** 设置非必填的字段 */
  useEffect(() => {
    if (noRequiredField) {
      form.setFieldState(`*(${noRequiredField})`, {
        required: false,
      });
    }
  }, [noRequiredField]);

  /** 设置禁用字段 */
  useEffect(() => {
    if (disabledFieldPath) {
      form.setFieldState(`*(${disabledFieldPath})`, {
        disabled: true,
        required: false,
      });
    }
  }, [disabledFieldPath]);

  /** 是否展示活动数据 */
  useEffect(() => {
    form.setFieldState('dataValue', {
      visible: activityDataVisible,
    });
  }, [activityDataVisible]);

  /** 自动生成排放源ID */
  useEffect(() => {
    if (autoCreateSourceCode) {
      form.setValues({
        sourceCode: randomString(),
      });
    }
  }, [autoCreateSourceCode]);

  /** 单位换算比例 */
  const unitCovertFn = async () => {
    // 因子分母单位值
    const factorUnitM = form.getValuesIn('gasList[0].factorUnitM')?.[1];
    // 供应商分母单位值
    const supplierUnitM = form.getValuesIn('supplierData.factorUnitM')?.[1];
    // 活动数据单位
    const activityUnit = form.getValuesIn('activityUnit')?.[1];

    const unitM = factorUnitM || supplierUnitM;

    if (!(unitM && activityUnit)) {
      return;
    }

    getSystemLibUnitUnitConvert({
      unitFrom: activityUnit,
      unitTo: unitM,
    }).then(({ data }) => {
      if (data.code === 200) {
        form.setFieldState('unitConver', {
          value: data?.data,
        });
      }
    });
  };

  // ghg 和 iso 的 联动
  useEffect(() => {
    const ghg = form.getValuesIn('ghg');
    const iso = form.getValuesIn('iso');
    const { type, value } = ghgOrIsoValue;
    if (type === 'ghg') {
      const [ghgCategory, ghgClassify] = value || [];
      if (!ghgCategory || !ghgClassify) return;
      getComputationEnumsRelGhg2iso({
        ghgCategory,
        ghgClassify,
      } as getComputationEnumsRelGhg2isoProps).then(({ data }) => {
        if (data.code === 200) {
          const { categoryCode, classifyCode } = data?.data || {};
          const [code1 = '', code2 = ''] = iso || [];
          if (code1 === categoryCode && code2 === classifyCode) {
            return;
          }
          form.setValues({ iso: [categoryCode, classifyCode] });
        }
      });
    }
    if (type === 'iso') {
      const [isoCategory, isoClassify] = value || [];
      if (!isoCategory || !isoClassify) return;
      getComputationEnumsRelIso2ghg({
        isoCategory,
        isoClassify,
      } as getComputationEnumsRelIso2ghgProps).then(({ data }) => {
        if (data.code === 200) {
          const { categoryCode, classifyCode } = data?.data || {};
          const [code1 = '', code2 = ''] = ghg;
          if (code1 === categoryCode && code2 === classifyCode) {
            return;
          }
          form.setValues({ ghg: [categoryCode, classifyCode] });
        }
      });
    }
  }, [ghgOrIsoValue]);

  /** 监听表单变化 */
  const onAddFormListenFn = () => {
    form.addEffects('*', () => {
      onFieldValueChange('ghg', field => {
        setGhgOrIsoValue({ type: 'ghg', value: field.value });
      });
      onFieldValueChange('iso', field => {
        setGhgOrIsoValue({ type: 'iso', value: field.value });
      });
      // 排放因子-分母单位统一
      onFieldValueChange('gasList.*.factorUnitM', field => {
        form.setFieldState('gasList.*.factorUnitM', {
          value: field.value,
        });
      });

      // 活动数据单位/分母单位切换时，自动计算单位换算比例
      // 排放因子-分母单位
      onFieldValueChange('gasList[0].factorUnitM', () => {
        unitCovertFn();
      });
      // 活动数据单位
      onFieldValueChange('activityUnit', () => {
        unitCovertFn();
      });
      // 切换氢氟碳化物（HFCs）带出对应的GWP值
      onFieldValueChange('gasList[3].gas', field => {
        const { value } = field;
        form.setFieldState('gasList[3].gwp', {
          value,
        });
      });
      // 切换全氟化碳（PFCs）带出对应的GWP值
      onFieldValueChange('gasList[4].gas', field => {
        const { value } = field;
        form.setFieldState('gasList[4].gwp', {
          value,
        });
      });

      // 切换排放因子选择时，清空数据
      onFieldValueChange('factorWay', field => {
        setFactorSelectWay(field.value);
        form.setValues({
          gasList: cloneDeep(gasTableData),
        });
        setFactorSourceId(0);
        form.reset(
          '*(supplierData,unitConver,factorType,factorScore,factorSource,year)',
        );
      });
    });
  };

  // 排放因子表格数据处理
  type GasTableDataProp = (FactorGasRes | EmissionSourceGas)[];
  const setGasList = (gasList?: GasTableDataProp) => {
    return gasList?.map(g => {
      return {
        ...g,
        factorUnitM: g.factorUnitM?.split(','),
      };
    });
  };

  // 选择因子或选择排放源后返回的数据
  const factorIdDetailFn = async () => {
    const { factorWay, supplierData } = formValuesBack;

    // 排放因子 => 选择排放因子
    if (factorWay === FACTOR_SELECT_WAY.FACTOR && factorSourceId) {
      await getSystemFactorId({
        id: factorSourceId,
      }).then(({ data }) => {
        const result = data?.data;
        form.setValues({
          ...result,
          ...formValuesBack,
          factorSource: result?.institution,
          gasList: setGasList(result?.gasList),
        });
      });
    }

    // 供应商数据-选择供应商数据;
    if (factorWay === FACTOR_SELECT_WAY.SUPPLIER && factorSourceId) {
      const { factorUnitM, supplierName, year } = supplierData;

      // 排放因子类别默认为 制造厂提供系数
      const factorTypeItem = factorTypeArr.find(
        v => v.label === '制造厂提供系数',
      );

      formValuesBack.supplierData = {
        ...supplierData,
        factorUnitM: factorUnitM?.split(','),
      };

      form.setValues({
        ...formValuesBack,
        factorType: factorTypeItem?.value,
        factorSource: supplierName,
        year,
      });
    }
    // 单位换算
    unitCovertFn();

    // 选择页面点击取消按钮回来表单直接赋值
    if (!factorSourceId) {
      form.setValues({
        ...formValuesBack,
      });
    }

    // 监听表单
    onAddFormListenFn();
  };

  // 获取排放源详情
  const getEmissionSourceDetailFn = async () => {
    const {
      activityUnit,
      gasList,
      factorId,
      ghgCategory,
      ghgClassify,
      isoCategory,
      isoClassify,
      supportFile,
      sourceCode,
    } = emissionSourceDetailData || {};
    /**
     * 排放因子选择类型
     * 因子ID = -1: 供应商数据;
     * 因子ID = 无值：新建因子;
     * 因子ID = 有值不为-1: 选择因子
     */
    const factorWay =
      factorId === -1
        ? FACTOR_SELECT_WAY.SUPPLIER
        : factorId
        ? FACTOR_SELECT_WAY.FACTOR
        : FACTOR_SELECT_WAY.FACTOR_CREATE;
    // 排放因子数据
    const newArr = setGasList(gasList);

    const fileListBack = JSON.parse(supportFile || '[]');

    // 支撑材料反显处理
    setFileList(fileListBack);
    setFileListDetail(fileListBack);

    form.setValues({
      ...emissionSourceDetailData,
      sourceCode: autoCreateSourceCode ? randomString() : sourceCode,
      activityUnit: activityUnit?.split(','),
      ghg: [ghgCategory, ghgClassify],
      iso: [isoCategory, isoClassify],
      factorWay,
      gasList: newArr,
      supplierData: newArr?.[0],
    });

    setFactorSourceId(factorId || 0);

    // 监听表单变化
    onAddFormListenFn();
  };

  useEffect(() => {
    if (isEmpty(enums)) {
      return;
    }
    // gwp数据不可以为空
    if (isEmpty(gwpObj)) {
      return;
    }

    // 路由中含有选择排放因子/选择供应商的数据时，调用选择数据的方法
    if (!isEmpty(formValuesBack)) {
      factorIdDetailFn();
      return;
    }

    // 排放源详情处理
    if (emissionSourceId && !isEmpty(emissionSourceDetailData)) {
      form.setFieldState('sourceCode', {
        disabled: true,
        required: false,
      });

      getEmissionSourceDetailFn();
      return;
    }

    if (emissionSourceId) {
      return;
    }
    form.setValues({
      gasList: gasTableData,
    });

    // 监听表格变化
    onAddFormListenFn();
  }, [emissionSourceId, emissionSourceDetailData, gwpObj, enums]);

  /** 文件上传 */
  const changeFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const newArr: FileListType[] = [];
    info.fileList.forEach(item => {
      if (item.status === 'done' && item.originFileObj) {
        if (item.response?.code === 200) {
          const nameArr = item.name.split('.');
          newArr.push({
            suffix: nameArr[nameArr.length - 1],
            name: item.name,
            url: item.response.data.url,
            uid: item.uid,
          });
        }
      }
    });
    const allList = [
      ...uniqBy([...newArr, ...fileListDetail, ...delFileList], 'uid'),
    ];

    setFileList([
      ...differenceWith(allList, delFileList, isEqual),
    ] as FileListType[]);
  };

  /** 文件删除 */
  const onRemoveList = (item: FileListType) => {
    const arr = fileList.filter(v => v.uid !== item.uid);
    setDelFileList([...delFileList, item]);
    setFileList([...arr]);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToElement = () => {
    const element = scrollRef.current;
    if (element && !isEmpty(formValuesBack)) {
      element?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
  useEffect(() => {
    scrollToElement();
  }, [scrollRef.current]);

  /** 设置表单字段的状态 path: 路径， title，以及placehoder */
  const setFormFieldState = (path: string, title: string) => {
    form.setFieldState(FormPath.parse(path), async state => {
      state.title = title;
      state.componentProps = {
        placeholder: title,
        allowClear: state.componentType === 'Select',
      };
    });
  };

  // 设置表单枚举值
  useEffect(() => {
    // GHG类别
    form.setFieldState('ghg', {
      dataSource: GHGCategoryArr,
    });

    // ISO类别
    form.setFieldState('iso', {
      dataSource: ISOCategoryArr,
    });

    // 活动数据类别
    form.setFieldState('activityCategory', {
      dataSource: ActivityCategoryArr,
    });

    // 排放因子类别
    form.setFieldState('factorType', {
      dataSource: factorTypeArr,
    });

    // 发布年份
    form.setFieldState('year', {
      dataSource: publishYear().map(v => ({ label: v, value: v })),
    });

    // 活动数据单位、排放数据-分母单位（排放因子、供应商数据）
    form.setFieldState(
      '*(activityUnit,gasList.*.factorUnitM,supplierData.factorUnitM)',
      {
        dataSource: changeFactorM2cascaderOptions(enums?.factorUnitM || []),
      },
    );

    form.setFieldState(`*(supplierData.factorUnitZ)`, {
      dataSource: changeEnum2Options(enums?.cequivalentUnitZ),
    });

    if (enums && factorSelectWay) {
      // 排放数据-因子表格中。气体、分子单位枚举
      setGasSelectOptions(form, enums);
    }
  }, [
    enums,
    factorSelectWay,
    GHGCategoryArr,
    ISOCategoryArr,
    ActivityCategoryArr,
    factorTypeArr,
  ]);

  return (
    <main className={style.wrapper}>
      <Form form={form} previewTextPlaceholder='-'>
        <section className={style.card}>
          <h3>基本信息</h3>
          <SchemaField schema={baseSchema()} />
        </section>
        <section className={style.card}>
          <h3>活动数据</h3>
          <SchemaField schema={activityFormSchema()} />
        </section>
        <section className={style.card} ref={scrollRef}>
          <div className={style.btnContainer}>
            <h3>排放数据</h3>
            <FormConsumer>
              {factorFrom => {
                /** 阅读态不展示选择按钮 */
                if (readPretty) return '';

                /** 禁用字段包括排放方式选择 不展示选择按钮 */
                if (disabledFieldPath.includes('factorWay')) return '';

                // 获取当前排放因子类型 1: 排放因子 2: 新建因子，3: 供应商数据
                const factorType = factorFrom.getValuesIn('factorWay');

                /** 获取排放源名称 */
                const likeName = factorFrom.getValuesIn('sourceName');

                // 路由携带的参数
                const urlParamsData = {
                  [CHOOSE_FACTOR.FORM_VALUES]: factorFrom.values,
                  likeName,
                };

                // 设置排放类型不同选择下，表单字段的title以及placeholder
                emissionDataFieldState.forEach((val, key) => {
                  setFormFieldState(
                    `${key}`,
                    factorType === FACTOR_SELECT_WAY.SUPPLIER
                      ? val.supplier
                      : val.factor,
                  );
                });

                switch (factorType) {
                  /** 排放因子 */
                  case FACTOR_SELECT_WAY.FACTOR:
                    return (
                      <Button
                        type='primary'
                        className={style.columnCount}
                        onClick={async () => {
                          onSelectFn?.({
                            urlParamsData,
                            factorType,
                          });
                        }}
                      >
                        选择排放因子
                      </Button>
                    );
                  /** 新建因子 */
                  case FACTOR_SELECT_WAY.FACTOR_CREATE:
                    return '';
                  /** 供应商数据 */
                  case FACTOR_SELECT_WAY.SUPPLIER:
                    return (
                      <Button
                        type='primary'
                        className={style.columnCount}
                        onClick={async () => {
                          onSelectFn?.({
                            urlParamsData,
                            factorType,
                          });
                        }}
                      >
                        选择供应商数据
                      </Button>
                    );
                  default:
                    return '';
                }
              }}
            </FormConsumer>
          </div>
          <SchemaField
            schema={factorSchema(
              readPretty ||
                disabledFieldPath.includes(
                  'gasList,supplierData,factorSource,year',
                ),
              gwpObj,
            )}
          />
          <SchemaField schema={factorBaseSchema()} />
        </section>
        {/* 设置支撑材料才会展示 */}
        {isSetSupportFiles && (
          <section className={style.card}>
            <h3>支撑材料</h3>
            {!readPretty && (
              <p className={style.tips}>
                支持PDF、JPG、JPEG、PNG、Word、Excel、zip、rar格式文件上传，最多10个文件，每个不超过10M
              </p>
            )}
            <Report
              fileList={fileList}
              fileType='.png,.jpg,.jpeg,.xls,.xlsx,.doc,.docx,.pdf,.rar,.zip'
              maxCount={10}
              maxSize={10 * 1024 * 1024}
              errorTip='文件大小不能超过10M'
              disabled={readPretty}
              changeFileChange={changeFileChange}
              removeList={onRemoveList}
            />
          </section>
        )}
      </Form>
      <FormActions
        place='center'
        buttons={compact([
          !readPretty && {
            title: '确定',
            type: 'primary',
            onClick: async () => {
              return form.submit(
                async (
                  values: EmissionSource & {
                    factorWay: string;
                    supplierData?: EmissionSourceGas;
                    ghg: string[];
                    iso: string[];
                  },
                ) => {
                  const {
                    ghg,
                    iso,
                    activityUnit,
                    factorWay,
                    gasList = [],
                    supplierData,
                  } = values || {};

                  let flag = false;

                  // 新建因子至少有一行全部信息要填写完全
                  if (factorWay === FACTOR_SELECT_WAY.FACTOR_CREATE) {
                    flag = gasList?.some(
                      item =>
                        item.gas &&
                        item?.factorValue &&
                        item?.factorUnitZ &&
                        item?.factorUnitZ,
                    );
                    if (!flag) {
                      Toast('error', '请填写排放因子数据');
                      return;
                    }
                  }

                  if (
                    factorWay !== FACTOR_SELECT_WAY.FACTOR_CREATE &&
                    !factorSourceId
                  ) {
                    Toast(
                      'error',
                      `请选择${FACTOR_SELECT_WAY_TEXT[factorWay]}`,
                    );
                    return;
                  }
                  /**
                   * 供应商因子ID说明
                   * 选择因子：选择的因子id
                   * 新建因子：无因子id
                   * 供应商数据：-1
                   */
                  let factorIdBack;
                  /**
                   * 因子表格数据说明: 接口参数传值 统一用gasList，反显的数据结构如下
                   * 选择因子/自建因子：gasList;
                   * 供应商数据：supplierData
                   */
                  let gasListBack;

                  switch (factorWay) {
                    // 选择因子
                    case FACTOR_SELECT_WAY.FACTOR:
                      factorIdBack = factorSourceId;
                      gasListBack = gasList;
                      break;
                    // 新建因子
                    case FACTOR_SELECT_WAY.FACTOR_CREATE:
                      factorIdBack = undefined;
                      gasListBack = gasList;
                      break;
                    // 供应商数据
                    case FACTOR_SELECT_WAY.SUPPLIER:
                      factorIdBack = -1;
                      gasListBack = [supplierData];
                      break;
                    default:
                      break;
                  }
                  const [ghgCategory, ghgClassify] = ghg;
                  const [isoCategory, isoClassify] = iso;
                  const result = omit(
                    {
                      ...values,
                      activityUnit: activityUnit?.toString(),
                      gasList: gasListBack?.map(item => ({
                        ...item,
                        factorUnitM: String(item?.factorUnitM),
                      })),
                      factorId: factorIdBack,
                      ghgCategory,
                      ghgClassify,
                      isoCategory,
                      isoClassify,
                      supportFile: JSON.stringify(fileList),
                    },
                    ['ghg', 'iso'],
                  );
                  onConfirmFn?.(result as unknown as EmissionSourceReq);
                },
              );
            },
          },
          {
            title: readPretty ? '返回' : '取消',
            onClick: async () => {
              onCancelFn();
            },
          },
        ])}
      />
    </main>
  );
};
export default EmissionSourceComponent;
