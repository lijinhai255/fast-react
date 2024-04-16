import {
  Msg,
  getSystemMsgUnreadNum,
  postSystemMsgAllRead,
  postSystemMsgClick,
} from '@/sdks_v2/new/systemV2ApiDocs';
import { Toast } from '@/utils';

import store from '..';
import { noticeActions } from '../module/notice';
/**
 * 未读消息数量回调
 * */
export const getUnreadNumFn = async () => {
  const { data } = await getSystemMsgUnreadNum({});
  store.dispatch(noticeActions.updateCount(data?.data));
};
export const readAllFn = async (
  refresh?: (arg0: { stay: boolean; tab: number }) => void,
) => {
  await postSystemMsgAllRead({});
  getUnreadNumFn();
  // 更新消息中心列表
  refresh?.({ stay: false, tab: 0 });
};
/**
 * 判断用户是否有审批权限
 */
const checkMsgFn = async (
  item: Msg,
  changeIsOpen?: ((arg0: boolean) => void) | undefined,
) => {
  // 消息点击跳转到对应模块的列表页面
  /**
   * msgBizType
   * 401 企业碳核算-排放数据审核 /carbonAccounting/approvalManage
   * 402 企业碳核算-排放数据审核通过 /carbonAccounting/fillData
   * 403 企业碳核算-排放数据审核不通过 /carbonAccounting/fillData
   */
  const returnRelationStr = {
    401: '/carbonAccounting/approvalManage',
    402: '/carbonAccounting/fillData',
    403: '/carbonAccounting/fillData',
  };
  window.location.href = returnRelationStr?.[item?.msgBizType || '403'];
  changeIsOpen?.(false);
};
/**
 * 消息点击的回调
 * item：单条消息数据
 * changeIsOpen：是否展开
 * fn：回调函数
 * */

export const msgClickFn = async (
  item: Msg,
  changeIsOpen: ((arg0: boolean) => void) | undefined,
  fn: () => void,
) => {
  await postSystemMsgClick({
    req: { id: item.id || 0 },
  });
  // 判断页面

  fn?.();
  // 如果没有页面权限 toast提示
  if (!item.pagePermFlag) {
    // 消息提示
    Toast('error', '您暂没有该功能权限，请联系管理员开通。');
  } else {
    // 判断用户是否有审批权限
    checkMsgFn(item, changeIsOpen);
  }
};
