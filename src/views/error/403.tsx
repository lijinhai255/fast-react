/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-03-17 10:31:07
 */
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { RouteMaps } from '@/router/utils/enums';

function Error403() {
  const navgate = useNavigate();
  return (
    <Result
      status='403'
      title='403'
      subTitle='系统提示：你暂无有访问该页面的权限，请联系管理员添加权限后使用'
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

export default Error403;
