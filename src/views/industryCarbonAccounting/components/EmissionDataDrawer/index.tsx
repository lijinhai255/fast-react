/**
 * @description 排放数据详情抽屉
 */
import {
  Form,
  FormGrid,
  FormItem,
  FormLayout,
  Input,
  Radio,
  Select,
} from '@formily/antd';
import { Field, createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Button, Col, Drawer, Row } from 'antd';
import { isArray, mapValues, omit } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import { FormilyFileUpload } from '@/components/FormilyFileUpload';
import { IconFont } from '@/components/IconFont';
import { renderFormItemSchema } from '@/components/formily/utils';
import { getSystemDictenumListAllByDictTypeBatch } from '@/sdks/systemV2ApiDocs';
import {
  MainEntityRes,
  MainRes,
  SysBusinessColumnName,
  SysBusinessParamReq,
  SysSupportFile,
  getEnterprisesystemDefaultValueQueryValue,
  getEnterprisesystemSysCellQueryByBossCellId,
  getEnterprisesystemSysFillParamId,
  getEnterprisesystemSysSupportFileQueryBatchByColumnId,
  postEnterprisesystemSysFillParamAdd,
  postEnterprisesystemSysFillParamEdit,
  postEnterprisesystemSysSupportFileBatchAddFillFile,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';
import { Dicts } from '@/views/dashborad/Dicts/hooks';

import {
  DATA_FORMAT_TYPE,
  DATA_SETTING_TYPE,
  FILED_TYPE,
  PARAMETER_TYPE,
} from './constant';
import style from './index.module.less';
import {
  infoSchema,
  onGetEntityParamFileTypeSchema,
  onGetEntityParamNumberTypeSchema,
  onGetEntityParamTextTypeSchema,
  onGetMainParamSchema,
  onGetNoParamSchema,
} from './schemas';
import { useEmissionFieldData } from '../../hooks';
import {
  ClassifyProps,
  EmissionColumnNameDataType,
  EmissionDetailInfoType,
  FileDetailDataType,
  FileListType,
} from '../../utils/type';
import FormilySearchInsertSelect from '../FormilySearchInsertSelect';

const { OTHER } = FILED_TYPE;
const { MAIN_PARAMETER, ENTITY_PARAMETER } = PARAMETER_TYPE;
const { NUMERICAL_VALUE, TEXT, FILE } = DATA_FORMAT_TYPE;
const { FIXED_VALUE, ENUM_VALUE } = DATA_SETTING_TYPE;

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    FormilySearchInsertSelect,
    FormilyFileUpload,
    Radio,
    Form,
    FormItem,
    FormGrid,
    FormLayout,
  },
});

export const EmissionDataDrawer = ({
  open,
  isViewMode,
  tenetId,
  emissionDataId,
  selectedClassifyItem,
  onOk,
  onClose,
}: {
  /** 抽屉的显隐 */
  open: boolean;
  /** 查看模式 */
  isViewMode: boolean;
  /** 核算周期ID */
  tenetId?: number;
  /** 排放数据的id */
  emissionDataId?: number;
  /** 选中的分类项数据 */
  selectedClassifyItem?: ClassifyProps;
  /** 保存方法 */
  onOk: () => void;
  /** 取消方法 */
  onClose: () => void;
}) => {
  const {
    /** 一级分类id */
    classifyId,
    /** 分类类型 */
    classifyType,
    /** 当前选中的分类id */
    key,
    /** 排放源关联的生产单元id */
    cellId,
    /** 碳排放核算id */
    sysBusinessId,
    /** 组织id */
    orgId,
    /** 数据收集周期 */
    collectTime,
    /** 后台选中的核算模型id */
    bossModelId,
    /** 核算年度 */
    accountYear,
    /** 后台排放源id */
    bossMaterialId,
  } = selectedClassifyItem || {};

  /** 抽屉的标题 */
  const title = isViewMode
    ? '排放数据详情'
    : emissionDataId
    ? '编辑排放数据'
    : '新增排放数据';

  /** 是否为文件类型 */
  const isFileType = (paramType: number, dataType: number) =>
    paramType === ENTITY_PARAMETER && dataType === FILE;

  /** 获取非排放源类型的表单数据 */
  const emissionSchemasFieldData = useEmissionFieldData(
    key,
  )?.emissionColumnNameData?.filter(item => item.isEmission);

  /** 获取文件类型的数据 */
  const fileTypeFieldData = emissionSchemasFieldData?.filter(item =>
    isFileType(item.paramType || 0, item.dataType || 0),
  );

  /** 表单详情数据 */
  const [detailInfo, setDetailInfo] = useState<EmissionDetailInfoType>();

  /** 文件类型的详情数据 */
  const [fileDetailData, setFileDetailData] = useState<FileDetailDataType>({});

  /** 保存按钮的loading */
  const [btnLoading, setBtnLoading] = useState(false);

  const form = useMemo(
    () =>
      createForm({
        readPretty: isViewMode,
      }),
    [isViewMode, key, emissionDataId],
  );

  /** 生产单元枚举 */
  const useProductCellDataSource = (id?: number) => async (field: Field) => {
    if (id && orgId) {
      getEnterprisesystemSysCellQueryByBossCellId({ id, orgId }).then(
        ({ data }) => {
          const arr = data?.data?.map(item => ({
            label: item.name,
            value: String(item.id),
            ...item,
          }));
          field.setDataSource(arr);
        },
      );
    }
  };

  /** 枚举值类型的枚举值 */
  const useDictEnumOption = (dictTypes?: string) => async (field: Field) => {
    if (dictTypes) {
      const { data }: { code?: number; data?: any; msg?: string } =
        await getSystemDictenumListAllByDictTypeBatch({
          dictTypes,
        });
      const result: Dicts[] = data?.data?.[dictTypes];
      const enums = result?.map(item => ({
        ...item,
        label: item.dictLabel,
        value: item.dictValue,
      }));
      field.setDataSource(enums);
    }
  };

  /** 监听表单变化 */
  const addEnumFormListener = (
    enumValueMap: EmissionColumnNameDataType,
    paramIdMapId: { [key: number]: number },
    list: MainRes[],
  ) => {
    // 枚举值类型的参数
    const emumValueKeysArr = Object.keys(enumValueMap) || [];
    // 关联主体参数的实体参数赋值对象
    let mainParamsValueObj: { [key: string]: MainEntityRes[] | undefined } = {};
    if (emumValueKeysArr.length > 0) {
      emumValueKeysArr.forEach(emumValueKey => {
        list?.forEach(mainItem => {
          const enumMapParamId =
            enumValueMap[emumValueKey as unknown as keyof typeof enumValueMap]
              ?.paramId;
          if (mainItem?.paramId === enumMapParamId) {
            mainParamsValueObj = {
              ...mainParamsValueObj,
              [emumValueKey]: mainItem?.entityList,
            };
          }
        });
      });
    }
    const mainParamsValueKeysArr = Object.keys(mainParamsValueObj) || [];

    /** 切换缺省值时，移除表单的副作用 */
    form.removeEffects('*');
    /** 添加表单的副作用 */
    form.addEffects('*', () => {
      /** 枚举值类型的主体参数切换 */
      mainParamsValueKeysArr?.forEach(itemId => {
        onFieldValueChange(`${itemId}`, field => {
          let entityValueObj = {};
          if (field.value) {
            /** 枚举值的枚举标识数组 */
            const dictValueArr = mainParamsValueObj?.[itemId]?.map(
              v => v.dictValue,
            );
            mainParamsValueObj?.[itemId]?.forEach(dict => {
              if (dict?.dictValue === field.value) {
                dict?.entityList?.forEach(entity => {
                  const { paramId = 0, value } = entity || {};
                  const entityId = paramIdMapId[paramId] || 0;
                  entityValueObj = {
                    ...entityValueObj,
                    [entityId]: value,
                  };
                });
              } else if (!dictValueArr?.includes(field.value)) {
                dict?.entityList?.forEach(entity => {
                  const { paramId = 0 } = entity || {};
                  const entityId = paramIdMapId[paramId] || 0;
                  entityValueObj = {
                    ...entityValueObj,
                    [entityId]: undefined,
                  };
                });
              }
            });
            form.setValues({ ...entityValueObj });
          }
        });
      });
    });
  };

  /** 根据核算年度和核算模型id获取对应的缺省值 */
  useEffect(() => {
    if (
      accountYear &&
      bossModelId &&
      !emissionDataId &&
      emissionSchemasFieldData &&
      emissionSchemasFieldData.length
    ) {
      getEnterprisesystemDefaultValueQueryValue({
        accountYear: accountYear?.split('年')[0],
        bossModelId,
      }).then(({ data }) => {
        /** 参数列表 */
        const paramList = emissionSchemasFieldData?.filter(v => v.paramId);
        /** 缺省值数据 */
        const { entityList = [], mainList = [] } = data?.data || {};
        /** 主体参数缺省值数据 */
        const mainDictList = mainList?.map(v => v.entityList)?.flat();

        let allParamsValueObj = {};

        // paramId 映射 表单Id
        const paramIdMapId: { [key: number]: number } = {};
        // 枚举值
        const enumValueMap: EmissionColumnNameDataType = {};

        paramList?.forEach(param => {
          const {
            id = 0,
            paramId = 0,
            relevanceId = 0,
            dataSetting = 0,
          } = param || {};
          /** 筛选出关联的主体参数 */
          const paramItem = paramList?.find(v => v.paramId === relevanceId);

          paramIdMapId[paramId] = id;

          if (dataSetting === ENUM_VALUE) enumValueMap[id] = param;

          /** 不关联主体的实体参数的缺省值 */
          entityList?.forEach(entity => {
            if (param.paramId === entity?.paramId) {
              allParamsValueObj = {
                ...allParamsValueObj,
                [id]: entity?.value,
              };
            }
          });

          /** 关联主体的实体参数且主体参数为固定值的缺省值 */
          mainDictList?.forEach(main => {
            if (
              relevanceId === main?.paramId &&
              paramItem?.dataSetting === FIXED_VALUE
            ) {
              main?.entityList?.forEach(entity => {
                if (paramId === entity?.paramId) {
                  allParamsValueObj = {
                    ...allParamsValueObj,
                    [id]: entity?.value,
                  };
                }
              });
            }
          });
        });

        /** 关联主体的实体参数且主体参数为枚举值的缺省值 */
        addEnumFormListener(enumValueMap, paramIdMapId, mainList);

        form.setValues({
          ...allParamsValueObj,
        });
      });
    }
  }, [accountYear, bossModelId, emissionDataId, emissionSchemasFieldData]);

  /** 获取填报数据详情 */
  useEffect(() => {
    if (
      emissionDataId &&
      emissionSchemasFieldData &&
      emissionSchemasFieldData.length
    ) {
      getEnterprisesystemSysFillParamId({ id: emissionDataId }).then(
        ({ data }) => {
          const { fillParamList = [] } = data?.data || {};
          const obj: EmissionDetailInfoType = fillParamList?.reduce(
            (pre, cur) => {
              const { sysBusinessColumnId = 0, fieldValue } = cur;

              return {
                ...pre,
                [sysBusinessColumnId]: {
                  id: cur.id,
                  value: fileDetailData[sysBusinessColumnId] || fieldValue,
                },
              };
            },
            {},
          ) as EmissionDetailInfoType;

          form.setValues({
            ...mapValues(obj, o => o.value),
          });

          setDetailInfo(obj);
        },
      );
    }
  }, [emissionDataId, fileDetailData]);

  /** 获取文件类型的表单数据 */
  useEffect(() => {
    if (fileTypeFieldData && fileTypeFieldData.length && emissionDataId) {
      /** 文件类型的列名id */
      const columnId = fileTypeFieldData.map(i => i.id).join(',');

      getEnterprisesystemSysSupportFileQueryBatchByColumnId({ columnId }).then(
        ({ data }) => {
          const result = data?.data;

          const fileDataObj = result?.reduce((pre, cur) => {
            return {
              ...pre,
              [cur.colunmId || 0]: cur?.fileList?.map(file => ({
                ...file,
                name: file.fileName,
                url: file.fileUrl,
                uid: file.fileId,
              })),
            };
          }, {});
          setFileDetailData(fileDataObj as FileDetailDataType);
        },
      );
    }
  }, [emissionDataId]);

  /** 获取各种类型下的schemas格式 */
  const getSchemasItem = ({
    item,
    onSearch,
    onBlur,
    onInputKeyDown,
  }: {
    item: SysBusinessColumnName;
    onSearch: (value: string) => void;
    onBlur: () => void;
    onInputKeyDown: () => void;
  }) => {
    const { paramType, dataType, filedType = 0 } = item || {};
    /** 生产单元或者物料类型 */
    if (filedType !== OTHER) {
      return onGetNoParamSchema(filedType, cellId);
    }
    /** 主体参数 */
    if (paramType === MAIN_PARAMETER) {
      return onGetMainParamSchema(item, onSearch, onBlur, onInputKeyDown);
    }
    /** 实体参数-数值类型 */
    if (paramType === ENTITY_PARAMETER && dataType === NUMERICAL_VALUE) {
      return onGetEntityParamNumberTypeSchema(item);
    }
    /** 实体参数-文本类型 */
    if (paramType === ENTITY_PARAMETER && dataType === TEXT) {
      return onGetEntityParamTextTypeSchema(
        item,
        onSearch,
        onBlur,
        onInputKeyDown,
      );
    }
    /** 实体参数-文件类型 */
    return onGetEntityParamFileTypeSchema(item);
  };

  /** 点击保存按钮 */
  const onConfirm = async () => {
    form.submit(
      async (values: { [key: number]: string | number | FileListType[] }) => {
        setBtnLoading(true);
        /** 文件列表 */
        let fileList: FileListType[] = [];
        const arr = emissionSchemasFieldData?.map(item => {
          const {
            id = 0,
            name,
            paramType = 0,
            dataType = 0,
            dataSetting,
            filedType,
            isShow,
            paramNo,
            required,
          } = item || {};
          /** 文件类型的值 */
          if (isFileType(paramType, dataType) && isArray(values[id])) {
            const newArr = values[id].map(v => ({
              ...v,
              collectTime,
              colunmId: id,
              orgId,
              fileName: v.name,
              fileUrl: v.url,
              fileId: v.uid,
            }));

            fileList = [...fileList, ...newArr];
          }
          return {
            id: detailInfo?.[id]?.id,
            dataSetting,
            fieldName: name,
            fieldValue:
              isFileType(paramType, dataType) && isArray(values[id])
                ? values[id]?.map(v => v.name)?.join(',')
                : values[id],
            filedType,
            isShow,
            paramNo,
            required,
            sysBusinessClassifyId: classifyId,
            sysBusinessColumnId: id,
            sysBusinessId,
            sysBusinessMaterialId: key,
          };
        });
        const result = {
          classifyType,
          collectTime,
          orgId,
          tenetId,
          bossMaterialId,
          fillParamList: arr,
        };
        /** 文件的保存处理 */
        const newFileList = fileList.map(v => {
          return omit(
            {
              ...v,
            },
            ['name', 'url', 'uid'],
          );
        });

        if (newFileList.length > 0) {
          await postEnterprisesystemSysSupportFileBatchAddFillFile({
            req: newFileList as SysSupportFile[],
          });
        }
        if (emissionDataId) {
          return postEnterprisesystemSysFillParamEdit({
            req: result as unknown as SysBusinessParamReq,
          })
            .then(() => {
              setBtnLoading(false);
              form.reset();
              onOk();
            })
            .finally(() => {
              setBtnLoading(false);
            });
        }
        return postEnterprisesystemSysFillParamAdd({
          req: result as unknown as SysBusinessParamReq,
        })
          .then(() => {
            setBtnLoading(false);
            form.reset();
            onOk();
          })
          .finally(() => {
            setBtnLoading(false);
          });
      },
    );
  };

  /** 枚举值可以自定义的select 将自定义输入的值赋值给select */
  const onSearchInsetSelect = async (value: string, id: number) => {
    form.setValues({
      [id]: value,
    });
  };

  /** 可以自定义的选择框失去焦点 清除必填的校验 */
  const onSelectBlur = (id: number) => {
    form.clearErrors(`${id}`);
  };

  return (
    <Drawer
      className={`${style.wrapper}`}
      title={title}
      open={open}
      closeIcon={false}
      maskClosable={false}
      destroyOnClose
      placement='right'
      size='large'
      extra={
        <div className={style.closeIcon} onClick={onClose}>
          <IconFont icon='icon-icon-guanbi' />
        </div>
      }
      onClose={() => {
        form.reset();
        onClose();
      }}
      footer={[
        <Button
          onClick={() => {
            form.reset();
            onClose();
          }}
        >
          {isViewMode ? '返回' : '取消'}
        </Button>,
        !isViewMode && (
          <Button
            type='primary'
            loading={btnLoading}
            onClick={async () => onConfirm()}
          >
            保存
          </Button>
        ),
      ]}
    >
      <Form form={form} previewTextPlaceholder='-'>
        <Row gutter={16}>
          {emissionSchemasFieldData?.map(item => {
            const {
              id = 0,
              paramType = 0,
              dataType = 0,
              unitName,
              name,
            } = item || {};
            return (
              <Col key={id} span={isFileType(paramType, dataType) ? 24 : 12}>
                <SchemaField
                  schema={infoSchema({
                    schemaData: {
                      [id]: renderFormItemSchema({
                        title: unitName ? `${name}${unitName}` : name,
                        ...getSchemasItem({
                          item,
                          onSearch: value => {
                            onSearchInsetSelect(value, id);
                          },
                          onBlur: () => {
                            onSelectBlur(id);
                          },
                          onInputKeyDown: () => {
                            onSelectBlur(id);
                          },
                        }),
                      }),
                    },
                  })}
                  scope={{ useProductCellDataSource, useDictEnumOption }}
                />
              </Col>
            );
          })}
        </Row>
      </Form>
    </Drawer>
  );
};
