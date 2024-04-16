/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-06 14:51:05
 */
import { Button, Result } from 'antd';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';

function Error404(): ReactElement {
  const navgate = useNavigate();
  return (
    <Result
      status='404'
      title='404'
      subTitle='系统提示：您访问的页面不存在，请检查后重新使用'
      extra={
        <Button
          type='primary'
          onClick={() => {
            navgate(RouteMaps.home, { replace: true });
          }}
        >
          返回首页
        </Button>
      }
    />
  );
}

export default Error404;
