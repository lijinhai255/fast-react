/**
 * @description 过程管理页面
 */
import './index.less';
import { Modal } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormActions } from '@/components/FormActions';
import { usePageInfo } from '@/hooks';
import { PageTypeInfo } from '@/router/utils/enums';
import { LCARouteMaps } from '@/router/utils/lcaEnums';
import { Toast } from '@/utils';

import style from './index.module.less';
import ChooseFactorModal from '../../components/ChooseFactorModal';
import { Factor } from '../../components/ChooseFactorModal/type';
import ChooseProcessModal from '../../components/ChooseProcessModal';
import { ChooseProcessLibrary } from '../../components/ChooseProcessModal/type';
import FactorDatabase from '../../components/FactorDatabase';
import { FactorResp } from '../../components/FactorDatabase/type';
import ProcessDescribe from '../../components/ProcessDescribe';
import ProcessDescribeDrawer from '../../components/ProcessDescribeDrawer';
import ProcessLeftMenu from '../../components/ProcessLeftMenu';
import { SideBarNode } from '../../components/ProcessLeftMenu/type';
import ProcessManageDrawer from '../../components/ProcessManageDrawer';
import { SELECT_BUTTON_TYPE } from '../../components/ProcessManageDrawer/constant';
import { ChooseInputOutputLibrary } from '../../components/ProcessManageDrawer/type';
import ProcessManageTable from '../../components/ProcessManageTable';
import { onGetProcessManageColumns } from '../../components/ProcessManageTable/columns';
import { InputOutput } from '../../components/ProcessManageTable/type';
import SupportFiles from '../../components/SupportFiles';
import { OBJECT_TYPE } from '../../components/SupportFiles/constant';
import ChooseInputModal from '../ChooseInputModal';
import {
  getProcessManageTreeData,
  postProcessLibraryEdit,
  getProcessLibraryDetail,
  getProcessManageList,
  postProcessManageDelete,
  postProcessManageAdd,
  postProcessManageEdit,
  getProcessManageDetail,
  getFactorDetail,
  postSaveToLibrary,
} from '../service';
import { ProcessLibrary } from '../type';

const { PROCESS_DATA, FACTOR_DATA } = SELECT_BUTTON_TYPE;

const ProcessesLibraryInfo = () => {
  const navigate = useNavigate();

  const { isDetail, id } = usePageInfo();

  /** ****************************************** 左侧菜单部分 ********************************************************/
  /** 左侧菜单的宽度 */
  const [currentWidth, setCurrentWidth] = useState<number>();
  /** 当前选中的菜单 */
  const [currentSelectedNode, setCurrentSelectedNode] = useState<
    DataNode & SideBarNode
  >();
  const { key, upstreamProcessId = 0, dataType } = currentSelectedNode || {};
  /** 上下游数据的过程id */
  const upstreamProcessIdValue = upstreamProcessId || id;
  /** 当前点击的上下游数据所在列的id */
  const [processUpDownStreamId, setProcessUpDownStreamId] = useState<number>();
  /** 菜单数据 */
  const [treeData, setTreeData] = useState<SideBarNode[]>([]);
  /** 左侧树刷新标识 */
  const [treeRefreshFlag, setTreeRefreshFlag] = useState(false);

  /** ****************************************** 过程描述部分 ********************************************************/
  /** 过程描述详情 */
  const [processDescDataSource, setProcessDescDataSource] =
    useState<ProcessLibrary>();
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

  /** ****************************************** 左侧菜单部分 ********************************************************/
  /** 获取菜单树的数据 */
  useEffect(() => {
    if (id) {
      getProcessManageTreeData({ processId: id }).then(({ data }) => {
        setTreeData(data?.data);
      });
    }
  }, [id, treeRefreshFlag]);

  /** ****************************************** 过程描述部分 ********************************************************/
  /** 获取过程描述详情数据 */
  useEffect(() => {
    if (upstreamProcessIdValue) {
      getProcessLibraryDetail({ id: upstreamProcessIdValue }).then(
        ({ data }) => {
          setProcessDescDataSource(data?.data);
        },
      );
    }
  }, [upstreamProcessIdValue, processDescRefreshFlag]);
  /** 过程描述初始化 */
  const onProcessDescInit = () => {
    setProcessDescActionBtnType(undefined);
    setProcessDescDrawerOpen(false);
  };
  /** 过程描述的保存 */
  const onSaveProcessDesc = async (
    formValues: ProcessLibrary,
    successCallBack: () => void,
    failCallBack: () => void,
  ) => {
    try {
      await postProcessLibraryEdit(formValues);
      successCallBack();
      onProcessDescInit();
      setProcessDescRefreshFlag(!processDescRefreshFlag);
      setTreeRefreshFlag(!treeRefreshFlag);
    } catch (e) {
      failCallBack();
      throw e;
    }
  };

  /** ****************************************** 过程管理部分 ********************************************************/
  /** 过程管理 - 产品 - 副产品类型 - 更新分配系数 */
  const onProcessManageTableUpdateCoefficientFn = async (
    data: InputOutput,
    successCallBack: () => void,
  ) => {
    await postProcessManageEdit(data);
    successCallBack();
  };
  /** 过程管理列表的删除 */
  const onProcessManageTableDeleteClick = async (
    columnId: number,
    successCallBack: () => void,
  ) => {
    await postProcessManageDelete({ id: columnId });
    successCallBack();
    setTreeRefreshFlag(!treeRefreshFlag);
    setProcessManageTableRefreshFlag(!processManageTableRefreshFlag);
  };

  /** ****************************************** 过程管理详情部分 ********************************************************/
  /** 获取过程管理的详情 */
  useEffect(() => {
    if (processManageColumnId) {
      getProcessManageDetail({ id: processManageColumnId }).then(({ data }) => {
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
    const postApi =
      processManageActionBtnType === PageTypeInfo.add
        ? postProcessManageAdd
        : postProcessManageEdit;
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
    <div>
      <Modal
        className='carbonFootprintModelWrapper'
        destroyOnClose
        mask={false}
        open
        width='100%'
        title={undefined}
        footer={null}
        closable={false}
        transitionName=''
      >
        <div className={style.wrapper}>
          <div className={style.container}>
            <div className={style.left}>
              {/* 菜单 */}
              <ProcessLeftMenu
                currentWidth={currentWidth}
                currentSelectedKeys={key || key === 0 ? [key] : undefined}
                moduleType='ProcessesLibrary'
                processId={id}
                processColumnId={processUpDownStreamId}
                treeData={treeData}
                changeCurrentWidth={(changeWidth: number) => {
                  setCurrentWidth(changeWidth);
                }}
                onSelect={selectedNode => {
                  setProcessUpDownStreamId(undefined);
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
              {/* 过程数据 当dataType为过程数据时展示 */}
              {dataType === PROCESS_DATA && (
                <div className={style.processDataWrapper}>
                  {/* 过程描述 */}
                  {upstreamProcessIdValue && (
                    <div className={style.section}>
                      <ProcessDescribe
                        showActionBtn={!isDetail}
                        showSaveToLibraryBtn={!!key}
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
                      <ProcessDescribeDrawer<ProcessLibrary>
                        actionBtnType={processDescActionBtnType}
                        open={processDescDrawerOpen}
                        processDescDataSource={processDescDataSource}
                        onSave={onSaveProcessDesc}
                        onClose={() => onProcessDescInit()}
                      />
                    </div>
                  )}
                  {/* 过程管理列表-产品、输入、输出 */}
                  {upstreamProcessIdValue &&
                    onGetProcessManageColumns(true).map(process => {
                      const { categoryType, columns } = process || {};
                      return (
                        <div className={style.section} key={categoryType}>
                          <ProcessManageTable
                            categoryType={categoryType}
                            columns={columns}
                            showActionBtn={!isDetail}
                            showWholeProcess
                            refreshFlag={processManageTableRefreshFlag}
                            proTableProps={{
                              params: {
                                category: categoryType,
                                processId: upstreamProcessIdValue,
                              },
                              request: async params => {
                                const { processId, category } = params || {};
                                if (!(category && processId)) {
                                  return {
                                    data: [],
                                    success: true,
                                  };
                                }
                                return getProcessManageList({
                                  category,
                                  processId,
                                  pageNum: 1,
                                  pageSize: 100000,
                                }).then(({ data }) => {
                                  return {
                                    data: data?.data?.list?.map(
                                      (item: InputOutput, index: number) => ({
                                        ...item,
                                        allIndex: index + 1,
                                      }),
                                    ),
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
                              setProcessUpDownStreamId(upDownStreamId);
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
                    })}
                  {/* 过程管理详情抽屉 */}
                  <ProcessManageDrawer
                    actionBtnType={processManageActionBtnType}
                    categoryType={processManageCategoryType}
                    objectType={OBJECT_TYPE.PROCESS_INPUTOUTPUT}
                    open={processManageDrawerOpen}
                    processManageDataSource={processManageDataSource}
                    processColumnId={processManageColumnId}
                    showWholeProcess
                    showLifeStageSelectRadio={false}
                    selectedInput={selectedInput}
                    selectedProcess={selectedProcess}
                    selectedFactor={selectedFactor}
                    treeNodeId={upstreamProcessIdValue}
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
                    handleOk={({
                      selectRows,
                    }: {
                      selectRows: ChooseProcessLibrary;
                    }) => {
                      setSelectedInput(selectRows[0]);
                      setSelectInputName(undefined);
                      setChooseInputOpen(false);
                    }}
                    handleCancel={() => {
                      setSelectInputName(undefined);
                      setChooseInputOpen(false);
                    }}
                  />
                  {/* 选择过程弹窗 */}
                  <ChooseProcessModal
                    open={chooseProcessOpen}
                    extraParams={{
                      notProcessId: id,
                    }}
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
                  {upstreamProcessIdValue && (
                    <div className={style.section}>
                      <SupportFiles
                        showActionBtn={!isDetail}
                        objectType={OBJECT_TYPE.PROCESS_PROCESS}
                        treeNodeId={upstreamProcessIdValue}
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
        </div>
        <FormActions
          className='footWrapper'
          place='center'
          buttons={[
            {
              title: '返回',
              onClick: async () => {
                navigate(LCARouteMaps.lcaProcessLibrary);
              },
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default ProcessesLibraryInfo;
