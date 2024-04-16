/*
 * @@description: 获取token
 */
import { UserState, USER_KEY } from '@/store/module/user';

import LocalStore from './store';

export const getToken: () => string = () => {
  const localUser = LocalStore.getValue<UserState>(USER_KEY) || {};
  return localUser.accessToken || '';
};
