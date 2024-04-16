/**
 * @description 过程管理的支撑材料
 */

import { IPageList, ResponseData, request } from '@/api/request';

import { SupportUploadFile, UploadFilesRequest } from './type';

/**
 * @description 过程管理的支撑材料-列表
 */
export const getProcessManageSupportFilesList = (params: UploadFilesRequest) =>
  request<ResponseData<IPageList<SupportUploadFile>>>({
    method: 'GET',
    url: `/carbonfootprintLca/uploadFile/page`,
    params,
  });

/**
 * @description 过程管理的支撑材料-新增
 */
export const postProcessManageSupportFilesAdd = (data: SupportUploadFile) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: `/carbonfootprintLca/uploadFile/add`,
    data,
  });

/**
 * @description 过程管理的支撑材料-删除
 */
export const postProcessManageSupportFilesDelete = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: `/carbonfootprintLca/uploadFile/delete`,
    data,
  });
