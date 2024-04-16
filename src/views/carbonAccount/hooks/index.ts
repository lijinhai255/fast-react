/*
 * @@description: 碳账户 需要的Options
 * @Date: 2023-02-22 10:57:47
 * @LastEditTime: 2023-07-12 18:45:44
 */
import { useEffect, useState } from 'react';

import { getSystemOrgUserList, OrgPojo } from '@/sdks/systemV2ApiDocs';
import {
  getAccountsystemDept,
  getAccountsystemScene,
} from '@/sdks_v2/new/accountsystemV2ApiDocs';
/** 获取用户下的所有组织 */
export const UseOrgs = () => {
  const [orgs, setOrgs] = useState<OrgPojo[]>([]);
  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    getSystemOrgUserList({
      likeOrgName: '',
    }).then(({ data }) => {
      setOrgs(data?.data || []);
    });
  }, []);
  return orgs;
};

/** 获取用户分组 */
export const UseGroup = () => {
  const [group, setGroup] = useState<
    { label: string; value: number | string }[]
  >([]);
  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    getAccountsystemDept({ pageNum: 1, pageSize: 1000 }).then(({ data }) => {
      // setGroup(data?.data?.records || []);
      if (data.code === 200) {
        const newArr = data?.data?.records?.map(item => {
          return {
            label: item?.deptName || '',
            value: item?.id || 0,
          };
        });
        setGroup([...(newArr || [])]);
      }
    });
  }, []);
  return group;
};

/** 获取低碳场景 */
export const UseScene = () => {
  const [sence, setSence] = useState<{ label: string; value: number }[]>([]);
  useEffect(() => {
    // fixme 目前后端接口最多支持一次反200条  -  组织列表
    getAccountsystemScene({ pageNum: 1, pageSize: 1000 }).then(({ data }) => {
      if (data.code === 200) {
        const newArr = data?.data?.records?.map(item => {
          return {
            label: item?.sceneName || '',
            value: item?.id || 0,
          };
        });
        setSence([...(newArr || [])]);
      }
    });
  }, []);
  return sence;
};
