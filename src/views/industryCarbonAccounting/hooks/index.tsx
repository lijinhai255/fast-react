/**
 * @description
 */

import { useEffect, useState } from 'react';

import {
  EnumResp,
  SysBusinessColumnName,
  SysBusinessTenet,
  getEnterprisesystemEnumsEnumName,
  getEnterprisesystemSysBusinessColumnNameQueryByBusinessMaterialId,
  getEnterprisesystemSysBusinessTenetQueryById,
} from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { EmissionColumnNameDataType } from '../utils/type';

/** 行业版企业碳核算枚举值 */
export const useIndustryCarbonAllEnum = (enumName?: string) => {
  const [enumOptions, setEnumOptions] = useState<EnumResp[]>();
  useEffect(() => {
    if (enumName)
      getEnterprisesystemEnumsEnumName({ enumName }).then(({ data }) => {
        const arr = data?.data?.map(item => ({
          label: item.name,
          value: item.code,
          ...item,
        }));
        setEnumOptions(arr);
      });
  }, [enumName]);
  return enumOptions;
};

/** 获取排放数据的表头或者详情展示的表单字段 */
export const useEmissionFieldData = (
  businessMaterialId?: number,
  isShow?: number,
) => {
  const [emissionColumnNameData, setEmissionColumnNameData] =
    useState<SysBusinessColumnName[]>();
  const [emissionColumnNameDataObj, setEmissionColumnNameDataObj] =
    useState<EmissionColumnNameDataType>();

  useEffect(() => {
    if (businessMaterialId) {
      getEnterprisesystemSysBusinessColumnNameQueryByBusinessMaterialId({
        businessMaterialId,
        isShow,
      }).then(({ data }) => {
        const result = data?.data;
        const obj = result?.reduce((pre, cur) => {
          return {
            ...pre,
            [cur.id || 0]: {
              ...cur,
            },
          };
        }, {});
        setEmissionColumnNameDataObj(obj as EmissionColumnNameDataType);
        setEmissionColumnNameData(result);
      });
    }
  }, [businessMaterialId, isShow]);
  return { emissionColumnNameData, emissionColumnNameDataObj };
};

/** 核算周期详情数据 */
export const useAccountingCycleInfo = (id?: number) => {
  const [info, setInfo] = useState<SysBusinessTenet>();
  useEffect(() => {
    if (id) {
      getEnterprisesystemSysBusinessTenetQueryById({ id }).then(({ data }) => {
        setInfo(data?.data);
      });
    }
  }, [id]);
  return info;
};
