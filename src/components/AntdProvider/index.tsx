/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2023-02-10 15:52:03
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-03-30 13:41:06
 */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/dist/locale/zh-cn';
import { FC, PropsWithChildren } from 'react';

export const AntProvider: FC<PropsWithChildren> = ({ children }) => {
  // moment.locale('zh-cn');
  // 获取 样式变量
  // const settings = useSelector<RootState, RootState['systemSettings']>(
  //   s => s.systemSettings,
  // );
  return (
    <ConfigProvider
      locale={zhCN}

      // todo antd V5 暂时不支持
      // theme={{
      //   // 有类型没有暴露出来，需要忽略掉类型不一致问题
      //   token: {
      //     ...settings.colorVars,
      //   },
      // }}
    >
      {children}
    </ConfigProvider>
  );
};
