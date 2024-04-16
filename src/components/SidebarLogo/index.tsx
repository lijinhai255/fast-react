/*
 * @@description: logo
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-05 15:16:40
 * @LastEditors: qifeng qifeng@carbonstop.net
 * @LastEditTime: 2022-12-08 11:39:15
 */
import classnames from 'classnames';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import AdminConfig from '../../config/index';
import './index.less';

function Logo() {
  return (
    <div className={classnames('layout__side-bar-logo-wrap')}>
      <Link to='/' className='layout__side-bar-link'>
        {AdminConfig.logo && (
          <img
            src={AdminConfig.logo}
            className='layout__side-bar-logo'
            alt='logo'
          />
        )}

        <h1 className='layout__side-bar-title'>{AdminConfig.title}</h1>
      </Link>
    </div>
  );
}

export default memo(Logo);
