/*
 * @@description: 面包屑
 */
import { Breadcrumb } from 'antd';
import classNames from 'classnames';
import { compact } from 'lodash-es';
import { memo, useMemo } from 'react';
import useBreadcrumbs, { BreadcrumbsRoute } from 'use-react-router-breadcrumbs';

import { RouteMaps } from '@/router/utils/enums';

import style from './index.module.less';
import { allRoute } from '../../router/utils';

// FIXME 面包屑点击测试
function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs(
    allRoute.map(r => ({
      path: r.path,
      breadcrumb:
        typeof r.meta.title === 'string' ? r.meta.title : r.meta.title(),
      meta:
        typeof r.meta.title === 'string'
          ? r.meta
          : { ...r.meta, title: r.meta.title() },
      props: {
        isLink: !!r.component,
      },
    })) as BreadcrumbsRoute<string>[],
  );
  const usedRoute = useMemo(() => {
    return compact(
      breadcrumbs.map(r => {
        // 去除不需要展示的路由
        if (
          !r.match?.route?.path ||
          [RouteMaps.layout, '/'].includes(r.match.route?.path) ||
          // 去除一级菜单
          (r.match.route?.path?.split('/').length <= 2 &&
            !['/home'].includes(r.match.route?.path))
        )
          return null;

        return r;
      }),
    );
  }, [breadcrumbs]);

  if (!usedRoute?.length || usedRoute.length <= 1) return null;
  return (
    <div className={classNames(style.wrapper, 'bread-wrapper')}>
      <Breadcrumb>
        {usedRoute.map(route => (
          <Breadcrumb.Item key={route.match.pathname}>
            <a
              href={`${
                route.match.route?.props?.isLink
                  ? route.key
                  : // eslint-disable-next-line no-script-url
                    'javascript:void 0'
              }`}
              type='text'
              className='margin0 padding0'
            >
              {route.match.route?.breadcrumb as unknown as string}
            </a>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
}

export default memo(Breadcrumbs);
