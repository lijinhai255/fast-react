/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-22 10:57:47
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-22 11:43:16
 */
import { useEffect, useState } from 'react';

import { getSystemOrgUserList, OrgPojo } from '@/sdks/systemV2ApiDocs';

/** 获取用户下的所有组织 */
export const useOrgs = () => {
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
