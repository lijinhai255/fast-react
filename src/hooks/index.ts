/**
 * @description: 全局共用hooks
 */
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
import { EnumResp, getSystemEnumsEnumName } from '@/sdks/systemV2ApiDocs';
import { getSearchParams } from '@/utils';

/**
 * @description 获取枚举值
 * EnableStatus - 启用状态;
 * AuditType - 审批内容;
 * BizModule - 功能模块;
 * ConfigType - 配置类型;
 * FileStatus - 文件状态;
 * GasType - 温室气体类型;
 * ModuleType - 模块类型;
 * OperType - 操作类型;
 * OptionType - 多级结构复选框;
 * OrgType - 组织类型;
 * RoleType - 角色类型;
 * UserStatus - 用户状态;
 */
export const useAsyncEnums = (
  enumName:
    | 'EnableStatus'
    | 'AuditType'
    | 'BizModule'
    | 'ConfigType'
    | 'FileStatus'
    | 'GasType'
    | 'ModuleType'
    | 'OperType'
    | 'OptionType'
    | 'OrgType'
    | 'RoleType'
    | 'UserStatus'
    | 'DataStatus'
    | 'AuditStatus',
) => {
  const [enums, setEnums] = useState<EnumResp[]>([]);
  useEffect(() => {
    getSystemEnumsEnumName({ enumName }).then(({ data }) =>
      setEnums(data?.data || []),
    );
  }, []);
  return enums;
};

export const usePageNumberInfo = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNum = Number(searchParams.get('pageNum')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;

  const getParamsByKeys = useCallback(
    (keys?: (string | number | undefined | symbol)[]) => {
      if (!keys) return {};
      return keys.reduce((prev, cur) => {
        const searchParamsValueArr = searchParams.getAll(String(cur));
        if (cur && searchParamsValueArr && searchParamsValueArr.length === 1) {
          return {
            ...prev,
            [cur]: searchParams.get(String(cur)),
          };
        }
        if (cur && searchParamsValueArr && searchParamsValueArr.length > 1) {
          return {
            ...prev,
            [cur]: searchParamsValueArr,
          };
        }
        return prev;
      }, {});
    },
    [],
  );
  return {
    pageNum,
    pageSize,
    getParamsByKeys,
    setSearchParams,
  };
};

type PageInfoType = {
  isAdd: boolean;
  isEdit: boolean;
  isDetail: boolean;
  id: number;
  [property: string]: any;
};

/**
 * @description 获取页面信息
 */
export const usePageInfo = (): PageInfoType => {
  const { pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
  }>();
  const search = { ...getSearchParams()[0] };
  return {
    ...search,
    isAdd: pageTypeInfo === PageTypeInfo.add,
    isEdit: pageTypeInfo === PageTypeInfo.edit,
    isDetail: pageTypeInfo === PageTypeInfo.show,
    id: Number(search?.id),
  };
};

/**
 * @description 控制表格纵向滚动的高度
 * @param otherHeigh 表格距离底部的高度
 * @param domId 多个表格时，表格id
 * @returns scrollY 表格纵向滚动区域的高度
 */
export const useTableScrollHeight = (otherHeigh?: number, domId?: string) => {
  /* 全局表单提交框高度 */
  const globalFormActionsHeight = 60;

  /** 表格纵向滚动区域的高度 */
  const [scrollY, setScrollY] = useState('');

  /**
   * 获取第一个表格的可视化高度
   * @param {*} extraHeight 额外的高度(表格底部内容的高度 Number类型 包含返回返回按钮的高度60、底部边距 28)
   * @param {*} id 当前页面中有多个table时需要制定table的id
   */
  const getTableScroll = (
    extraHeight: number = globalFormActionsHeight + 28,
    id?: string,
  ) => {
    let tHeader = null;
    if (id) {
      tHeader = document.getElementById(id)
        ? document
            ?.getElementById(id)
            ?.getElementsByClassName('ant-table-thead')[0]
        : null;
    } else {
      tHeader = document?.getElementsByClassName('ant-table-thead')[0];
    }
    // 表格内容距离顶部的距离
    let tHeaderBottom = 0;
    if (tHeader) {
      tHeaderBottom = tHeader.getBoundingClientRect().bottom;
    }

    // 窗体高度-表格内容顶部的高度-表格内容底部的高度
    // let height = document.body.clientHeight - tHeaderBottom - extraHeight
    const height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`;
    return height;
  };

  useEffect(() => {
    setScrollY(getTableScroll(otherHeigh, domId));
  }, []);

  return scrollY;
};
