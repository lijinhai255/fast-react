/*
 * @@description: 产品碳足迹-碳足迹核算-核算模型-排放源-选择排放因子
 * @Author: liuxinxin xinxin@carbonstop.net
 * @Date: 2023-03-13 11:35:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 16:03:58
 */
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { TableRender } from '@/components/x-render/TableRender';
import {
  PAGE_TYPE_VAR,
  PageTypeInfo,
  RouteMaps,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  Factor,
  getSystemFactorPage,
  getSystemFactorPageProps,
} from '@/sdks/systemV2ApiDocs';
import { getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import style from './index.module.less';
import { selectEmissionFactorColumns } from './utils/columns';
import { selectEmissionFactorSearchSchema } from './utils/schemas';

function SelectEmissonFactor() {
  const { form } = useTable();
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
  const indexColumn = useIndexColumn<any>(
    (Number(pageParams?.page) - 1) * Number(pageParams?.size),
  );

  /** 表格选中项 */
  const [selectRows, setSelectRows] = useState<Factor>();

  /** 选中的数据Key */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 排放因子列表 */
  const searchApi: SearchProps<Factor>['api'] = ({
    current,
    pageSize,
    likeName,
    ...args
  }) => {
    setPageParams({ page: current, size: pageSize });
    const searchParams = {
      pageNum: current,
      pageSize,
      likeName,
      status: '0',
      ...args,
    };
    return getSystemFactorPage(searchParams as getSystemFactorPageProps).then(
      ({ data }) => {
        const result = data?.data || {};
        const indexCount = (Number(current) - 1) * Number(pageSize);
        result?.list?.forEach((_, index) => {
          if (indexCount + index + 1 === 1) {
            setSelectRows(result?.list?.[0]);
            setSelectedRowKeys([result?.list?.[0].id as number]);
          }
        });

        return {
          ...result,
          rows: result?.list || [],
          total: result.total || 0,
        };
      },
    );
  };

  /** 选中表格 */
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: Factor[],
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectRows(selectedRows[0]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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

  useEffect(() => {
    form.setValues({
      likeName: search?.likeName,
    });
  }, []);

  return (
    <div className={style.selectEmissinFactorWrapper}>
      <TableRender
        searchProps={{
          schema: selectEmissionFactorSearchSchema(),
          api: searchApi,
          searchOnMount: false,
        }}
        tableProps={{
          rowSelection: {
            type: 'radio',
            ...rowSelection,
          },
          columns: [
            ...indexColumn,
            ...selectEmissionFactorColumns({ navigate }),
          ],
          pagination: {
            pageSize: pageParams?.size ? +pageParams.size : undefined,
            current: pageParams?.page ? +pageParams.page : undefined,
            size: 'default',
          },
        }}
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '保存',
            type: 'primary',
            onClick: async () => {
              if (selectRows) {
                const { name, factorValue, unit, institution, year } =
                  selectRows;
                emissionData.factorInfoObj = {
                  ...emissionData.factorInfoObj,
                  factorName: name,
                  factorValue,
                  unitCode: unit,
                  factorSource: institution,
                  factorYear: year,
                  factorId: selectedRowKeys[0],
                };
              }
              navigatePageTo();
            },
          },
          {
            title: '取消',
            onClick: async () => {
              navigatePageTo();
            },
          },
        ])}
      />
    </div>
  );
}
export default withTable(SelectEmissonFactor);
