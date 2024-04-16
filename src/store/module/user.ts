/*
 * @@description: 保存用户信息
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-07-25 14:38:56
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { loginToken } from '@/sdks/authV2ApiDocs';

import LocalStore from '../../utils/store';

export type UserState = loginToken & { orgType?: number };

export const USER_KEY = 'React-ant-Admin-user';

const localUser = LocalStore.getValue<UserState>(USER_KEY) || {};
const defaultUser: UserState = {
  ...localUser,
};

const userInfo = createSlice({
  name: 'userInfo',
  initialState: defaultUser,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserState>) => {
      Object.entries(action.payload).forEach(([k, val]) => {
        // @ts-ignore
        state[k] = val;
      });
      LocalStore.setValue(USER_KEY, state);
    },
    clearUserInfo: state => {
      LocalStore.removeValue(USER_KEY);

      Object.keys(state).forEach(k => {
        // @ts-ignore
        state[k] = '';
      });
    },
  },
});
export const userInfoActions = userInfo.actions;
export default userInfo.reducer;
