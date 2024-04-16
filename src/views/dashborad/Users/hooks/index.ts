/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-23 17:46:04
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-23 17:54:42
 */
import { useEffect, useState } from 'react';

import { getSystemUserPage, UserResp } from '@/sdks/systemV2ApiDocs';

export const useUsers = () => {
  const [user, setUser] = useState<UserResp[]>([]);

  useEffect(() => {
    getSystemUserPage({ pageNum: 1, pageSize: 999 }).then(({ data }) => {
      setUser(data?.data?.list || []);
    });
  }, []);
  return user;
};
