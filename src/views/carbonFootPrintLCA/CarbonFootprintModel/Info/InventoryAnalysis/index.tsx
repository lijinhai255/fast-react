/**
 * @description 清单分析
 */

import { DataNode } from 'antd/lib/tree';
import { compact } from 'lodash-es';
import { useEffect, useState } from 'react';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { PageTypeInfo } from '@/router/utils/enums';
import { Toast } from '@/utils';
import ChooseFactorModal from '@/views/carbonFootPrintLCA/components/ChooseFactorModal';
import { Factor } from '@/views/carbonFootPrintLCA/components/ChooseFactorModal/type';
import ChooseProcessModal from '@/views/carbonFootPrintLCA/components/ChooseProcessModal';
import { ChooseProcessLibrary } from '@/views/carbonFootPrintLCA/components/ChooseProcessModal/type';
import FactorDatabase from '@/views/carbonFootPrintLCA/components/FactorDatabase';
import { FactorResp } from '@/views/carbonFootPrintLCA/components/FactorDatabase/type';
import ProcessDescribe from '@/views/carbonFootPrintLCA/components/ProcessDescribe';
import ProcessDescribeDrawer from '@/views/carbonFootPrintLCA/components/ProcessDescribeDrawer';
import ProcessLeftMenu from '@/views/carbonFootPrintLCA/components/ProcessLeftMenu';
import { SideBarNode } from '@/views/carbonFootPrintLCA/components/ProcessLeftMenu/type';
import ProcessManageDrawer from '@/views/carbonFootPrintLCA/components/ProcessManageDrawer';
import { SELECT_BUTTON_TYPE } from '@/views/carbonFootPrintLCA/components/ProcessManageDrawer/constant';
import { ChooseInputOutputLibrary } from '@/views/carbonFootPrintLCA/components/ProcessManageDrawer/type';
import ProcessManageTable from '@/views/carbonFootPrintLCA/components/ProcessManageTable';
import { onGetProcessManageColumns } from '@/views/carbonFootPrintLCA/components/ProcessManageTable/columns';
import { LIFE_CYCLE_TYPE } from '@/views/carbonFootPrintLCA/components/ProcessManageTable/constant';
import { InputOutput } from '@/views/carbonFootPrintLCA/components/ProcessManageTable/type';
import SupportFiles from '@/views/carbonFootPrintLCA/components/SupportFiles';
import { OBJECT_TYPE } from '@/views/carbonFootPrintLCA/components/SupportFiles/constant';

import ChooseInputModal from './ChooseInputModal';
import style from './index.module.less';
import {
  getProcessTreeData,
  postProcessDescEdit,
  getProcessDescDetail,
  getProcessModelList,
  postProcessModelDelete,
  postProcessModelAdd,
  postProcessModelEdit,
  getProcessModelDetail,
  getFactorDetail,
  postSaveToLibrary,
} from '../../service';
import { Process } from '../../type';

/** 生产制造、废弃处置生命周期阶段 */
const { PRODUCTION_MANUFACTURING, WASTE_DISPOSAL } = LIFE_CYCLE_TYPE;

/** 过程库、因子库 */
const { PROCESS_DATA, FACTOR_DATA } = SELECT_BUTTON_TYPE;

const { add } = PageTypeInfo;

const InventoryAnalysis = ({
  onNextStepClick,
  onBackClick,
}: {
  /** 点击下一步的方法 */
  onNextStepClick: () => void;
  /** 返回的方法 */
  onBackClick: () => void;
}) => {
  const { isDetail, id } = usePageInfo();

  /** ****************************************** 左侧菜单部分 ********************************************************/
  /** 左侧菜单的宽度 */
  const [currentWidth, setCurrentWidth] = useState<number>();
  /** 当前选中的菜单 */
  const [currentSelectedNode, setCurrentSelectedNode] = useState<
    DataNode & SideBarNode
  >();
  const {
    key,
    upstreamProcessId = 0,
    lifeStageType,
    topLifeStageType,
    dataType,
  } = currentSelectedNode || {};
  /** 当前点击的上下游数据所在列的id */
  const [processManageUpOrDownStreamId, setProcessManageUpOrDownStreamId] =
    useState<number>();
  /** 菜单数据 */
  const [treeData, setTreeData] = useState<SideBarNode[]>([]);
  /** 左侧树刷新标识 */
  const [treeRefreshFlag, setTreeRefreshFlag] = useState(false);

  /** ****************************************** 过程描述部分 ********************************************************/
  /** 过程描述详情 */
  const [processDescDataSource, setProcessDescDataSource] = useState<Process>();
  /** 过程描述操作按钮的类型 */
  const [processDescActionBtnType, setProcessDescActionBtnType] =
    useState<string>();
  /** 控制过程描述详情抽屉的显隐 */
  const [processDescDrawerOpen, setProcessDescDrawerOpen] = useState(false);
  /** 过程描述详情的刷新标识 */
  const [processDescRefreshFlag, setProcessDescRefreshFlag] = useState(false);

  /** ****************************************** 过程管理部分 ********************************************************/
  /** 过程管理表格的操作按钮的类型 */
  const [processManageActionBtnType, setProcessManageActionBtnType] =
    useState<string>();
  /** 当前过程管理表格所在列的id */
  const [processManageColumnId, setProcessManageColumnId] = useState<number>();
  /** 当前过程管理表格的类型 1输入、2 输出 3产品 */
  const [processManageCategoryType, setProcessManageCategoryType] =
    useState<number>();
  /** 控制过程管理详情抽屉的显隐 */
  const [processManageDrawerOpen, setProcessManageDrawerOpen] = useState(false);
  /** 过程管理表格的刷新标识 */
  const [processManageTableRefreshFlag, setProcessManageTableRefreshFlag] =
    useState(false);

  /** ****************************************** 过程管理详情部分 ********************************************************/
  /** 过程管理详情 */
  const [processManageDataSource, setProcessManageDataSource] =
    useState<InputOutput>();
  /** 控制选择输入弹窗的显隐 */
  const [chooseInputOpen, setChooseInputOpen] = useState(false);
  /** 选择的输入 */
  const [selectedInput, setSelectedInput] =
    useState<ChooseInputOutputLibrary>();
  /** 输入名称 */
  const [selectInputName, setSelectInputName] = useState<string>();
  /** 控制选择过程弹窗的显隐 */
  const [chooseProcessOpen, setChooseProcessOpen] = useState(false);
  /** 选择的过程 */
  const [selectedProcess, setSelectedProcess] =
    useState<ChooseProcessLibrary>();
  /** 控制选择因子弹窗的显隐 */
  const [chooseFactorOpen, setChooseFactorOpen] = useState(false);
  /** 选择的过程 */
  const [selectedFactor, setSelectedFactor] = useState<Factor>();

  /** ****************************************** 因子数据库部分 ********************************************************/
  /** 因子详情数据 */
  const [factorInfo, setFactorInfo] = useState<FactorResp>();

  /** 判断是否展示过程模型的数据（过程描述、产品、输入、输出、支撑材料） */
  /** 当数据类型为过程数据 或 当前的生命周期为生产制造或者废弃处置时 展示过程模型的完整数据 */
  const showWholeProcess =
    dataType === PROCESS_DATA ||
    lifeStageType === PRODUCTION_MANUFACTURING ||
    lifeStageType === WASTE_DISPOSAL;

  /** ****************************************** 左侧菜单部分 ********************************************************/
  /** 获取菜单树的数据 */
  useEffect(() => {
    if (id) {
      getProcessTreeData({ modelId: id }).then(({ data }) => {
        setTreeData(data?.data);
      });
    }
  }, [id, treeRefreshFlag]);

  /** ****************************************** 过程描述部分 ********************************************************/
  /** 获取过程描述详情数据 */
  useEffect(() => {
    if (upstreamProcessId) {
      getProcessDescDetail({ id: upstreamProcessId }).then(({ data }) => {
        setProcessDescDataSource(data?.data);
      });
    }
  }, [upstreamProcessId, processDescRefreshFlag]);
  /** 过程描述初始化 */
  const onProcessDescInit = () => {
    setProcessDescActionBtnType(undefined);
    setProcessDescDrawerOpen(false);
  };
  /** 过程描述的保存 */
  const onSaveProcessDesc = async (
    formValues: Process,
    successCallBack: () => void,
    failCallBack: () => void,
  ) => {
    try {
      await postProcessDescEdit(formValues);
      successCallBack();
      onProcessDescInit();
      setProcessDescRefreshFlag(!processDescRefreshFlag);
    } catch (e) {
      failCallBack();
      throw e;
    }
  };

  /** ****************************************** 过程管理部分 ********************************************************/
  /** 过程管理-产品-表格-更新分配系数的方法 */
  const onProcessManageTableUpdateCoefficientFn = async (
    data: InputOutput,
    successCallBack: () => void,
  ) => {
    await postProcessModelEdit(data);
    successCallBack();
  };
  /** 点击过程管理表格删除 */
  const onProcessManageTableDeleteClick = async (
    columnId: number,
    successCallBack: () => void,
  ) => {
    await postProcessModelDelete({ id: columnId });
    successCallBack();
    setTreeRefreshFlag(!treeRefreshFlag);
    setProcessManageTableRefreshFlag(!processManageTableRefreshFlag);
  };

  /** ****************************************** 过程管理详情部分 ********************************************************/
  /** 获取过程管理详情数据 */
  useEffect(() => {
    if (processManageColumnId) {
      getProcessModelDetail({ id: processManageColumnId }).then(({ data }) => {
        setProcessManageDataSource(data?.data);
      });
    }
  }, [processManageColumnId]);
  /** 过程管理详情初始化 */
  const onProcessManageInit = () => {
    setProcessManageActionBtnType(undefined);
    setProcessManageColumnId(undefined);
    setProcessManageCategoryType(undefined);
    setProcessManageDrawerOpen(false);
    setProcessManageDataSource(undefined);
    setSelectedInput(undefined);
    setSelectedProcess(undefined);
    setSelectedFactor(undefined);
  };
  /** 过程管理抽屉数据的保存方法 */
  const onSaveProcesssManage = async (
    formValues: InputOutput,
    successCallBack: () => void,
    failCallBack: () => void,
  ) => {
    const isAdd = processManageActionBtnType === add;
    const postApi = isAdd ? postProcessModelAdd : postProcessModelEdit;
    try {
      await postApi(formValues);
      successCallBack();
      onProcessManageInit();
      setProcessManageTableRefreshFlag(!processManageTableRefreshFlag);
      setTreeRefreshFlag(!treeRefreshFlag);
    } catch (e) {
      failCallBack();
      throw e;
    }
  };

  /** ****************************************** 因子数据库部分 ********************************************************/
  /** 因子详情 */
  useEffect(() => {
    if (dataType === FACTOR_DATA && upstreamProcessId) {
      getFactorDetail({ id: upstreamProcessId }).then(({ data }) => {
        setFactorInfo(data?.data);
      });
    }
  }, [dataType, upstreamProcessId]);

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.left}>
          {/* 菜单 */}
          <ProcessLeftMenu
            currentWidth={currentWidth}
            currentSelectedKeys={key ? [key] : undefined}
            moduleType='CarbonFootprintModel'
            processId={id}
            processColumnId={processManageUpOrDownStreamId}
            treeData={treeData}
            changeCurrentWidth={(changeWidth: number) => {
              setCurrentWidth(changeWidth);
            }}
            onSelect={selectedNode => {
              setProcessManageUpOrDownStreamId(undefined);
              setCurrentSelectedNode(selectedNode);
            }}
          />
        </div>
        <div
          className={style.right}
          style={{
            width: `calc(100% - ${currentWidth}px)`,
          }}
        >
          {/* 过程数据 当dataType为空或者过程数据时展示 */}
          {dataType !== FACTOR_DATA && (
            <div className={style.processDataWrapper}>
              {/* 过程描述 选中菜单以及展示完整的过程数据展示 */}
              {!!upstreamProcessId && showWholeProcess && (
                <div className={style.section}>
                  <ProcessDescribe
                    showActionBtn={!isDetail}
                    showSaveToLibraryBtn={showWholeProcess}
                    processDescDataSource={{
                      processName: processDescDataSource?.processName,
                      systemBoundary: processDescDataSource?.systemBoundary,
                    }}
                    onActionBtnClick={type => {
                      setProcessDescActionBtnType(type);
                      setProcessDescDrawerOpen(true);
                    }}
                    onSaveToLibraryFn={async (callBack: () => void) => {
                      if (!upstreamProcessId) {
                        return;
                      }
                      try {
                        await postSaveToLibrary({ id: upstreamProcessId });
                        callBack();
                        Toast('success', '保存到库成功');
                      } catch (e) {
                        callBack();
                      }
                    }}
                  />
                  {/* 过程描述详情抽屉 */}
                  <ProcessDescribeDrawer<Process>
                    actionBtnType={processDescActionBtnType}
                    open={processDescDrawerOpen}
                    processDescDataSource={processDescDataSource}
                    onSave={onSaveProcessDesc}
                    onClose={() => onProcessDescInit()}
                  />
                </div>
              )}
              {/* 过程模型-产品、输入、输出 */}
              {!!upstreamProcessId &&
                onGetProcessManageColumns(showWholeProcess, lifeStageType).map(
                  process => {
                    const { categoryType, columns } = process || {};
                    return (
                      <div className={style.section} key={categoryType}>
                        <ProcessManageTable
                          categoryType={categoryType}
                          columns={columns}
                          showActionBtn={!isDetail}
                          showWholeProcess={showWholeProcess}
                          refreshFlag={processManageTableRefreshFlag}
                          proTableProps={{
                            params: {
                              category: categoryType,
                              processId: upstreamProcessId,
                            },
                            request: async params => {
                              const {
                                category,
                                processId,
                                current = 1,
                                pageSize = 10,
                              } = params || {};
                              if (!(category && processId)) {
                                return {
                                  data: [],
                                  success: true,
                                };
                              }
                              return getProcessModelList({
                                category,
                                processId,
                                pageNum: showWholeProcess ? 1 : current,
                                pageSize: showWholeProcess ? 100000 : pageSize,
                              }).then(({ data }) => {
                                const columnsIndexNumber =
                                  (current - 1) * pageSize;
                                return {
                                  data: data?.data.list?.map((item, index) => ({
                                    ...item,
                                    allIndex: showWholeProcess
                                      ? index + 1
                                      : columnsIndexNumber + index + 1,
                                  })),
                                  total: data?.data?.total,
                                  success: true,
                                };
                              });
                            },
                          }}
                          onActionBtnClick={(type, columnId) => {
                            setProcessManageActionBtnType(type);
                            setProcessManageCategoryType(categoryType);
                            setProcessManageColumnId(columnId);
                            setProcessManageDrawerOpen(true);
                          }}
                          onProcessDataClick={upDownStreamId => {
                            setProcessManageUpOrDownStreamId(upDownStreamId);
                          }}
                          onProcessManageDeleteClick={
                            onProcessManageTableDeleteClick
                          }
                          onUpdateCoefficientFn={
                            onProcessManageTableUpdateCoefficientFn
                          }
                        />
                      </div>
                    );
                  },
                )}
              {/* 过程管理详情抽屉 */}
              <ProcessManageDrawer
                actionBtnType={processManageActionBtnType}
                categoryType={processManageCategoryType}
                lifeStageType={lifeStageType}
                objectType={OBJECT_TYPE.MODEL_INPUTOUTPUT}
                open={processManageDrawerOpen}
                processManageDataSource={processManageDataSource}
                processColumnId={processManageColumnId}
                showWholeProcess={showWholeProcess}
                showLifeStageSelectRadio={
                  topLifeStageType === PRODUCTION_MANUFACTURING
                }
                selectedInput={selectedInput}
                selectedProcess={selectedProcess}
                selectedFactor={selectedFactor}
                treeNodeId={upstreamProcessId}
                onDataTypeChange={() => {
                  setSelectedFactor(undefined);
                  setSelectedInput(undefined);
                  setSelectedProcess(undefined);
                }}
                onChooseInputClick={inputName => {
                  setSelectInputName(inputName);
                  setChooseInputOpen(true);
                }}
                onChooseProcessClick={() => {
                  setChooseProcessOpen(true);
                }}
                onChooseFactorClick={() => {
                  setChooseFactorOpen(true);
                }}
                onSave={onSaveProcesssManage}
                onClose={() => onProcessManageInit()}
              />
              {/* 选择输入弹窗 */}
              <ChooseInputModal
                processId={id}
                inputName={selectInputName}
                open={chooseInputOpen}
                handleOk={({ selectRows }: { selectRows: InputOutput }) => {
                  setSelectedInput(selectRows[0]);
                  setChooseInputOpen(false);
                  setSelectInputName(undefined);
                }}
                handleCancel={() => {
                  setSelectInputName(undefined);
                  setChooseInputOpen(false);
                }}
              />
              {/* 选择过程弹窗 */}
              <ChooseProcessModal
                open={chooseProcessOpen}
                handleOk={({
                  selectRows,
                }: {
                  selectRows: ChooseProcessLibrary;
                }) => {
                  setSelectedProcess(selectRows[0]);
                  setChooseProcessOpen(false);
                }}
                handleCancel={() => setChooseProcessOpen(false)}
              />
              {/* 选择因子弹窗 */}
              <ChooseFactorModal
                open={chooseFactorOpen}
                handleOk={({ selectRows }: { selectRows: Factor }) => {
                  setSelectedFactor(selectRows[0]);
                  setChooseFactorOpen(false);
                }}
                handleCancel={() => setChooseFactorOpen(false)}
              />
              {/* 支撑材料 */}
              {!!upstreamProcessId && showWholeProcess && (
                <div className={style.section}>
                  <SupportFiles
                    showActionBtn={!isDetail}
                    objectType={OBJECT_TYPE.MODEL_PROCESS}
                    treeNodeId={upstreamProcessId}
                  />
                </div>
              )}
            </div>
          )}
          {/* 因子数据库 */}
          {dataType === FACTOR_DATA && (
            <div className={style.fatorDatabaseWrapper}>
              <FactorDatabase factorInfo={factorInfo} />
            </div>
          )}
        </div>
      </div>
      <FormActions
        className='footWrapper'
        place='center'
        buttons={compact([
          !isDetail && {
            title: '下一步',
            type: 'primary',
            onClick: async () => {
              onNextStepClick();
            },
          },
          {
            title: '返回',
            onClick: async () => {
              onBackClick();
            },
          },
        ])}
      />
    </div>
  );
};
export default InventoryAnalysis;
