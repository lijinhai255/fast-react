import { request, ResponseData, IPageList } from '@src/api/request';

import {
  ProcessLibrary,
  Request,
  InputOutputLibraryRequest,
  ChooseInputRequest,
} from './type';
import { FactorResp } from '../components/FactorDatabase/type';
import { SideBarNode } from '../components/ProcessLeftMenu/type';
import { ChooseInputOutputLibrary } from '../components/ProcessManageDrawer/type';
import { InputOutput } from '../components/ProcessManageTable/type';
/**
 * @description 过程库-列表
 */
export const getProcessLibraryList = (params: Request) =>
  request<ResponseData<IPageList<ProcessLibrary>>>({
    method: 'GET',
    url: '/carbonfootprintLca/processLibrary/page',
    params,
  });

/**
 * @description 过程库-新增
 */
export const postProcessLibraryAdd = (data: ProcessLibrary) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/processLibrary/add',
    data,
  });

/**
 * @description 过程库-编辑
 */
export const postProcessLibraryEdit = (data: ProcessLibrary) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/processLibrary/edit',
    data,
  });

/**
 * @description 过程库-复制
 */
export const postProcessLibraryCopy = (data: ProcessLibrary) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/processLibrary/copy',
    data,
  });

/**
 * @description 过程库-详情
 */
export const getProcessLibraryDetail = (params: { id: number }) =>
  request<ResponseData<ProcessLibrary>>({
    method: 'GET',
    url: `/carbonfootprintLca/processLibrary/${params.id}`,
    params,
  });

/**
 * @description 过程库-删除
 */
export const postProcessLibraryDelete = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/processLibrary/delete',
    data,
  });

/**
 * @description 过程管理-左侧菜单树
 */
export const getProcessManageTreeData = (params: { processId: number }) =>
  request<ResponseData<SideBarNode[]>>({
    method: 'GET',
    url: '/carbonfootprintLca/inputOutputLibrary/nodeList',
    params,
  });

/**
 * @description 保存到库
 */
export const postSaveToLibrary = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/processLibrary/addToLibrary',
    data,
  });

/**
 * @description 过程管理-列表（产品、输入、输出）
 */
export const getProcessManageList = (params: InputOutputLibraryRequest) =>
  request<ResponseData<IPageList<InputOutput>>>({
    method: 'GET',
    url: '/carbonfootprintLca/inputOutputLibrary/list',
    params,
  });

/**
 * @description 过程管理-删除
 */
export const postProcessManageDelete = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/inputOutputLibrary/delete',
    data,
  });

/**
 * @description 过程管理-新增（产品、输入、输出）
 */
export const postProcessManageAdd = (data: InputOutput) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/inputOutputLibrary/add',
    data,
  });

/**
 * @description 过程管理-编辑（产品、输入、输出）
 */
export const postProcessManageEdit = (data: InputOutput) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/inputOutputLibrary/edit',
    data,
  });

/**
 * @description 过程管理-详情（产品、输入、输出）
 */
export const getProcessManageDetail = (params: { id: number }) =>
  request<ResponseData<InputOutput>>({
    method: 'GET',
    url: `/carbonfootprintLca/inputOutputLibrary/${params.id}`,
    params,
  });

/** 选择输入的列表 */
export const getChooseInputList = (params: ChooseInputRequest) =>
  request<ResponseData<IPageList<ChooseInputOutputLibrary>>>({
    method: 'GET',
    url: `/carbonfootprintLca/inputOutputLibrary/renewingInputPage`,
    params,
  });

/**
 * @description 因子详情id
 */
export const getFactorDetail = (params: { id: number }) =>
  request<ResponseData<FactorResp>>({
    method: 'GET',
    url: `/carbonfootprintLca/processLibrary/factor/${params.id}`,
    params,
  });
