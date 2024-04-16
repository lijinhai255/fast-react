/*
 * @@description:核算模型
 */
import { Button, Descriptions } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { FormActions } from '@/components/FormActions';
import { TableRender } from '@/components/x-render/TableRender';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import { PageTypeInfo, virtualLinkTransform } from '@/router/utils/enums';
import {
  Computation,
  Model,
  getComputationComputationEmissionSourceList,
  getComputationComputationId,
  getComputationModelEmissionSourceList,
  getComputationModelEmissionSourceListProps,
  getComputationModelId,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumsNoText, getSearchParams, updateUrl } from '@/utils';
import { useIndexColumn } from '@/utils/columns';

import { meissionSourceColumns } from '../emissionManage/utils/columns';
import { culComputation, culHistoryFn } from '../util/util';

const EmissionSource = () => {
  const { id, pageTypeInfo } = useParams<{
    id: string;
    pageTypeInfo: string;
  }>();
  const [model, setModel] = useState<
    Partial<Model & Computation & { dataPeriod_name?: string }>
  >({});
  const [searchParams, setSearchParams] =
    useState<getComputationModelEmissionSourceListProps>(
      getSearchParams<getComputationModelEmissionSourceListProps>()[0],
    );
  const { refresh, form } = useTable();
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getComputationModelEmissionSourceListProps>['api'] =
    ({ current, ...args }) => {
      const pageNum =
        (isFirstLoad.current ? searchParams.pageNum : current) || current;
      let newSearch = {
        ...args,
        ...searchParams,
        pageNum,
      } as getComputationModelEmissionSourceListProps;
      if (!isFirstLoad.current) {
        newSearch = {
          ...args,
          pageNum,
        } as getComputationModelEmissionSourceListProps;
        updateUrl(args);
      } else {
        form.setValues(newSearch);
      }
      setSearchParams({
        ...newSearch,
      });
      isFirstLoad.current = false;
      if (culComputation()) {
        return getComputationComputationEmissionSourceList({
          ...newSearch,
          computationId: Number(id),
        }).then(({ data }) => {
          return {
            rows: data?.data?.list,
            total: data?.data?.total,
          };
        });
      }
      return getComputationModelEmissionSourceList({
        ...newSearch,
        modelId: Number(id),
      }).then(({ data }) => {
        return {
          rows: data?.data?.list,
          total: data?.data?.total,
        };
      });
    };
  // 核算模型详情
  const modelFn = async () => {
    await getComputationModelId({ id: Number(id) }).then(({ data }) => {
      if (data.code === 200) {
        setModel({ ...data.data });
      }
    });
  };
  // 碳排放详情
  const idsFn = async () => {
    await getComputationComputationId({ id: Number(id) }).then(({ data }) => {
      if (data.code === 200) {
        setModel({ ...data.data });
      }
    });
  };

  useEffect(() => {
    if (culComputation()) {
      idsFn();
      return;
    }
    modelFn();
  }, []);

  return (
    <div>
      <Descriptions
        bordered
        title='排放源管理'
        extra={
          pageTypeInfo !== PageTypeInfo.show && (
            <Button
              type='primary'
              onClick={() => {
                if (culComputation()) {
                  // 碳排放核算
                  navigate(
                    virtualLinkTransform(
                      EcaRouteMaps.carbonMissionAccountingSource,
                      [':pageTypeInfo', ':id', ':SourcefactorId'],
                      [PageTypeInfo.add, id, 0],
                    ),
                  );
                  return;
                }
                // 核算模型
                navigate(
                  virtualLinkTransform(
                    EcaRouteMaps.accountingModelEmissionSourceInfo,
                    [':pageTypeInfo', ':id'],
                    [PageTypeInfo.add, id],
                  ),
                );
              }}
            >
              选择排放源
            </Button>
          )
        }
        style={{ marginBottom: 16 }}
      >
        {!culComputation() && (
          <Descriptions.Item label='模型名称'>
            {model?.modelName || '-'}
          </Descriptions.Item>
        )}
        {!culComputation() && (
          <Descriptions.Item label='所属组织'>
            {model?.orgName || '-'}
          </Descriptions.Item>
        )}

        {culComputation() && (
          <Descriptions.Item label='核算组织'>
            {model?.orgName || '-'}
          </Descriptions.Item>
        )}
        {culComputation() && (
          <Descriptions.Item label='核算年度'>
            {model?.year || '-'}
          </Descriptions.Item>
        )}
      </Descriptions>
      <TableRender
        searchProps={{
          schema: {},
          api: searchApi,
        }}
        tableProps={{
          columns: changeTableColumsNoText(
            [
              ...indexColumn,
              ...meissionSourceColumns({
                refresh,
                navigate,
                modelId: id,
                nodel: pageTypeInfo === PageTypeInfo.show,
                pageTypeInfo,
              }),
            ],
            '-',
          ),
          pagination: {
            pageSize: searchParams?.pageSize
              ? +searchParams.pageSize
              : undefined,
            current: searchParams?.pageNum ? +searchParams.pageNum : undefined,
            size: 'default',
          },
          scroll: { x: 1200 },
        }}
      />
      <FormActions
        place='center'
        buttons={compact([
          {
            title: '返回',
            onClick: async () => {
              navigate(culHistoryFn());
            },
          },
        ])}
      />
    </div>
  );
};

export default withTable(EmissionSource);
