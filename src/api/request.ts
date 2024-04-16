/*
 * @@description: axios 请求拦截
 */
import { message, Modal } from 'antd';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { cloneDeep, isArray, isNil, omit } from 'lodash-es';

import { RouteMaps } from '@/router/utils/enums';
import { removeSideBarRoutes } from '@/store/module/systemOperations';
import { userInfoActions } from '@/store/module/user';
import { constant } from '@/utils/const';

import { REPONSE_CODE } from '../config';
import store from '../store/index';

export const baseUrl = import.meta.env.REACT_APP_API_URL || '/';
export interface ResponseData<T = any> {
  code: number;

  data: T;

  msg: string;
}

export interface IPageList<T = any> {
  /**
   * list
   */
  list?: T[];
  /**
   * 页码，从1开始
   */
  pageNum?: number;
  /**
   * 总页数
   */
  pages?: number;
  /**
   * 页面大小
   */
  pageSize?: number;
  /**
   * 当前页的数量
   */
  size?: number;
  /**
   * 总数
   */
  total?: number;
  [property: string]: any;
}

axios.defaults.baseURL = baseUrl;

const storeGetState = store.getState();

// 添加请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = storeGetState.userInfo.accessToken;
    // 获取用户token，用于校验
    if (token) {
      if (config.method === 'post' && config.data) {
        config.data = omit(config.data, ['createTime', 'updateTime']);
      }

      // eslint-disable-next-line no-param-reassign
      config.headers = {
        ...config.headers,
        authorization: token,
      };
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// 添加响应拦截器，拦截登录过期或者没有权限

axios.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const result = response?.data;
    // 登录已过期或者未登录或失效
    if (
      [REPONSE_CODE.LOGIN_EXPIRE, REPONSE_CODE.LOGIN_EXPIRE_ONE].includes(
        result?.code,
      )
    ) {
      Modal.confirm({
        title: '系统提示',
        content: result.msg,
        okText: '重新登录',
        cancelButtonProps: { style: { display: 'none' } },
        okButtonProps: {
          style: {
            backgroundColor:
              storeGetState.systemSettings.colorVars.colorPrimary,
            outline: 'none',
          },
        },
        onOk() {
          store.dispatch(removeSideBarRoutes());
          store.dispatch(userInfoActions.clearUserInfo());
          window.location.href = `${window.location.origin}${RouteMaps.login}?${
            constant.redirectURL
          }=${encodeURIComponent(window.location.href)}`;
        },
      });
      return Promise.reject(result.msg);
    }

    // 处理下载文件流
    if (result instanceof Blob) return Promise.resolve(response);

    /** 默认密码，需要修改 */
    if (
      result.code === REPONSE_CODE.CHANGE_PWD_CODE &&
      window.location.pathname !== RouteMaps.changePWD
    ) {
      window.location.href = RouteMaps.changePWD;
      return Promise.reject(response);
    }

    // 请求成功
    if (result.code === REPONSE_CODE.SUCCESS_CODE) {
      const targetData = cloneDeep(result);

      const { pageNum, page, current, pageSize, size } =
        response?.config?.params || {};
      // 页码可能出现的字段情况
      const pageNumber = pageNum || page || current;
      // 每页条数可能出现的字段情况
      const pageSizeS = pageSize || size;
      // 判断params中页码是否存在
      const hasPageParams = !isNil(pageNumber) && !isNil(pageSizeS);

      /**
       * 请求成功的请况下处理data数据，主要适用于后端返回的数据结构为
       * {code: 200, data: { rows: [], total: 0 }} 或 { code: 200, data: { list: [], total: 0 }} 或
       * { code: 200, data: { records: [], total: 0}} 或 { code: 200, data: { tree: [], total: 0 }}
       * 转换成 { code: 200, data: { success: true, rows: [], total: 0 }}
       * data.data的情况不做处理，没有页码的情况也不做处理
       * 适用于 procomponents 中的 table 组件, x-render 中的 table 组件
       */

      // 返回的列表数组可能出现的情况
      const { rows, list, records, tree, data, total = 0 } = result?.data || {};

      const responseData = rows || list || records || tree;
      // 判断返回的列表是否存在且为数组
      const hasResponseListData = !isNil(responseData) && isArray(responseData);

      /** 返回的页码不为空 且 列表数据不为空（rows、list、records、tree）且 data.data为空的情况下
       * 将data.rows、data.list、data.records、data.tree 赋值给data.data
       * 并给每条数据增加一个序号 allIndex
       */
      if (hasPageParams && hasResponseListData && isNil(data)) {
        const columnsIndexNumber = (pageNumber - 1) * pageSizeS;

        const resultData =
          responseData.map((item, index) => ({
            ...item,
            allIndex: columnsIndexNumber + index + 1,
          })) || [];

        targetData.data = {
          ...targetData.data,
          data: resultData,
          rows: resultData,
          total,
          success: true,
        };
      }

      return Promise.resolve({ ...response, data: targetData });
    }

    // 请求成功，状态不为成功时
    if (result?.msg) message.error(response.data.msg);
    return Promise.reject(response);
  },
  (error: AxiosError) => {
    if (error.message)
      message.error(error.message).then(
        () => {},
        () => {},
      );

    return Promise.reject(error);
  },
);

// 统一发起请求的函数
export function request<T>(
  options: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return axios.request<T>(options);
}
