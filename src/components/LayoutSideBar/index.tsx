/*
 * @@description: 菜单栏
 */
import { Menu } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import classnames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { menuRoutes } from '@/router/config';
import { getSystemPermissionRouter } from '@/sdks/systemV2ApiDocs';
import { systemInitFn } from '@/store/action/systemAction';
import { updateSideBarOpen } from '@/store/module/systemOperations';
import { BUTTON_AUTH } from '@/utils/const';
import LocalStore from '@/utils/store';

import { getPagePathList } from '../../router/utils';
import { RootState } from '../../store/types';
import Hamburger from '../Hamburger';
import './index.less';
import { RouterKeyArr, transformRoutesMenu } from './utils';

export const LayoutSideBar: FC = () => {
  const navigator = useNavigate();
  const inlineCollapsed: {
    inlineCollapsed?: boolean;
  } = {};

  const selector = useSelector<RootState, RootState>(state => state);
  const { layout, theme } = selector.systemSettings;
  const { sidebar } = selector.systemOperations;

  if (layout === 'side') {
    inlineCollapsed.inlineCollapsed = !sidebar.opened;
  }

  const { pathname } = window.location;
  const dispatch = useDispatch();
  const onTrigger = useCallback(() => {
    dispatch(updateSideBarOpen(!sidebar.opened));
  }, [sidebar, updateSideBarOpen]);

  const [authMenu, setAuthMenu] = useState<ItemType[]>();
  // 应用初始化
  const initFn = async () => {
    await systemInitFn();
  };
  // getRoter
  const getRouterFn = async () => {
    await getSystemPermissionRouter({}).then(({ data }) => {
      /** 所有权限 */
      const allPerms = data?.data;

      /** 按钮权限用 */
      const permsArray = allPerms?.map(item => item?.perms);
      LocalStore.setValue(BUTTON_AUTH, permsArray);

      /** 菜单权限 */
      if (allPerms?.length) {
        setAuthMenu(
          // allMenus,
          transformRoutesMenu(menuRoutes, undefined, allPerms),
        );
      } else {
        setAuthMenu([]);
      }
    });
  };
  // 通过接口拿到可用的菜单权限
  useEffect(() => {
    getRouterFn();
    initFn();
  }, []);
  return (
    <aside
      className={classnames(
        'layout__side-bar',
        `layout__side-bar--${theme}`,
        `layout__side-bar--${layout}`,
        {
          'layout__side-bar--close': !sidebar.opened && layout === 'side',
        },
      )}
    >
      <div className='layout__side-bar__menu'>
        <Menu
          selectedKeys={[
            ...RouterKeyArr.filter(item => pathname.indexOf(item) >= 0),
          ]}
          defaultOpenKeys={
            layout === 'side' && sidebar.opened ? getPagePathList(pathname) : []
          }
          mode={layout === 'side' ? 'inline' : 'horizontal'}
          theme={theme}
          {...inlineCollapsed}
          items={authMenu}
          onClick={selectInfo => {
            navigator(selectInfo.key);
          }}
          /** 自定义menu前缀 - 目前没有直接注入class类名的方式，需要暂时用这种方式覆盖 */
          prefixCls='sidebar-menu ant-menu'
          // subMenuCloseDelay={99999999}
        />
      </div>
      {layout === 'side' && (
        <Hamburger isActive={sidebar.opened} onTrigger={onTrigger} />
      )}
    </aside>
  );
};
