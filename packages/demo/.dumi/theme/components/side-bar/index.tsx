import React, { useContext, memo } from 'react';
import { Menu } from 'antd';
import { context } from 'dumi/theme';
import { useHistory } from 'umi';
import { get, map, isPlainObject } from 'lodash';
import './index.scss';

// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;

type Meta = {
  filePath: string;
  slugs: Array<any>;
  title: string;
  group?: {
    title?: string;
  };
};

type MenuItem = {
  path: string;
  exact: boolean;
  meta: Meta;
  title: string;
  title_en?: string;
  children?: Array<MenuItem>;
};

type SideBarProps = {
  defaultSelectedKeys: Array<string>;
  defaultOpenKeys: Array<string>;
};

const convert = (menus) => {
  return map(menus, (menu) => {
    if (isPlainObject(menu)) {
      return {
        ...menu,
        key: menu.path,
        label: menu.title,
        children: Array.isArray(menu.children) ? convert(menu.children) : undefined,
      };
    }

    return menu;
  });
}

export default memo((props: SideBarProps) => {
  const { config } = useContext(context);
  const menus: MenuItem[] = get(config.menus, 'en-US.*', []) as MenuItem[];

  const history = useHistory();

  return (
    <div className="docs-side-bar">
      <Menu
        defaultSelectedKeys={props.defaultSelectedKeys}
        mode="inline"
        defaultOpenKeys={props.defaultOpenKeys}
        items={convert(menus)}
        onClick={(menu) => {
          history.push(menu.key);
        }}
      />
    </div>
  );
});
