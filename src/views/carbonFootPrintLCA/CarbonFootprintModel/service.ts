import { request, ResponseData, IPageList } from '@src/api/request';

import {
  Request,
  Model,
  Process,
  InputOutputRequest,
  ChooseInputRequest,
  ImpactAssessmentResp,
  ContributionAnalysisNode,
} from './type';
import { FactorResp } from '../components/FactorDatabase/type';
import { SideBarNode } from '../components/ProcessLeftMenu/type';
import { ChooseInputOutputLibrary } from '../components/ProcessManageDrawer/type';
import { InputOutput } from '../components/ProcessManageTable/type';
/**
 * @description 碳足迹模型的列表
 */
export const getModelList = (params: Request) =>
  request<ResponseData<IPageList<Model>>>({
    method: 'GET',
    url: '/carbonfootprintLca/model/page',
    params,
  });

/**
 * @description 碳足迹模型删除
 */
export const postModelDelete = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/model/delete',
    data,
  });

/**
 * @description 碳足迹模型复制
 */
export const postModelCopy = (params: { id: number }) =>
  request<ResponseData<Model>>({
    method: 'GET',
    url: `/carbonfootprintLca/model/copy/${params.id}`,
    params,
  });

/** 目标与范围 */

/**
 * @description 碳足迹模型新增
 */
export const postModelAdd = (data: Model) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/carbonfootprintLca/model/add',
    data,
  });

/**
 * @description 碳足迹模型编辑
 */
export const postModelEdit = (data: Model) =>
  request<ResponseData<any>>({
    method: 'POST',
    url: '/carbonfootprintLca/model/edit',
    data,
  });

/**
 * @description 碳足迹模型详情
 */
export const getModelDetail = (params: { id: number }) =>
  request<ResponseData<Model>>({
    method: 'GET',
    url: `/carbonfootprintLca/model/${params.id}`,
    params,
  });

/** 目标与范围 */

/** 清单分析 */

/**
 * @description 左侧菜单树
 */
export const getProcessTreeData = (params: { modelId: number }) =>
  request<ResponseData<SideBarNode[]>>({
    method: 'GET',
    url: '/carbonfootprintLca/inputOutput/nodeList',
    params,
  });

/**
 * @description 保存到库
 */
export const postSaveToLibrary = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/process/addToLibrary',
    data,
  });

/**
 * @description 过程描述-编辑
 */
export const postProcessDescEdit = (data: Process) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/process/edit',
    data,
  });

/**
 * @description 过程描述-详情
 */
export const getProcessDescDetail = (params: { id: number }) =>
  request<ResponseData<Process>>({
    method: 'GET',
    url: `/carbonfootprintLca/process/${params.id}`,
    params,
  });

/**
 * @description 过程模型列表（产品、输入、输出）
 */
export const getProcessModelList = (params: InputOutputRequest) =>
  request<ResponseData<IPageList<InputOutput>>>({
    method: 'GET',
    url: '/carbonfootprintLca/inputOutput/list',
    params,
  });

/**
 * @description 过程模型删除（产品、输入、输出）
 */
export const postProcessModelDelete = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/inputOutput/delete',
    data,
  });

/**
 * @description 过程模型的新增（产品、输入、输出）
 */
export const postProcessModelAdd = (data: InputOutput) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/inputOutput/add',
    data,
  });

/**
 * @description 过程模型的编辑（产品、输入、输出）
 */
export const postProcessModelEdit = (data: InputOutput) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/inputOutput/edit',
    data,
  });

/**
 * @description 过程模型的详情（产品、输入、输出）
 */
export const getProcessModelDetail = (params: { id: number }) =>
  request<ResponseData<InputOutput>>({
    method: 'GET',
    url: `/carbonfootprintLca/inputOutput/${params.id}`,
    params,
  });

/**
 * @description 选择输入的弹窗
 */
export const getChooseInputList = (params: ChooseInputRequest) =>
  request<ResponseData<IPageList<ChooseInputOutputLibrary>>>({
    method: 'GET',
    url: '/carbonfootprintLca/inputOutput/renewingInputPage',
    params,
  });

/**
 * @description 因子详情id
 */
export const getFactorDetail = (params: { id: number }) =>
  request<ResponseData<FactorResp>>({
    method: 'GET',
    url: `/carbonfootprintLca/process/factor/${params.id}`,
    params,
  });

/**
 * @description 影响评价
 */
export const getImpactAssessmentData = (params: { modelId: number }) =>
  request<ResponseData<ImpactAssessmentResp>>({
    method: 'GET',
    url: `/carbonfootprintLca/inputOutput/impactAssessment`,
    params,
  });

/** 结果解释 */

/**
 * @description 贡献度分析
 */
export const getContributionAnalysisList = (params: { modelId: number }) =>
  request<ResponseData<ContributionAnalysisNode[]>>({
    method: 'GET',
    url: `/carbonfootprintLca/inputOutput/contributionAnalysis`,
    params,
  });
