/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-22 14:27:36
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-20 20:38:15
 */
import { DefaultOptionType } from 'antd/lib/select';
import { useEffect, useState } from 'react';

import {
  DictDataResp,
  DictEnumResp,
  getSystemDictdataPage,
  getSystemDictenumListAllByDictTypeBatch,
  getSystemDictenumPage,
} from '@/sdks/systemV2ApiDocs';

const pageSize = 200;

type Props = string | undefined;

export type DictMap = { type: DictDataResp[]; enums: DictEnumResp[] };

/** 获取所有字典枚举值  */
export const useDictEnums = (dictType: Props, sourceType?: string) => {
  const [dict, setDict] = useState<DictEnumResp[]>([]);
  useEffect(() => {
    if (!dictType) return;
    getSystemDictenumPage({
      dictType,
      pageNum: 1,
      pageSize,
      sourceType,
    }).then(({ data }) => {
      setDict(data?.data?.list || []);
    });
  }, [location.pathname, dictType, sourceType]);
  return dict;
};

/** 获取所有字典分类 */
export const useDictType = (dictType: Props) => {
  const [dict, setDict] = useState<DictDataResp[]>([]);
  useEffect(() => {
    if (!dictType) return;
    getSystemDictdataPage({
      dictType,
      pageNum: 1,
      pageSize,
    }).then(({ data }) => {
      setDict(data?.data?.list || []);
    });
  }, [location.pathname, dictType]);
  return dict;
};

/** 获取所有字典分类和标识 */
export const useGetDict = (dictType: Props, sourceType?: string): DictMap => {
  const type = useDictType(dictType);
  const enums = useDictEnums(dictType, sourceType);

  return { type, enums };
};

export type Dicts = {
  dictLabel: string;
  dictValue: string;
  sourceType: string;
  dictSort: number;
  id: null;
  sourceName: null | string;
  relatedValue: null | string;
  dictType: string;
};

/** enums 转换为 selectOptions */
export const changeEnum2Options = (enums?: Dicts[]): DefaultOptionType[] =>
  enums?.map(e => ({ label: e.dictLabel, value: e.dictValue })) || [];
export const changeEnum2OptionsLabel = (enums?: Dicts[]): DefaultOptionType[] =>
  enums?.map(e => ({ label: e.dictLabel, value: e.dictLabel })) || [];

/** 批量获取枚举值 */
export const useAllEnumsBatch = <T = Record<string, Dicts[]>>(
  dictTypes?: string,
) => {
  const [dict, setDict] = useState<T>();
  useEffect(() => {
    if (dictTypes)
      getSystemDictenumListAllByDictTypeBatch({ dictTypes }).then(
        ({ data }) => {
          setDict(data?.data as T | undefined);
        },
      );
  }, [location.pathname, dictTypes]);
  return dict;
};
