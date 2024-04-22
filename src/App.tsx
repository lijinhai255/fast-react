/*
 * @@description: 主入口、layout & 全局路由
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-02-10 15:58:53
 */
import { Spin } from 'antd';
import { Suspense, ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AntProvider } from './components/AntdProvider';
import config from './config';
import Auth from './layout/Auth';
import { layoutRouteList } from './router/utils';
import './styles/index.less';

function App(): ReactElement {
  // useEffect(() => {
  //   const language = 'ar';
  //   // 在 React 组件中根据语言环境设置变量
  //   document.documentElement.style.setProperty(
  //     '--text-direction',
  //     language === 'ar' ? 'rtl' : 'ltr',
  //   );
  //   document.documentElement.style.setProperty(
  //     '--transform',
  //     language === 'ar' ? 'scaleX(-1)' : 'unset',
  //   );
  // }, []);
  return (
    <AntProvider>
      <BrowserRouter basename={config.BASENAME}>
        <Routes>
          {layoutRouteList.map(route => {
            const Comp = route.component;
            if (Comp) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  errorElement={<div>error</div>}
                  element={
                    <Suspense
                      fallback={
                        <Spin size='large' className='layout__loading' />
                      }
                    >
                      <Auth route={route}>
                        <Comp />
                      </Auth>
                    </Suspense>
                  }
                />
              );
            }
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Navigate to={route.meta.redirect || '/'} />}
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </AntProvider>
  );
}

export default App;
