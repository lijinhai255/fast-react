/**
 * @description 排放数据的右侧配置列表（排放源类型和生产数据类型）
 */
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { keyBy } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Page } from '@/components/Page';
import { getEnterprisesystemSysFillParamPage } from '@/sdks_v2/new/enterprisesystemV2ApiDocs';

import { columns } from './columns';
import { ACTION_BTN_TYPE } from './constant';
import style from './index.module.less';
import { useEmissionFieldData } from '../../hooks';
import { ClassifyProps, EmissionDataListType } from '../../utils/type';
import { EmissionDataDrawer } from '../EmissionDataDrawer';
import { DATA_SETTING_TYPE, FILED_TYPE } from '../EmissionDataDrawer/constant';

const { ENUM_VALUE } = DATA_SETTING_TYPE;
const { OTHER } = FILED_TYPE;
const { SHOW, ADD } = ACTION_BTN_TYPE;
const { Text } = Typography;

const EmissionData = ({
  isViewMode,
  tenetId,
  selectedClassifyItem,
}: {
  /** 查看模式 */
  isViewMode: boolean;
  /** 核算周期ID */
  tenetId?: number;
  /** 选中的分类项数据 */
  selectedClassifyItem?: ClassifyProps;
}) => {
  const tableRef = useRef<ActionType>();

  const columnsStateDefault = useMemo(() => {
    return keyBy(columns, 'dataIndex');
  }, []);

  /** 接口返回的排放数据的列头数据  */
  const { emissionColumnNameData, emissionColumnNameDataObj } =
    useEmissionFieldData(selectedClassifyItem?.key, 0);

  /** 表格表头 */
  const [columnsData, setColumnsData] = useState<any[]>();

  /** 控制排放数据详情的抽屉 */
  const [open, setOpen] = useState(false);

  /** 排放数据id */
  const [emissionDataId, setEmissionDataId] = useState<number>();

  /** 列表操作按钮的类型 */
  const [actionBtnType, setActionBtnType] = useState<string>();

  /** 获取表头数据 */
  useEffect(() => {
    if (emissionColumnNameData) {
      const result = emissionColumnNameData?.map(item => ({
        title: (
          <div className={style.columnTitle}>
            <Text className={style.columnsName} ellipsis={{ tooltip: false }}>
              {`${item.name}`}
            </Text>
            {item.unitName && (
              <Text className={style.columnsName} ellipsis={{ tooltip: false }}>
                {`${item.unitName}`}
              </Text>
            )}
          </div>
        ),
        dataIndex: `${item.id}`,
        ellipsis: true,
      }));
      setColumnsData([...result]);
    }
  }, [emissionColumnNameData]);

  /** 列表操作按钮 */
  const onActionBtnClick = (type: string, id?: number) => {
    /** 操作按钮的类型 */
    setActionBtnType(type);
    /** 排放数据id */
    setEmissionDataId(id);
    /* 打开详情抽屉 */
    setOpen(true);
  };

  return (
    <>
      <Page
        title={undefined}
        onBtnClick={async () => {
          /** 操作按钮的类型 */
          setActionBtnType(ADD);
          /** 排放数据id */
          setEmissionDataId(undefined);
          setOpen(true);
        }}
        actionBtnChild={
          !isViewMode && (
            <div>
              <PlusOutlined /> 新增
            </div>
          )
        }
      >
        <ProTable<EmissionDataListType>
          columns={columns({
            isViewMode,
            columnsData,
            selectedClassifyItem,
            onActionBtnClick,
          })}
          actionRef={tableRef}
          pagination={{
            pageSize: 10,
            showTotal: undefined,
          }}
          search={false}
          params={{
            materialId: selectedClassifyItem?.key,
            emissionColumnNameDataObj,
          }}
          columnsState={{
            persistenceKey: 'EmissionData',
            persistenceType: 'localStorage',
            defaultValue: columnsStateDefault,
          }}
          scroll={{
            x:
              emissionColumnNameData && emissionColumnNameData.length > 10
                ? Number(`${emissionColumnNameData.length}00`)
                : 0,
          }}
          toolBarRender={false}
          request={async params => {
            const {
              pageSize = 10,
              current = 1,
              materialId,
              emissionColumnNameDataObj: emissionColumnNameDataParam,
            } = params;

            return getEnterprisesystemSysFillParamPage({
              materialId,
              pageNum: current,
              pageSize,
            }).then(({ data }) => {
              const columnsIndexNumber = (current - 1) * pageSize;
              const list = data?.data?.list || [];
              const result = list.reduce((pre, cur, index) => {
                const { fillParamList = [] } = cur || {};
                const obj = fillParamList?.reduce((preObj, curObj) => {
                  const {
                    sysBusinessColumnId = 0,
                    fieldValue,
                    fieldValueName,
                  } = curObj || {};
                  const { filedType, dataSetting } =
                    emissionColumnNameDataParam?.[sysBusinessColumnId] || {};
                  return {
                    ...preObj,
                    [sysBusinessColumnId]:
                      filedType !== OTHER || dataSetting === ENUM_VALUE
                        ? fieldValueName
                        : fieldValue,
                  };
                }, {});
                return [
                  ...pre,
                  {
                    ...cur,
                    ...obj,
                    allIndex: columnsIndexNumber + index + 1,
                  },
                ];
              }, [] as EmissionDataListType[]);
              return {
                data: result,
                success: true,
                total: data?.data?.total,
              };
            });
          }}
        />
      </Page>
      <EmissionDataDrawer
        open={open}
        isViewMode={actionBtnType === SHOW}
        tenetId={tenetId}
        emissionDataId={emissionDataId}
        selectedClassifyItem={selectedClassifyItem}
        onOk={() => {
          setEmissionDataId(undefined);
          setOpen(false);
          tableRef?.current?.reload();
        }}
        onClose={() => {
          setEmissionDataId(undefined);
          setOpen(false);
        }}
      />
    </>
  );
};
export default EmissionData;
