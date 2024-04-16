/*
 * @@description: 选择供应商数据
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-06-14 18:30:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 16:07:01
 */
import { Key, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchProps } from 'table-render/dist/src/types';

import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ProductDto,
  getFootprintSupplierDataChooseApplyInfoId,
  getFootprintSupplierDataPage,
} from '@/sdks_v2/new/footprintV2ApiDocs';
import { getSearchParams, updateUrl } from '@/utils';
import SelectTable from '@/views/components/SelectTable';

import { columns } from './utils/columns';
import { searchSchema } from './utils/schemas';

function SelectSupplierData() {
  const navigate = useNavigate();
  const { pageTypeInfo, id, modelId, stage, stageName } = useParams<{
    pageTypeInfo: PageTypeInfo;
    id: string;
    modelId: string;
    stage: string;
    stageName: string;
  }>();

  /** 路由上携带的参数 */
  const search = { ...getSearchParams()[0] };

  /** 排放源信息 */
  const emissionData = JSON.parse(search.emissionData || '{}');

  /** 支撑文件 */
  const fileList = JSON.parse(search.fileList || '[]');

  /** 分页信息 */
  const [pageParams, setPageParams] = useState({
    page: 1,
    size: 10,
  });

  /** 获取供应商数据 */
  const searchApi: SearchProps<ProductDto>['api'] = ({
    current,
    pageSize,
    likeProductName,
    ...args
  }) => {
    setPageParams({ page: current, size: pageSize });
    const searchParams = {
      pageNum: current,
      pageSize,
      likeProductName,
      ...args,
    };
    return getFootprintSupplierDataPage(searchParams).then(({ data }) => {
      const result = data?.data || {};
      return {
        ...result,
        rows: result?.list || [],
        total: result.total || 0,
      };
    });
  };

  /** 页面跳转 */
  const navigatePageTo = () => {
    navigate(
      virtualLinkTransform(
        RouteMaps.carbonFootPrintAccountsModelInfo,
        [':modelId', PAGE_TYPE_VAR, ':id', ':stage', ':stageName'],
        [modelId, pageTypeInfo, id, stage, stageName],
      ),
    );
    updateUrl({
      emissionData,
      fileList,
    });
  };
  const onComfirm = (applyInfoId: Key) => {
    getFootprintSupplierDataChooseApplyInfoId({
      applyInfoId: Number(applyInfoId),
    }).then(({ data }) => {
      if (data.code === 200) {
        const {
          productName,
          factorValue,
          supplierName,
          year,
          factorUnitM,
          factorUnitZ,
        } = data.data;
        emissionData.factorInfoObj = {
          ...emissionData.factorInfoObj,
          factorName: productName,
          factorUnitZ,
          factorUnitM: factorUnitM ? factorUnitM.split(',') : [],
          factorSource: supplierName,
          factorYear: year,
          factorValue,
          factorId: -1,
        };
        navigatePageTo();
      }
    });
  };
  return (
    <SelectTable
      searchProps={{
        schema: searchSchema(),
      }}
      columns={columns({
        onDetail: row => {
          navigate(
            virtualLinkTransform(
              RouteMaps.carbonFootPrintAccountsSelectSupplierDataInfo,
              [
                ':modelId',
                PAGE_TYPE_VAR,
                ':id',
                ':stage',
                ':stageName',
                ':applyInfoId',
              ],
              [modelId, pageTypeInfo, id, stage, stageName, row?.applyInfoId],
            ),
          );
        },
      })}
      searchApi={searchApi}
      pageParams={pageParams}
      likeName={search?.likeProductName}
      onComfirm={onComfirm}
      onCancel={() => {
        navigatePageTo();
      }}
    />
  );
}
export default SelectSupplierData;
