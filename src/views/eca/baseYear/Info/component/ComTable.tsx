/*
 * @@description:
 * @Author: ljh255 jinhai@carbonstop.net
 * @Date: 2023-02-26 12:39:07
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-06-16 18:29:36
 */
import { Field } from '@formily/core';
import { useField } from '@formily/react';
import { InputNumber, Table } from 'antd';
import { useParams } from 'react-router-dom';

import { PageTypeInfo } from '@/router/utils/enums';
// import { Toast } from '@/utils';
import { RegChectDoit3 } from '@/views/eca/util/util';

export const ComTable = (props: { emissionStandardEdit: number }) => {
  const { pageTypeInfo } = useParams<{
    pageTypeInfo: PageTypeInfo & 'copy';
  }>();
  const filed = useField<Field>();
  const computTotal = (record: any, index: number) => {
    // let value = 0;
    // 计算排放总量
    if (record.scopeOne || record.scopeTwo || record.scopeThree) {
      // @ts-ignore
      filed.value[index].total = (
        Number(record.scopeOne || 0) +
        Number(record.scopeTwo || 0) +
        Number(record.scopeThree || 0)
      )
        .toFixed(3)
        .replace(/\.?0+$/, '');
    } else if (
      record.direct ||
      record.energy ||
      record.transport ||
      record.outsourcing ||
      record.supplyChain ||
      record.rests
    ) {
      // @ts-ignore
      filed.value[index].total = // @ts-ignore
        (
          Number(record.direct || 0) +
          // @ts-ignore
          Number(record.energy || 0) +
          Number(record.transport || 0) +
          Number(record.outsourcing || 0) +
          Number(record.supplyChain || 0) +
          Number(record.rests || 0)
        )
          .toFixed(3)
          .replace(/\.?0+$/, '');
    } else {
      filed.value[index].total = 0;
    }
    // filed.value[index].total = record;
    filed.setValue([...filed.value]);
    // dataSource[index] = record;
    // setDataSource([...dataSource]);
  };
  const valueChangeFn = (
    value: string | null,
    index: number,
    record: [],
    key: string,
  ) => {
    if (!RegChectDoit3.test(value || '')) {
      // Toast('error', '支持小数点后三位');
    } else {
      filed.value[index][key] =
        Number(value) >= 0 ? Number(value).toFixed(3) : null;
      computTotal(record, index);
    }
  };

  const culDisAbled = (
    record: { noEdit: boolean; isEditPage: boolean } | undefined,
  ) => {
    // 编辑页面  特殊处理 更新数据在进行判断
    if (window.location.pathname.indexOf('edit') >= 0) {
      const isChangeDate = filed.value.some(
        (item: { isEditPage?: boolean }) => item?.isEditPage,
      );
      return !isChangeDate
        ? Number(props?.emissionStandardEdit) === 0 // 0 不可以编辑 1可以编辑
        : Number(props?.emissionStandardEdit) === 0 // 0 不可以编辑 1可以编辑
        ? !!record?.noEdit
        : false;
    }
    return window.location.pathname.indexOf('show') >= 0
      ? true
      : Number(props?.emissionStandardEdit) === 0 // 0 不可以编辑 1可以编辑
      ? !!record?.noEdit
      : false;
  };
  return (
    <div>
      <Table
        columns={[
          {
            title: '时间区间',
            width: 140,

            dataIndex: 'year',
            fixed: 'left',
            render: (text: number) => <div>{text}年</div>,
          },
          {
            title: '总排放量',
            dataIndex: 'total',
            width: 120,
            fixed: 'left',
            render: text => {
              return text || '-';
            },
          },
          {
            title: 'GHG标准排放分类',
            dataIndex: 'CO₂e',
            children: [
              {
                title: '范围一',
                dataIndex: `scopeOne`,
                width: 120,
                render: (_, record: any, index: number) => {
                  return pageTypeInfo === PageTypeInfo.show ? (
                    record?.scopeOne || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      disabled={culDisAbled(record)}
                      value={record?.scopeOne}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'scopeOne');
                      }}
                    />
                  );
                },
              },
              {
                title: '范围二',
                dataIndex: `scopeTwo`,
                width: 120,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'scopeTwo');
                      }}
                    />
                  ),
              },
              {
                title: '范围三',
                dataIndex: `scopeThree`,
                width: 120,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'scopeThree');
                      }}
                    />
                  ),
              },
            ],
          },
          {
            title: 'ISO标准排放分类',
            dataIndex: 'CO₂e',
            children: [
              {
                title: '直接排放或清除',
                dataIndex: `direct`,
                width: 140,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'direct');
                      }}
                    />
                  ),
              },
              {
                title: '能源间接排放',
                dataIndex: `energy`,
                width: 130,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'energy');
                      }}
                    />
                  ),
              },
              {
                title: '运输间接排放',
                dataIndex: `transport`,
                width: 130,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'transport');
                      }}
                    />
                  ),
              },
              {
                title: '外购产品或服务间接排放',
                dataIndex: `outsourcing`,
                width: 190,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'outsourcing');
                      }}
                    />
                  ),
              },
              {
                title: '供应链下游排放',
                dataIndex: `supplyChain`,
                width: 140,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'supplyChain');
                      }}
                    />
                  ),
              },

              {
                title: '其他间接排放',
                dataIndex: `rests`,
                width: 120,
                render: (text: string, record: any, index: number) =>
                  pageTypeInfo === PageTypeInfo.show ? (
                    text || '-'
                  ) : (
                    <InputNumber
                      controls={false}
                      placeholder='请输入'
                      value={text}
                      disabled={culDisAbled(record)}
                      onChange={value => {
                        valueChangeFn(value, index, record, 'rests');
                      }}
                    />
                  ),
              },
            ],
          },
        ]}
        dataSource={filed.value}
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};
