import type { ProColumns } from '@ant-design/pro-components';
import { Modal, InputNumber } from 'antd';
import { compact, omit } from 'lodash-es';

import { TableActions } from '@/components/Table/TableActions';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast, modalText, modelFooterBtnStyle } from '@/utils';

import { LIFE_CYCLE_TYPE, PROCESS_CATATYPE } from './constant';
import style from './index.module.less';
import { InputOutput } from './type';
import { PRODUCTION_TYPE, OUTPUT_TYPE } from '../ProcessManageDrawer/constant';

/** 生命周期类型 原材料、分销储存、产品使用 */
const { RAW_MATERIAL, DISTRIBUTION_STORAGE, PRODUCT_USE } = LIFE_CYCLE_TYPE;

/** 过程管理类型 产品、输入、输出 */
const { PRODUCTION, INPUT, OUTPUT } = PROCESS_CATATYPE;

/** 产品类型 主产品、副产品 */
const { MAIN_PRODUCT, SIDE_PRODUCT } = PRODUCTION_TYPE;

/** 输出类型 可再生回收物 */
const { RENEWABLE_OUTPUTS } = OUTPUT_TYPE;

const { edit, show } = PageTypeInfo;

export interface ColumnsProps {
  /** 是否展示操作按钮 */
  showActionBtn: boolean;
  /** 操作按钮的方法 */
  onActionBtnClick?: (type: string, id?: number) => void;
  /** 点击上下游过程数据的方法 */
  onProcessDataClick?: (id: number) => void;
  /** 点击删除按钮的方法 */
  onProcessManageDeleteClick?: (
    id: number,
    successCallBack: () => void,
  ) => void;
  /** 类型：产品-副产品-更新分配系数 */
  onUpdateCoefficientFn?: (
    data: InputOutput,
    successCallBack: () => void,
  ) => void;
}

const roundNum = (num: number, decimal: number) => {
  return Math.round(num * 10 ** decimal) / 10 ** decimal;
};

/** 分配系数单元格 */
const Coefficient = ({
  record,
  disabled,
  updateCoefficient,
}: {
  /** 更改此行数据 */
  record: InputOutput;
  /** 是否允许编辑 */
  disabled: boolean;
  /** 更新分配系数的方法 */
  updateCoefficient?: (record: InputOutput) => void;
}) => {
  /** 分配系数、产品类型 */
  const { allocationCoefficient, productType } = record || {};

  switch (productType) {
    /** 主产品 不可以编辑分配系数 */
    case MAIN_PRODUCT:
      return disabled ? (
        <span>{allocationCoefficient}</span>
      ) : (
        <InputNumber value={allocationCoefficient} disabled />
      );
    /** 副产品 */
    case SIDE_PRODUCT:
      return disabled ? (
        <span>{allocationCoefficient}</span>
      ) : (
        <InputNumber
          value={allocationCoefficient}
          disabled={disabled}
          stringMode
          formatter={(v?: number) => `${v}`}
          min={0.01}
          max={100}
          precision={2}
          onBlur={event => {
            const max = 100;
            const min = 0.01;
            const precision = 2;
            const { value } = event.target;

            const y = value.indexOf('.') + 1;
            const count = value.length - y;

            const inputValue = Number(value);

            if (isNaN(inputValue)) {
              return;
            }

            let allocationCoefficientValue = 0;
            /** 如果输入的值为小数且小数位数超过了范围 输入数大于最大值 则取最大值 否则保留限制的小数位 */
            if (y > 0 && count > precision) {
              allocationCoefficientValue =
                inputValue > max ? max : roundNum(inputValue, precision);
            } else if (inputValue < min) {
              /** 如果输入值 小于 限制的最小值 则取最小值 */
              allocationCoefficientValue = min;
            } else if (inputValue > max) {
              /** 如果输入值 大于 限制的最大值， 则取最大值 */
              allocationCoefficientValue = max;
            } else {
              allocationCoefficientValue = inputValue;
            }

            updateCoefficient?.(
              omit(
                {
                  ...record,
                  allocationCoefficient: value
                    ? allocationCoefficientValue
                    : undefined,
                },
                'allIndex',
              ),
            );
          }}
        />
      );
    /** 避免产品 */
    default:
      return <>-</>;
  }
};

/** 产品 */
export const productionColumns = ({
  showActionBtn,
  onActionBtnClick,
  onProcessDataClick,
  onProcessManageDeleteClick,
  onUpdateCoefficientFn,
}: ColumnsProps): ProColumns<InputOutput>[] =>
  compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },

    {
      title: '数量',
      dataIndex: 'count',
      ellipsis: true,
      render: (_, record) => {
        const { count, unitName } = record;
        return count && unitName ? `${count}${unitName}` : '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'productType_name',
      ellipsis: true,
    },
    {
      title: '分配系数（%）',
      dataIndex: 'allocationCoefficient',
      render: (_, record, __, action) => {
        return (
          <Coefficient
            record={record}
            disabled={!showActionBtn}
            updateCoefficient={async data => {
              onUpdateCoefficientFn?.(data, () => {
                action?.reload();
              });
            }}
          />
        );
      },
    },
    {
      title: '上下游数据',
      dataIndex: 'upstreamProcessProductName',
      ellipsis: true,
      render: (_, record) => {
        const { upstreamProcessProductName, id } = record || {};
        return upstreamProcessProductName ? (
          <span
            className={style.processBtn}
            onClick={() => {
              if (id) onProcessDataClick?.(id);
            }}
          >
            {upstreamProcessProductName}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: showActionBtn ? 160 : 60,
      fixed: 'right',
      render(_, row, __, action) {
        const { id, name } = row || {};
        return (
          <TableActions
            menus={compact([
              showActionBtn && {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  onActionBtnClick?.(edit, id);
                },
              },
              showActionBtn && {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该产品：
                        <span className={modalText}>{name}?</span>
                      </>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      if (id) {
                        onProcessManageDeleteClick?.(id, () => {
                          Toast('success', '删除成功');
                          action?.reload();
                        });
                      }
                    },
                  });
                },
              },
              {
                label: '查看',
                key: '查看',
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              },
            ])}
          />
        );
      },
    },
  ]);

/** 输入 */
export const inputColumns = ({
  showActionBtn,
  onActionBtnClick,
  onProcessDataClick,
  onProcessManageDeleteClick,
}: ColumnsProps): ProColumns<InputOutput>[] =>
  compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
      fixed: 'left',
    },
    {
      title: '输入名称',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'count',
      ellipsis: true,
      render: (_, record) => {
        const { count, unitName } = record;
        return count && unitName ? `${count}${unitName}` : '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'inputOutputType_name',
      ellipsis: true,
      render: (_, record) => {
        const { inputOutputType_name, renewingType_name } = record;
        return renewingType_name
          ? `${inputOutputType_name}（${renewingType_name}）`
          : `${inputOutputType_name}`;
      },
    },
    {
      title: '上游数据',
      dataIndex: 'upstreamProcessProductName',
      ellipsis: true,
      render: (_, record) => {
        const { upstreamProcessProductName, id } = record || {};
        return upstreamProcessProductName ? (
          <span
            className={style.processBtn}
            onClick={() => {
              if (id) onProcessDataClick?.(id);
            }}
          >
            {upstreamProcessProductName}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: showActionBtn ? 160 : 60,
      fixed: 'right',
      render(_, row, __, action) {
        const { id, name, renewingType } = row || {};
        // 类型中标记再生和回收标签（renewingType 1. 再生；2. 回收）的输入，不可编辑和删除
        return (
          <TableActions
            menus={compact([
              !renewingType &&
                showActionBtn && {
                  label: '编辑',
                  key: '编辑',
                  onClick: () => {
                    onActionBtnClick?.(edit, id);
                  },
                },
              !renewingType &&
                showActionBtn && {
                  label: '删除',
                  key: '删除',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: (
                        <>
                          确认删除该输入：
                          <span className={modalText}>{name}?</span>
                        </>
                      ),
                      ...modelFooterBtnStyle,
                      onOk: async () => {
                        if (id) {
                          onProcessManageDeleteClick?.(id, () => {
                            Toast('success', '删除成功');
                            action?.reload();
                          });
                        }
                      },
                    });
                  },
                },
              {
                label: '查看',
                key: '查看',
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              },
            ])}
          />
        );
      },
    },
  ]);

/** 输出 */
export const outputColumns = ({
  showActionBtn,
  onActionBtnClick,
  onProcessDataClick,
  onProcessManageDeleteClick,
}: ColumnsProps): ProColumns<InputOutput>[] =>
  compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
      fixed: 'left',
    },
    {
      title: '输出名称',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'count',
      ellipsis: true,
      render: (_, record) => {
        const { count, unitName } = record;
        return count && unitName ? `${count}${unitName}` : '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'inputOutputType_name',
      ellipsis: true,
    },
    {
      title: '下游数据',
      dataIndex: 'upstreamProcessProductName',
      ellipsis: true,
      render: (_, record) => {
        const {
          upstreamProcessProductName,
          id,
          inputOutputType,
          upstreamProcessProductId = 0,
        } = record || {};
        return upstreamProcessProductName ? (
          <span
            className={style.processBtn}
            onClick={() => {
              if (id && inputOutputType)
                /** 如果输出类型为可再生输出物时，点击过程数据的id为列表中的upstreamProcessProductId */
                onProcessDataClick?.(
                  inputOutputType === RENEWABLE_OUTPUTS
                    ? upstreamProcessProductId
                    : id,
                );
            }}
          >
            {upstreamProcessProductName}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: showActionBtn ? 160 : 60,
      fixed: 'right',
      render(_, row, __, action) {
        const { id, name } = row || {};
        return (
          <TableActions
            menus={compact([
              showActionBtn && {
                label: '编辑',
                key: '编辑',
                onClick: () => {
                  onActionBtnClick?.(edit, id);
                },
              },
              showActionBtn && {
                label: '删除',
                key: '删除',
                onClick: async () => {
                  Modal.confirm({
                    title: '提示',
                    icon: '',
                    content: (
                      <>
                        确认删除该输出：
                        <span className={modalText}>{name}?</span>
                      </>
                    ),
                    ...modelFooterBtnStyle,
                    onOk: async () => {
                      if (id) {
                        onProcessManageDeleteClick?.(id, () => {
                          Toast('success', '删除成功');
                          action?.reload();
                        });
                      }
                    },
                  });
                },
              },
              {
                label: '查看',
                key: '查看',
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              },
            ])}
          />
        );
      },
    },
  ]);

/** 原材料输入 */
export const rawMaterialInputColumns = ({
  showActionBtn,
  onActionBtnClick,
  onProcessDataClick,
  onProcessManageDeleteClick,
}: ColumnsProps): ProColumns<InputOutput>[] =>
  compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
      fixed: 'left',
    },
    {
      title: '原材料',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'count',
      ellipsis: true,
      render: (_, record) => {
        const { count, unitName } = record;
        return count && unitName ? `${count}${unitName}` : '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'inputOutputType_name',
      ellipsis: true,
      render: (_, record) => {
        const { inputOutputType_name, renewingType_name } = record;
        return renewingType_name
          ? `${inputOutputType_name}（${renewingType_name}）`
          : `${inputOutputType_name}`;
      },
    },
    {
      title: '上游数据',
      dataIndex: 'upstreamProcessProductName',
      ellipsis: true,
      render: (_, record) => {
        const { upstreamProcessProductName, id } = record || {};
        return upstreamProcessProductName ? (
          <span
            className={style.processBtn}
            onClick={() => {
              if (id) onProcessDataClick?.(id);
            }}
          >
            {upstreamProcessProductName}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: showActionBtn ? 160 : 60,
      fixed: 'right',
      render(_, row, __, action) {
        const { id, name, renewingType } = row || {};
        return (
          <TableActions
            menus={compact([
              !renewingType &&
                showActionBtn && {
                  label: '编辑',
                  key: '编辑',
                  onClick: () => {
                    onActionBtnClick?.(edit, id);
                  },
                },
              !renewingType &&
                showActionBtn && {
                  label: '删除',
                  key: '删除',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: (
                        <>
                          确认删除该原材料：
                          <span className={modalText}>{name}?</span>
                        </>
                      ),
                      ...modelFooterBtnStyle,
                      onOk: async () => {
                        if (id) {
                          onProcessManageDeleteClick?.(id, () => {
                            Toast('success', '删除成功');
                            action?.reload();
                          });
                        }
                      },
                    });
                  },
                },
              {
                label: '查看',
                key: '查看',
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              },
            ])}
          />
        );
      },
    },
  ]);

/** 分销储存输入 */
export const storagesInputColumns = ({
  showActionBtn,
  onActionBtnClick,
  onProcessDataClick,
  onProcessManageDeleteClick,
}: ColumnsProps): ProColumns<InputOutput>[] =>
  compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
      fixed: 'left',
    },
    {
      title: '分销场景',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'count',
      ellipsis: true,
      render: (_, record) => {
        const { count, unitName } = record;
        return count && unitName ? `${count}${unitName}` : '-';
      },
    },
    {
      title: '上游数据',
      dataIndex: 'upstreamProcessProductName',
      ellipsis: true,
      render: (_, record) => {
        const { upstreamProcessProductName, id } = record || {};
        return upstreamProcessProductName ? (
          <span
            className={style.processBtn}
            onClick={() => {
              if (id) onProcessDataClick?.(id);
            }}
          >
            {upstreamProcessProductName}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: showActionBtn ? 160 : 60,
      fixed: 'right',
      render(_, row, __, action) {
        const { id, name, renewingType } = row || {};
        return (
          <TableActions
            menus={compact([
              !renewingType &&
                showActionBtn && {
                  label: '编辑',
                  key: '编辑',
                  onClick: () => {
                    onActionBtnClick?.(edit, id);
                  },
                },
              !renewingType &&
                showActionBtn && {
                  label: '删除',
                  key: '删除',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: (
                        <>
                          确认删除该分销场景：
                          <span className={modalText}>{name}?</span>
                        </>
                      ),
                      ...modelFooterBtnStyle,
                      onOk: async () => {
                        if (id) {
                          onProcessManageDeleteClick?.(id, () => {
                            Toast('success', '删除成功');
                            action?.reload();
                          });
                        }
                      },
                    });
                  },
                },
              {
                label: '查看',
                key: '查看',
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              },
            ])}
          />
        );
      },
    },
  ]);

/** 产品使用输入 */
export const productionUseInputColumns = ({
  showActionBtn,
  onActionBtnClick,
  onProcessDataClick,
  onProcessManageDeleteClick,
}: ColumnsProps): ProColumns<InputOutput>[] =>
  compact([
    {
      title: '序号',
      dataIndex: 'allIndex',
      width: 80,
      fixed: 'left',
    },
    {
      title: '使用场景',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'count',
      ellipsis: true,
      render: (_, record) => {
        const { count, unitName } = record;
        return count && unitName ? `${count}${unitName}` : '-';
      },
    },
    {
      title: '上游数据',
      dataIndex: 'upstreamProcessProductName',
      ellipsis: true,
      render: (_, record) => {
        const { upstreamProcessProductName, id } = record || {};
        return upstreamProcessProductName ? (
          <span
            className={style.processBtn}
            onClick={() => {
              if (id) onProcessDataClick?.(id);
            }}
          >
            {upstreamProcessProductName}
          </span>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: showActionBtn ? 160 : 60,
      fixed: 'right',
      render(_, row, __, action) {
        const { id, name, renewingType } = row || {};
        return (
          <TableActions
            menus={compact([
              !renewingType &&
                showActionBtn && {
                  label: '编辑',
                  key: '编辑',
                  onClick: () => {
                    onActionBtnClick?.(edit, id);
                  },
                },
              !renewingType &&
                showActionBtn && {
                  label: '删除',
                  key: '删除',
                  onClick: async () => {
                    Modal.confirm({
                      title: '提示',
                      icon: '',
                      content: (
                        <>
                          确认删除该使用场景：
                          <span className={modalText}>{name}?</span>
                        </>
                      ),
                      ...modelFooterBtnStyle,
                      onOk: async () => {
                        if (id) {
                          onProcessManageDeleteClick?.(id, () => {
                            Toast('success', '删除成功');
                            action?.reload();
                          });
                        }
                      },
                    });
                  },
                },
              {
                label: '查看',
                key: '查看',
                onClick: () => {
                  onActionBtnClick?.(show, id);
                },
              },
            ])}
          />
        );
      },
    },
  ]);

/** 获取过程数据 */
export const onGetProcessManageColumns = (
  showWholeProcess: boolean,
  lifeStageType?: number,
) => {
  if (showWholeProcess) {
    return [
      /** 产品：完整的过程数据下展示 */
      {
        categoryType: PRODUCTION,
        columns: productionColumns,
      },
      /** 输入：一直展示 */
      {
        categoryType: INPUT,
        columns: inputColumns,
      },
      /** 输出：完整的过程数据下展示  */
      {
        categoryType: OUTPUT,
        columns: outputColumns,
      },
    ];
  }
  const liftStagColumnsMap = {
    /** 原材料 */
    [RAW_MATERIAL]: [
      {
        categoryType: INPUT,
        columns: rawMaterialInputColumns,
      },
    ],
    /** 分销和储存 */
    [DISTRIBUTION_STORAGE]: [
      {
        categoryType: INPUT,
        columns: storagesInputColumns,
      },
    ],
    /** 产品使用 */
    [PRODUCT_USE]: [
      {
        categoryType: INPUT,
        columns: productionUseInputColumns,
      },
    ],
  };
  return liftStagColumnsMap[lifeStageType as keyof typeof liftStagColumnsMap];
};
