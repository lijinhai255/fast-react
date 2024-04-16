/*
 * @@description: 入口
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2023-03-30 13:36:57
 */
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './api/request';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';

createRoot(document.getElementById('root') || document.body).render(
  <ConfigProvider locale={locale}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line
reportWebVitals(console.warn);
