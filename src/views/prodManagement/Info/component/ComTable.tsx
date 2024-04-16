/*
 * @@description: 生产运营数据 - 新增 编辑 查看 Table
 */
import { Field } from '@formily/core';
import { useField, useForm } from '@formily/react';
import { InputNumber, Select, Table } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

import { useParams } from 'react-router-dom';

import { IconFont } from '@/components/IconFont';
import { TableActions } from '@/components/Table/TableActions';
// import { PageTypeInfo } from '@/router/utils/enums';
import { PageTypeInfo } from '@/router/utils/enums';
import {
  getComputationOperationMetricsOptions,
  OperationData,
  OperationMetrics,
} from '@/sdks_v2/new/computationV2ApiDocs';
import { Toast } from '@/utils';
import { RegChectDoit4 } from '@/views/eca/util/type';

import Style from './index.module.less';
import { initalProData } from '../type';

export const ComTable = () => {
  const { pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo;
  }>();

  const filed = useField<Field<{ metricsValue: number }>>();
  const form = useForm();
  const valueChangeFn = (value: number, index: number) => {
    if (!RegChectDoit4.test(`${value || 0}`)) {
      Toast('error', '支持小数点后四位');
    } else {
      filed.value[index].metricsValue = value;
      form.setFieldState('metricsList', {
        value: [...filed.value],
      });
    }
  };
  const [options, setOPtions] = useState<
    OperationMetrics & { label?: string; value?: number }[]
  >([]);
  // 可选指标项
  const getMetricsOptionFn = async () => {
    const idsArr = filed.value
      ?.map((item: { metricsId: number }) => Number(item.metricsId))
      .filter((item: number) => !isNaN(item));
    const { data } = await getComputationOperationMetricsOptions({
      metricsIds: [...(idsArr || [])]?.join(',') as unknown as number[],
    });
    setOPtions([
      ...data.data.map(item => {
        return {
          ...item,
          label: item.metricsName,
          value: item.id,
        };
      }),
    ]);
  };
  useEffect(() => {
    getMetricsOptionFn();
  }, [filed.value?.length, form]);

  return (
    <div>
      <Table<OperationData & { isEdit: boolean; metricsValue: string }>
        columns={compact([
          {
            title: '序号',
            dataIndex: 'index',
            fixed: 'left',
            render: (_: number, __, index) => index + 1,
          },
          {
            title: '运营指标',
            dataIndex: 'metricsName',
            render: (text, record, index) => {
              return record.isEdit ? (
                text
              ) : (
                <Select
                  value={text}
                  options={[...options]}
                  onChange={(value, options) => {
                    const newOption = options as unknown as {
                      label: string;
                      value: number;
                      metricsUnitName: string;
                    };
                    // 运营指标名称
                    filed.value[index].metricsName = newOption.label;
                    // 运营指标id
                    filed.value[index].metricsId = value;
                    // 单位名称
                    filed.value[index].metricsUnitName =
                      newOption.metricsUnitName;
                    getMetricsOptionFn();
                  }}
                  // status={text ? '' : 'error'}
                />
              );
            },
          },
          {
            title: '单位',
            dataIndex: 'metricsUnitName',
            render: text => {
              return text || '-';
            },
          },
          {
            title: '数值',
            dataIndex: 'metricsValue',
            width: 220,
            render: (text, _, index) => {
              return pageTypeInfo === PageTypeInfo.show ? (
                text
              ) : (
                <InputNumber
                  value={text}
                  onChange={e => {
                    valueChangeFn(e, index);
                  }}
                  min={0}
                  max={999999999.9999}
                />
              );
            },
          },
          pageTypeInfo !== PageTypeInfo.show && {
            title: '操作',
            dataIndex: 'id',
            width: 120,
            fixed: 'left',
            render: (...args) => {
              return (
                filed.value.length > 1 && (
                  <TableActions
                    menus={[
                      {
                        label: '删除',
                        key: '删除',
                        onClick: async () => {
                          const newArr = filed.value.filter(
                            (...itemArgs: number[]) => {
                              return args[2] !== itemArgs[1];
                            },
                          );
                          form.setFieldState('metricsList', {
                            value: newArr,
                          });
                        },
                      },
                    ]}
                  />
                )
              );
            },
          },
        ])}
        dataSource={filed.value}
        pagination={false}
        scroll={{ x: 1000 }}
      />
      {options?.length !== 0 && pageTypeInfo !== PageTypeInfo.show && (
        <div
          className={Style.addOptions}
          onClick={() => {
            form.setFieldState('metricsList', {
              value: [...filed.value, { ...initalProData }],
            });
          }}
        >
          <IconFont icon='icon-icon-chuangjianzuzhi' /> 新增运营数据
        </div>
      )}
    </div>
  );
};
