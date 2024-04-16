/**
 * @description 数据管理计划
 */
import { Radio, Space, Table } from 'antd';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TableActions } from '@/components/Table/TableActions';
import { usePageInfo, useTableScrollHeight } from '@/hooks';
import { EcaRouteMaps } from '@/router/utils/ecaEmums';
import {
  PageTypeInfo,
  PAGE_TYPE_VAR,
  virtualLinkTransform,
} from '@/router/utils/enums';
import {
  ControlPlanData,
  ControlPlanResp,
} from '@/sdks/computation/computationV2ApiDocs';
import { changeTableColumsNoText } from '@/utils';
import { changeDataFn } from '@/views/eca/util/util';

const RADIO_TYPE = {
  GHG: 'GHG',
  ISO: 'ISO',
} as const;

const { GHG, ISO } = RADIO_TYPE;

const RADIO_OPTIONS = [
  {
    label: 'GHG Protocol标准',
    value: GHG,
  },
  {
    label: 'ISO 14064-1:2018标准',
    value: ISO,
  },
];

export const TableFive = ({
  currentPlanIndex,
  changeHisToryFn,
  formValue,
  currentStandard,
  changeCurrentStandard,
}: {
  currentPlanIndex: number;
  changeHisToryFn: (str: string) => void;
  formValue: ControlPlanResp;
  currentStandard: string;
  changeCurrentStandard: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isEdit, id } = usePageInfo();
  const navigage = useNavigate();

  const scrollY = useTableScrollHeight();

  const [ghgDataSource, getGhhDataSource] = useState<
    (ControlPlanData & { rowSpan?: number })[]
  >([]);

  const [isoDataSource, getIsoDataSource] = useState<
    (ControlPlanData & { rowSpan?: number })[]
  >([]);

  useEffect(() => {
    const newGhgList = changeDataFn<ControlPlanData, 'ghgCategory'>(
      formValue?.ghgList?.map(item => {
        return {
          ...item,
          rowSpan: 0,
        };
      }) || [],
      'ghgCategory',
    );
    const newIsoList = changeDataFn<ControlPlanData, 'isoCategory'>(
      formValue?.isoList?.map(item => {
        return {
          ...item,
          rowSpan: 0,
        };
      }) || [],
      'isoCategory',
    );
    getIsoDataSource([...newIsoList]);
    getGhhDataSource([...(newGhgList || [])]);
  }, [formValue, currentPlanIndex]);

  return (
    <>
      <Radio.Group
        value={currentStandard}
        options={RADIO_OPTIONS}
        optionType='button'
        onChange={e => {
          changeCurrentStandard(e.target.value);
          const urlParamsData = `?id=${id}&currentPlanIndex=${currentPlanIndex}&currentStandard=${e.target.value}`;
          changeHisToryFn(urlParamsData);
        }}
        style={{
          marginBottom: '16px',
        }}
      />
      {/* GHG标准 */}
      {currentStandard === GHG && (
        <Table<
          ControlPlanData & {
            rowSpan?: number | undefined;
          }
        >
          pagination={false}
          columns={compact(
            changeTableColumsNoText(
              [
                {
                  title: '排放分类',
                  dataIndex: 'ghgCategory_name',
                  onCell: record => ({
                    rowSpan: record.rowSpan,
                  }),
                  width: 120,
                  ellipsis: false,
                },
                {
                  title: '排放类别',
                  dataIndex: 'ghgClassify_name',
                  width: 120,
                  ellipsis: false,
                },
                {
                  title: '类别说明',
                  dataIndex: 'categoryDesc',
                  ellipsis: true,
                },
                {
                  title: '活动描述/被排除的说明',
                  dataIndex: 'activityDesc',
                  width: 180,
                },
                {
                  title: '操作',
                  dataIndex: 'id',
                  width: isEdit ? 100 : 80,
                  render: (_, record) => {
                    return (
                      <Space>
                        <TableActions
                          menus={compact([
                            isEdit && {
                              label: '编辑',
                              key: '编辑',
                              onClick: () => {
                                navigage(
                                  virtualLinkTransform(
                                    EcaRouteMaps.editDataQualityManageEditDetail,
                                    [
                                      PAGE_TYPE_VAR,
                                      ':id',
                                      ':controlPlanId',
                                      ':standardType',
                                    ],
                                    [
                                      isEdit
                                        ? PageTypeInfo.edit
                                        : PageTypeInfo.show,
                                      id,
                                      record.id,
                                      1,
                                    ],
                                  ),
                                );
                              },
                            },
                            {
                              label: '查看',
                              key: '查看',
                              onClick: () => {
                                navigage(
                                  virtualLinkTransform(
                                    EcaRouteMaps.editDataQualityManageDetail,
                                    [
                                      PAGE_TYPE_VAR,
                                      ':id',
                                      ':controlPlanId',
                                      ':standardType',
                                    ],
                                    [
                                      isEdit
                                        ? PageTypeInfo.edit
                                        : PageTypeInfo.show,
                                      id,
                                      record.id,
                                      1,
                                    ],
                                  ),
                                );
                              },
                            },
                          ])}
                        />
                      </Space>
                    );
                  },
                },
              ],
              '-',
              true,
            ),
          )}
          dataSource={[...ghgDataSource]}
          scroll={{ y: scrollY }}
        />
      )}
      {/* ISO标准 */}
      {currentStandard === ISO && (
        <Table<
          ControlPlanData & {
            rowSpan?: number | undefined;
          }
        >
          pagination={false}
          columns={compact(
            changeTableColumsNoText(
              [
                {
                  title: '排放分类',
                  dataIndex: 'isoCategory_name',
                  onCell: (record, index) => {
                    const { rowSpan } = record;
                    if (index === isoDataSource.length - 1) {
                      return {};
                    }
                    return {
                      rowSpan,
                    };
                  },
                  width: 120,
                },
                {
                  title: '排放类别',
                  dataIndex: 'isoClassify_name',
                  width: 120,
                },
                {
                  title: '类别说明',
                  dataIndex: 'categoryDesc',
                  ellipsis: true,
                },
                {
                  title: '活动描述/被排除的说明',
                  dataIndex: 'activityDesc',
                  width: 180,
                },
                {
                  title: '操作',
                  dataIndex: 'action',
                  width: isEdit ? 100 : 80,
                  render: (_, record) => {
                    return (
                      <Space>
                        <TableActions
                          menus={compact([
                            isEdit && {
                              label: '编辑',
                              key: '编辑',
                              onClick: () => {
                                navigage(
                                  virtualLinkTransform(
                                    EcaRouteMaps.editDataQualityManageEditDetail,
                                    [
                                      PAGE_TYPE_VAR,
                                      ':id',
                                      ':controlPlanId',
                                      ':standardType',
                                    ],
                                    [
                                      isEdit
                                        ? PageTypeInfo.edit
                                        : PageTypeInfo.show,
                                      id,
                                      record.id,
                                      2,
                                    ],
                                  ),
                                );
                              },
                            },
                            {
                              label: '查看',
                              key: '查看',
                              onClick: () => {
                                navigage(
                                  virtualLinkTransform(
                                    EcaRouteMaps.editDataQualityManageDetail,
                                    [
                                      PAGE_TYPE_VAR,
                                      ':id',
                                      ':controlPlanId',
                                      ':standardType',
                                    ],
                                    [
                                      isEdit
                                        ? PageTypeInfo.edit
                                        : PageTypeInfo.show,
                                      id,
                                      record.id,
                                      2,
                                    ],
                                  ),
                                );
                              },
                            },
                          ])}
                        />
                      </Space>
                    );
                  },
                },
              ],
              '-',
              true,
            ),
          )}
          dataSource={[...isoDataSource]}
          scroll={{ y: scrollY }}
        />
      )}
    </>
  );
};
