/*
 * @@description:
 * @Author: qifeng qifeng@carbonstop.net
 * @Date: 2022-12-08 15:25:57
 * @LastEditors: ljh255 jinhai@carbonstop.net
 * @LastEditTime: 2023-04-13 09:59:46
 */
import { IconFont } from '@components/IconFont';
import { ItemType, MenuItemGroupType } from 'antd/es/menu/hooks/useItems';

import { Routes } from '@/router/config';
import { Permission } from '@/sdks/systemV2ApiDocs';

/** *
 * 获取路由的key值
 * **/
export const RouterKeyArr: string[] = [];
/** 将 路由（route）转换成 菜单（menu） */
export const transformRoutesMenu = (
  routes: Routes[],
  group?: string,
  auths?: Permission[],
): ItemType[] | undefined => {
  const newMenu: (ItemType & { orderNum?: number })[] = [];
  /** menu中添加 group name 字段 */
  const menuGroup: MenuItemGroupType & { orderNum?: number } = {
    type: 'group',
    label: group,
    className: 'p-name',
    children: [],
  };
  routes.forEach((route, index) => {
    RouterKeyArr.push(route.path);
    const menuItemBase = {
      label:
        typeof route.meta.title === 'string'
          ? route.meta.title
          : route.meta.title(),
      icon: route.meta.icon && <IconFont icon={route.meta.icon} />,
      // 使用title 时 会显示tooltip
      // title: route.meta.title,
      key: route.path,
      popupOffset: [-5],
    };
    // 有权限的子集
    const children: (Routes & {
      orderNum?: number;
      meta?: { title: string };
    })[] = [];
    route.children?.forEach(r => {
      if (r.meta.showInMenu !== false && auths?.some(a => a.perms === r.path)) {
        children?.push({
          ...r,
          orderNum: auths?.filter(a => a.perms === r.path)[0]?.orderNum,
          // @ts-ignore
          label:
            auths?.filter(a => a.perms === r.path)[0]?.permissionName ||
            r.meta.title,
        });
      }
    });
    children.sort((a, b) => Number(a.orderNum) - Number(b.orderNum));

    // 有权限才渲染
    const hasAuth = auths?.some(a => a.perms === menuItemBase.key);
    //  获取排序
    const orderNum = auths?.filter(a => {
      return a.perms === menuItemBase.key;
    })[0]?.orderNum;
    const menuData = {
      ...menuItemBase,
      children:
        children &&
        // hasAuth &&
        transformRoutesMenu(children, menuItemBase.label, auths),
      orderNum,
      label: auths?.filter(a => {
        return a.perms === menuItemBase.key;
      })[0]?.permissionName,
    };

    if (hasAuth) {
      if (!group) {
        newMenu.push(menuData);
      } else {
        if (index === 0) {
          newMenu.push(menuGroup);
        }
        menuGroup.children = [
          ...(menuGroup.children || []),
          {
            ...menuItemBase,
          },
        ];
      }
    }
  });

  return newMenu.length
    ? newMenu.sort((a, b) => Number(a?.orderNum) - Number(b?.orderNum))
    : undefined;
};
