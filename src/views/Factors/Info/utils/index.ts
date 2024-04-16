import { Form } from '@formily/core';
import { compact } from 'lodash-es';

import {
  changeEnum2Options,
  changeEnum2OptionsLabel,
  Dicts,
} from '@/views/dashborad/Dicts/hooks';

import { HasSubCategoryGas } from './schemas';
import { FactorUnitMTransformMap } from '../type';

/** 气体对应的字典枚举 */
export const gasEnumsMap = {
  'CO₂': 'factorUnitZ',
  'CH₄': 'methaneUnitZ',
  'N₂O': 'nitrousUnitZ',
  HFCs: 'hydrofluorocarbonUnitZ',
  PFCs: 'perfluorocarbonUnitZ',
  'SF₆': 'sulfurUnitZ',
  'NF₃': 'nitrogenUnitZ',
  'CO₂e': 'cequivalentUnitZ',
};

export const gasNamesMap = {
  'CO₂': '二氧化碳',
  'CH₄': '甲烷',
  'N₂O': '氧化亚氮',
  HFCs: '氢氟碳化物',
  PFCs: '全氟化碳',
  'SF₆': '六氟化硫',
  'NF₃': '三氟化氮',
  'CO₂e': '二氧化碳当量',
};

const gasList = Object.keys(gasNamesMap).map(
  gas => `${gasNamesMap[gas as keyof typeof gasNamesMap]}（${gas}）`,
);

export const gasTableData = gasList.map(g => ({
  gasType: g,
  gas: Object.keys(HasSubCategoryGas).some(gas => g.includes(gas))
    ? undefined
    : g,
}));

/** 设置因子单位选项 */
export const setGasSelectOptions = (
  form: Form,
  enums: Record<string, Dicts[]>,
) => {
  const gas = Object.keys(gasEnumsMap);
  const { length } = gas;
  const getFactorUnitZPath = (n: number) => `gasList.${n}.factorUnitZ`;
  for (let i = 0; i < length; i++) {
    const gasName = gas[i];

    /** 氢氟碳化物（HFCs） 选项 */
    if (gasName === 'HFCs') {
      form.setFieldState(`gasList.${i}.gas`, {
        dataSource: changeEnum2OptionsLabel(enums.HFCsEnum),
      });
    }

    /** 全氟化碳（PFCs) */
    if (gasName === 'PFCs') {
      form.setFieldState(`gasList.${i}.gas`, {
        dataSource: changeEnum2OptionsLabel(enums.PFCseNUM),
      });
    }

    /** 排放因子-分子单位 */
    form.setFieldState(getFactorUnitZPath(i), {
      dataSource: changeEnum2Options(
        enums[gasEnumsMap[gasName as keyof typeof gasEnumsMap]],
      ),
    });
  }
};

/** 分母单位转换成联级数据结构 */
export const changeFactorM2cascaderOptions = (factorUnitM: Dicts[]) => {
  const factorMap: FactorUnitMTransformMap = {};
  factorUnitM.forEach(val => {
    if (val.sourceType && factorMap[val.sourceType]) {
      // @ts-ignore
      factorMap[val.sourceType].children = factorMap[
        val.sourceType
      ].children?.concat?.([
        { label: val.dictLabel, value: val.dictValue, children: [] },
      ]);
    } else if (val.sourceType) {
      factorMap[val.sourceType] = {
        label: val.sourceName || val.sourceType,
        value: val.sourceType,
        children: [
          {
            label: val.dictLabel,
            value: val.dictValue,
          },
        ],
      };
    }
  });
  return compact(Object.values(factorMap)).flat();
};
