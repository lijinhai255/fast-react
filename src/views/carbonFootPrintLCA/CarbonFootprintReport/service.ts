import { request, ResponseData } from '@src/api/request';

import { IPageReport, Report, Request } from './type';

/**
 * @description 碳足迹报告列表
 */
export const getReportList = (params: Request) =>
  request<ResponseData<IPageReport>>({
    method: 'GET',
    url: '/carbonfootprintLca/report/page',
    params,
  });

/**
 * @description 碳足迹报告新增
 */
export const postReportAdd = (data: Report) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/report/add',
    data,
  });

/**
 * @description 碳足迹报告编辑
 */
export const postReportEdit = (data: Report) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/report/edit',
    data,
  });

/**
 * @description 碳足迹报告详情
 */
export const getReportDetail = (params: { id: number }) =>
  request<ResponseData<Report>>({
    method: 'GET',
    url: `/carbonfootprintLca/report/${params.id}`,
    params,
  });

/**
 * @description 碳足迹报告删除
 */
export const postReportDelete = (data: { id: number }) =>
  request<ResponseData<{ [key: string]: any }>>({
    method: 'POST',
    url: '/carbonfootprintLca/report/delete',
    data,
  });
