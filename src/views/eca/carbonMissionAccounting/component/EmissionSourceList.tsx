/*
 * @@description:核算模型
 */
import { carbonMissionShowColumns } from '@views/eca/emissionManage/utils/columns';
import { Descriptions, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTable, withTable } from 'table-render';
import { SearchProps } from 'table-render/dist/src/types';

import { TableRender } from '@/components/x-render/TableRender';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getComputationComputationDataList,
  getComputationDataSourceList,
  getComputationDataSourceListProps,
} from '@/sdks/Newcomputation/computationV2ApiDocs';
import { changeTableColumsNoText, getSearchParams } from '@/utils';
import { useIndexColumn } from '@/utils/columns';
import Style from '@/views/eca/carbonMissionAccounting/index.module.less';

const EmissionSourceList = () => {
  const { id, pageTypeInfo } = useParams<{
    pageTypeInfo?: PageTypeInfo;
    id: string;
  }>();
  const [searchParams, setSearchParams] =
    useState<getComputationDataSourceListProps>(
      getSearchParams<getComputationDataSourceListProps>()[0],
    );
  const { refresh } = useTable();
  // 定位左侧栏目
  const [leftIndex, changeLeftIndex] = useState('0');
  const [leftDataSource, getLeftDataSource] = useState<
    {
      label: string;
      key: string;
      carbonEmission?: string;
      dataStatus_name?: string;
    }[]
  >([]);
  const navigate = useNavigate();

  const indexColumn = useIndexColumn<any>(
    (Number(searchParams?.pageNum) - 1) * Number(searchParams?.pageSize),
  );
  // 用于修正第一次页码无法正常设置问题
  const isFirstLoad = useRef(true);
  // @ts-ignore
  const searchApi: SearchProps<getComputationDataSourceListProps>['api'] = ({
    current,
    ...args
  }) => {
    const newSearch = {
      ...args,
    } as getComputationDataSourceListProps;
    // setSearchParams({
    //   ...newSearch,
    // });
    isFirstLoad.current = false;
    if (!newSearch?.computationDataId) {
      return {
        rows: [],
        total: 0,
      };
    }
    return getComputationDataSourceList({
      ...newSearch,
    }).then(({ data }) => {
      return {
        rows: data?.data?.list,
        total: data?.data?.total,
      };
    });
  };
  // 左侧列表
  const leftListFn = async () => {
    await getComputationComputationDataList({
      computationId: Number(id),
    }).then(({ data }) => {
      if (data.code === 200) {
        const newData = data.data as unknown as {
          dateRange: string;
          id: string;
          carbonEmission: string;
          dataStatus_name: string;
        }[];
        const newArr = newData?.map(item => {
          return {
            label: item?.dateRange,
            key: item?.id,
            carbonEmission: item?.carbonEmission,
            dataStatus_name: item?.dataStatus_name,
          };
        });
        if (newArr.length === 1) {
          getLeftDataSource([...(newArr || [])]);
          changeLeftIndex(newArr[0]?.key || '0');
          refresh?.(
            {
              stay: true,
              tab: 0,
            },
            {
              computationDataId: newArr[0]?.key,
            },
          );
          setSearchParams({
            ...searchParams,
            pageSize: 10,
            pageNum: 1,
          });
          return;
        }
        getLeftDataSource([...(newArr || [])]);
        changeLeftIndex(newArr[0]?.key || '0');
        setSearchParams({
          ...searchParams,
          pageSize: 10,
          pageNum: 1,
        });
        refresh?.(
          {
            stay: true,
            tab: 0,
          },
          {
            computationDataId: newArr[0]?.key,
            pageSize: 10,
            pageNum: 1,
          },
        );
      }
    });
  };
  // 获取右侧数据
  // const rightTableFn = async()=>{
  //   await getComputationDataSourceList()
  // }
  useEffect(() => {
    leftListFn();
  }, []);
  return (
    <div className={Style.wrap}>
      <div className={leftDataSource.length > 1 ? Style.flex : Style.flex_data}>
        {leftDataSource.length > 1 && (
          <div className={Style.flex_left}>
            <Tabs
              activeKey={leftIndex}
              tabPosition='left'
              items={[...leftDataSource]}
              className={Style.flex_left_tabs}
              onChange={key => {
                changeLeftIndex(key);
                setSearchParams({
                  ...searchParams,
                  pageSize: 10,
                  pageNum: 1,
                });
                refresh?.(
                  {
                    stay: true,
                    tab: 0,
                  },
                  {
                    ...searchParams,
                    computationDataId: key,
                    pageSize: 10,
                    pageNum: 1,
                  },
                );
              }}
            />
          </div>
        )}
        <div className={Style.flex_right}>
          <Descriptions
            title=''
            style={{ marginBottom: 16 }}
            size='small'
            bordered={false}
          >
            <Descriptions.Item label='排放量汇总（tCO₂e）'>
              {leftDataSource?.filter(item => item.key === leftIndex)?.[0]
                ?.carbonEmission || '-'}
            </Descriptions.Item>
            <Descriptions.Item label='排放数据填报状态'>
              <span className='modal_text'>
                {leftDataSource?.filter(item => item.key === leftIndex)?.[0]
                  ?.dataStatus_name || '-'}
              </span>
            </Descriptions.Item>
          </Descriptions>
          <TableRender
            searchProps={{
              schema: { type: 'string' },
              api: searchApi,
              hidden: true,
            }}
            tableProps={{
              columns: changeTableColumsNoText(
                [
                  ...indexColumn,
                  ...carbonMissionShowColumns({
                    refresh,
                    navigate,
                    modelId: id,
                    nodel: true,
                    pageTypeInfo,
                    leftIndex,
                  }),
                ],
                '-',
              ),
              pagination: {
                pageSize: searchParams?.pageSize
                  ? +searchParams.pageSize
                  : undefined,
                current: searchParams?.pageNum
                  ? +searchParams.pageNum
                  : undefined,
                size: 'default',
                onChange: (page, size) => {
                  refresh?.(
                    {
                      stay: true,
                      tab: 0,
                    },
                    {
                      ...searchParams,
                      pageNum: page,
                      pageSize: size,
                      computationDataId: leftIndex,
                    },
                  );
                  setSearchParams({
                    ...searchParams,
                    pageNum: page,
                    pageSize: size,
                  });
                },
              },
              scroll: { x: 1200 },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default withTable(EmissionSourceList);
